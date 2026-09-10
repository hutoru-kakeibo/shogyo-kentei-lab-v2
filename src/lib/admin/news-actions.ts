"use server";

import { createAuthClient, isCurrentUserAdmin } from "@/lib/auth/server";
import { adminNews } from "@/lib/content";

export type AdminNewsItem = {
  id: string;
  /** input[type=date] にそのまま渡せる YYYY-MM-DD 形式 */
  publishedAt: string;
  category: string;
  title: string;
  isPublished: boolean;
};

export type ActionResult = { ok: true } | { ok: false; message: string };

/** Supabase の news テーブルの1行（管理画面では非公開の記事や公開日も含めて全列使う） */
type NewsRow = {
  id: string;
  published_at: string;
  category: string;
  title: string;
  is_published: boolean;
};

function toAdminItem(row: NewsRow): AdminNewsItem {
  return {
    id: row.id,
    publishedAt: row.published_at,
    category: row.category,
    title: row.title,
    isPublished: row.is_published,
  };
}

/**
 * 管理画面用に、公開・非公開を問わず全記事を取得する。
 * RLS（is_admin()）で保護されているため、管理者としてログインしていなければ
 * 何も返ってこない（トップページの getNewsItems とは別物）。
 */
export async function listNewsForAdmin(): Promise<AdminNewsItem[]> {
  const supabase = await createAuthClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("news")
    .select("id, published_at, category, title, is_published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[admin/news] 一覧の取得に失敗しました:", error.message);
    return [];
  }

  return (data as NewsRow[]).map(toAdminItem);
}

/** 編集画面の初期値として、1件だけ取得する */
export async function getNewsForAdmin(id: string): Promise<AdminNewsItem | null> {
  const supabase = await createAuthClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("news")
    .select("id, published_at, category, title, is_published")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return toAdminItem(data as NewsRow);
}

export type NewsFormInput = {
  publishedAt: string;
  category: string;
  title: string;
  isPublished: boolean;
};

function validate(input: NewsFormInput): string | null {
  if (!input.publishedAt || !input.category.trim() || !input.title.trim()) {
    return adminNews.errors.required;
  }
  return null;
}

/** 管理者以外からの呼び出しを弾く共通ガード（RLSが最終防波堤だが、ここでも早めに弾く） */
async function requireAdmin(): Promise<ActionResult | null> {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) return { ok: false, message: adminNews.errors.generic };
  return null;
}

export async function createNews(input: NewsFormInput): Promise<ActionResult> {
  const guardResult = await requireAdmin();
  if (guardResult) return guardResult;

  const validationError = validate(input);
  if (validationError) return { ok: false, message: validationError };

  const supabase = await createAuthClient();
  if (!supabase) return { ok: false, message: adminNews.errors.generic };

  const { error } = await supabase.from("news").insert({
    published_at: input.publishedAt,
    category: input.category.trim(),
    title: input.title.trim(),
    is_published: input.isPublished,
  });

  if (error) {
    console.error("[admin/news] 作成に失敗しました:", error.message);
    return { ok: false, message: adminNews.errors.generic };
  }

  return { ok: true };
}

export async function updateNews(id: string, input: NewsFormInput): Promise<ActionResult> {
  const guardResult = await requireAdmin();
  if (guardResult) return guardResult;

  const validationError = validate(input);
  if (validationError) return { ok: false, message: validationError };

  const supabase = await createAuthClient();
  if (!supabase) return { ok: false, message: adminNews.errors.generic };

  const { error } = await supabase
    .from("news")
    .update({
      published_at: input.publishedAt,
      category: input.category.trim(),
      title: input.title.trim(),
      is_published: input.isPublished,
    })
    .eq("id", id);

  if (error) {
    console.error("[admin/news] 更新に失敗しました:", error.message);
    return { ok: false, message: adminNews.errors.generic };
  }

  return { ok: true };
}

export async function deleteNews(id: string): Promise<ActionResult> {
  const guardResult = await requireAdmin();
  if (guardResult) return guardResult;

  const supabase = await createAuthClient();
  if (!supabase) return { ok: false, message: adminNews.errors.generic };

  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) {
    console.error("[admin/news] 削除に失敗しました:", error.message);
    return { ok: false, message: adminNews.errors.generic };
  }

  return { ok: true };
}
