"use server";

import { revalidatePath } from "next/cache";
import { createAuthClient, isCurrentUserAdmin } from "@/lib/auth/server";
import { adminArticles } from "@/lib/content";

export type AdminArticleItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  body: string;
  /** input[type=date] にそのまま渡せる YYYY-MM-DD 形式 */
  publishedAt: string;
  isPublished: boolean;
};

export type ArticleFormInput = Omit<AdminArticleItem, "id">;

export type ArticleActionResult = { ok: true } | { ok: false; message: string };

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  body: string;
  published_at: string;
  is_published: boolean;
};

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
/** Postgres の一意制約違反 */
const UNIQUE_VIOLATION = "23505";

function toAdminItem(row: ArticleRow): AdminArticleItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    body: row.body,
    publishedAt: row.published_at,
    isPublished: row.is_published,
  };
}

function normalize(input: ArticleFormInput): ArticleFormInput {
  return {
    ...input,
    slug: input.slug.trim(),
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category.trim(),
    body: input.body.trim(),
  };
}

function validate(input: ArticleFormInput): string | null {
  if (!input.title || !input.slug || !input.description || !input.body || !input.category || !input.publishedAt) {
    return adminArticles.errors.required;
  }
  if (!SLUG_PATTERN.test(input.slug)) return adminArticles.errors.slugFormat;
  return null;
}

function toRow(input: ArticleFormInput) {
  return {
    slug: input.slug,
    title: input.title,
    description: input.description,
    category: input.category,
    body: input.body,
    published_at: input.publishedAt,
    is_published: input.isPublished,
  };
}

/** 一覧・記事ページ・トップのコラム欄・サイトマップを、再ビルドなしですぐ反映させる */
function revalidateArticlePaths(slugs: string[]) {
  revalidatePath("/");
  revalidatePath("/columns");
  revalidatePath("/sitemap.xml");
  for (const slug of new Set(slugs)) {
    revalidatePath(`/columns/${slug}`);
  }
}

async function requireAdmin() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) return null;
  return createAuthClient();
}

/** 管理画面用に、下書きを含む全コラムを取得する（RLSにより管理者でなければ空になる） */
export async function listArticlesForAdmin(): Promise<AdminArticleItem[]> {
  const supabase = await createAuthClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, description, category, body, published_at, is_published")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/articles] 一覧の取得に失敗しました:", error.message);
    return [];
  }

  return (data as ArticleRow[]).map(toAdminItem);
}

export async function getArticleForAdmin(id: string): Promise<AdminArticleItem | null> {
  const supabase = await createAuthClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, description, category, body, published_at, is_published")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return toAdminItem(data as ArticleRow);
}

export async function createArticle(rawInput: ArticleFormInput): Promise<ArticleActionResult> {
  const supabase = await requireAdmin();
  if (!supabase) return { ok: false, message: adminArticles.errors.generic };

  const input = normalize(rawInput);
  const validationError = validate(input);
  if (validationError) return { ok: false, message: validationError };

  const { error } = await supabase.from("articles").insert(toRow(input));

  if (error) {
    if (error.code === UNIQUE_VIOLATION) return { ok: false, message: adminArticles.errors.slugTaken };
    console.error("[admin/articles] 作成に失敗しました:", error.message);
    return { ok: false, message: adminArticles.errors.generic };
  }

  revalidateArticlePaths([input.slug]);
  return { ok: true };
}

export async function updateArticle(id: string, rawInput: ArticleFormInput): Promise<ArticleActionResult> {
  const supabase = await requireAdmin();
  if (!supabase) return { ok: false, message: adminArticles.errors.generic };

  const input = normalize(rawInput);
  const validationError = validate(input);
  if (validationError) return { ok: false, message: validationError };

  // URLを変えた場合に、古いURLのページもキャッシュから消すため先に取得しておく
  const { data: before } = await supabase.from("articles").select("slug").eq("id", id).maybeSingle();

  const { error } = await supabase
    .from("articles")
    .update({ ...toRow(input), updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    if (error.code === UNIQUE_VIOLATION) return { ok: false, message: adminArticles.errors.slugTaken };
    console.error("[admin/articles] 更新に失敗しました:", error.message);
    return { ok: false, message: adminArticles.errors.generic };
  }

  revalidateArticlePaths([input.slug, ...(before?.slug ? [before.slug as string] : [])]);
  return { ok: true };
}

export async function deleteArticle(id: string): Promise<ArticleActionResult> {
  const supabase = await requireAdmin();
  if (!supabase) return { ok: false, message: adminArticles.errors.generic };

  const { data: before } = await supabase.from("articles").select("slug").eq("id", id).maybeSingle();
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    console.error("[admin/articles] 削除に失敗しました:", error.message);
    return { ok: false, message: adminArticles.errors.generic };
  }

  revalidateArticlePaths(before?.slug ? [before.slug as string] : []);
  return { ok: true };
}
