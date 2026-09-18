"use server";

import { createAuthClient, isCurrentUserAdmin } from "@/lib/auth/server";
import { adminVoices } from "@/lib/content";
import type { VoiceItem } from "@/lib/voice";
import type { PlaceholderTone } from "@/components/ui/ImagePlaceholder";

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

const columns =
  "id, grade_label, bio, name, tone, photo, total_hours, mock_best_score, total_days, mock_count, recommend_point";

/** 管理画面用に、新しい順で全件取得する */
export async function listVoicesForAdmin(): Promise<VoiceItem[]> {
  const supabase = await createAuthClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("voices")
    .select(columns)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/voices] 一覧の取得に失敗しました:", error.message);
    return [];
  }

  return (data as VoiceRow[]).map(toVoiceItem);
}

export type ActionResult = { ok: true } | { ok: false; message: string };

export type VoiceFormInput = {
  gradeLabel: string;
  bio: string;
  name: string;
  tone: PlaceholderTone;
  /** アップロード済みの公開URL。写真を選ばなかった場合は null */
  photo: string | null;
  totalHours: string;
  mockBestScore: string;
  totalDays: string;
  mockCount: string;
  recommendPoint: string;
};

function validate(input: VoiceFormInput): string | null {
  const required = [
    input.gradeLabel,
    input.bio,
    input.name,
    input.totalHours,
    input.mockBestScore,
    input.totalDays,
    input.mockCount,
  ];
  if (required.some((value) => !value.trim())) return adminVoices.errors.required;
  return null;
}

export async function createVoice(input: VoiceFormInput): Promise<ActionResult> {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) return { ok: false, message: adminVoices.errors.generic };

  const validationError = validate(input);
  if (validationError) return { ok: false, message: validationError };

  const supabase = await createAuthClient();
  if (!supabase) return { ok: false, message: adminVoices.errors.generic };

  const { error } = await supabase.from("voices").insert({
    grade_label: input.gradeLabel.trim(),
    bio: input.bio.trim(),
    name: input.name.trim(),
    tone: input.tone,
    photo: input.photo,
    total_hours: input.totalHours.trim(),
    mock_best_score: input.mockBestScore.trim(),
    total_days: input.totalDays.trim(),
    mock_count: input.mockCount.trim(),
    recommend_point: input.recommendPoint.trim(),
  });

  if (error) {
    console.error("[admin/voices] 作成に失敗しました:", error.message);
    return { ok: false, message: adminVoices.errors.generic };
  }

  return { ok: true };
}

export async function deleteVoice(id: string): Promise<ActionResult> {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) return { ok: false, message: adminVoices.errors.generic };

  const supabase = await createAuthClient();
  if (!supabase) return { ok: false, message: adminVoices.errors.generic };

  const { error } = await supabase.from("voices").delete().eq("id", id);

  if (error) {
    console.error("[admin/voices] 削除に失敗しました:", error.message);
    return { ok: false, message: adminVoices.errors.generic };
  }

  return { ok: true };
}
