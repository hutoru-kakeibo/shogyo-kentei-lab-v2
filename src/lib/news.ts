import { news } from "@/lib/content";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export type NewsItem = {
  id: string;
  /** 表示用の日付（2026.09.05 の形） */
  date: string;
  category: string;
  title: string;
};

/** Supabase の news テーブルの1行 */
type NewsRow = {
  id: string;
  published_at: string;
  category: string;
  title: string;
};

/** Supabase 未設定・取得失敗時に使う仮データ */
const mockNewsItems: NewsItem[] = news.items.map((item) => ({ ...item }));

/** 2026-09-05 → 2026.09.05 */
function formatDate(published: string) {
  return published.slice(0, 10).replaceAll("-", ".");
}

/**
 * 新着情報を取得する。
 * Supabase が未設定、または取得に失敗した場合は仮データを返すため、
 * 呼び出し側でエラー処理をする必要はない。
 */
export async function getNewsItems(limit = 3): Promise<NewsItem[]> {
  const supabase = getSupabaseClient();

  if (!supabase) return mockNewsItems.slice(0, limit);

  const { data, error } = await supabase
    .from("news")
    .select("id, published_at, category, title")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    // ページ全体を落とさず、仮データで表示を続ける
    console.error("[news] Supabase からの取得に失敗しました:", error.message);
    return mockNewsItems.slice(0, limit);
  }

  if (!data || data.length === 0) return [];

  return (data as NewsRow[]).map((row) => ({
    id: row.id,
    date: formatDate(row.published_at),
    category: row.category,
    title: row.title,
  }));
}

/** 表示中のデータがモックかどうか（開発時の確認用） */
export const isUsingMockNews = !isSupabaseConfigured;
