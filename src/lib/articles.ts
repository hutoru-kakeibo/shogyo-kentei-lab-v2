import { cache } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export type ArticleSummary = {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** YYYY-MM-DD */
  publishedAt: string;
  /** ISO 8601 */
  updatedAt: string;
};

export type Article = ArticleSummary & { body: string };

type ArticleRow = {
  slug: string;
  title: string;
  description: string;
  category: string;
  published_at: string;
  updated_at: string;
  body?: string;
};

const summaryColumns = "slug, title, description, category, published_at, updated_at";

function toSummary(row: ArticleRow): ArticleSummary {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

/** 2026-09-05 → 2026.09.05 */
export function formatArticleDate(date: string) {
  return date.slice(0, 10).replaceAll("-", ".");
}

/** 更新日時（UTC）を日本時間の YYYY-MM-DD にする */
export function toJstDate(isoDateTime: string) {
  return new Date(isoDateTime).toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

/**
 * 公開中のコラムを新しい順に取得する。
 * Supabase が未設定・取得失敗のときは空配列を返す（コラムは仮データを出さない）。
 */
export async function getArticleSummaries(limit = 100): Promise<ArticleSummary[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("articles")
    .select(summaryColumns)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[articles] 一覧の取得に失敗しました:", error.message);
    return [];
  }

  return (data as ArticleRow[]).map(toSummary);
}

/** generateMetadata とページ本体の両方から呼ぶので、1リクエスト内の重複取得をまとめる */
export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("articles")
    .select(`${summaryColumns}, body`)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("[articles] 記事の取得に失敗しました:", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as ArticleRow;
  return { ...toSummary(row), body: row.body ?? "" };
});
