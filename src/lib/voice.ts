import { voice } from "@/lib/content";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { PlaceholderTone } from "@/components/ui/ImagePlaceholder";

export type VoiceItem = {
  id: string;
  gradeLabel: string;
  bio: string;
  name: string;
  tone: PlaceholderTone;
  photo: string | null;
  totalHours: string;
  mockBestScore: string;
  totalDays: string;
  mockCount: string;
  recommendPoint: string;
};

/** Supabase の voices テーブルの1行 */
type VoiceRow = {
  id: string;
  grade_label: string;
  bio: string;
  name: string;
  tone: string;
  photo: string | null;
  total_hours: string;
  mock_best_score: string;
  total_days: string;
  mock_count: string;
  recommend_point: string;
};

const validTones: PlaceholderTone[] = ["sakura", "lemon", "sky", "mint"];

function toTone(value: string): PlaceholderTone {
  return (validTones as string[]).includes(value) ? (value as PlaceholderTone) : "sakura";
}

/** Supabase 未設定・取得失敗時に使う仮データ */
const mockVoiceItems: VoiceItem[] = voice.items.map((item) => ({ ...item }));

function toVoiceItem(row: VoiceRow): VoiceItem {
  return {
    id: row.id,
    gradeLabel: row.grade_label,
    bio: row.bio,
    name: row.name,
    tone: toTone(row.tone),
    photo: row.photo,
    totalHours: row.total_hours,
    mockBestScore: row.mock_best_score,
    totalDays: row.total_days,
    mockCount: row.mock_count,
    recommendPoint: row.recommend_point,
  };
}

/**
 * 合格体験記を、新しい順に取得する。
 * Supabase が未設定、または取得に失敗した場合は仮データを返すため、
 * 呼び出し側でエラー処理をする必要はない。
 */
export async function getVoiceItems(): Promise<VoiceItem[]> {
  const supabase = getSupabaseClient();

  if (!supabase) return mockVoiceItems;

  const { data, error } = await supabase
    .from("voices")
    .select(
      "id, grade_label, bio, name, tone, photo, total_hours, mock_best_score, total_days, mock_count, recommend_point",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[voice] Supabase からの取得に失敗しました:", error.message);
    return mockVoiceItems;
  }

  if (!data) return [];

  return (data as VoiceRow[]).map(toVoiceItem);
}

/** 表示中のデータがモックかどうか（開発時の確認用） */
export const isUsingMockVoice = !isSupabaseConfigured;
