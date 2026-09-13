import { getSupabaseClient } from "@/lib/supabase";
import {
  fallbackTrialSchedule,
  normalizeTrialSchedule,
  type TrialSchedule,
} from "@/lib/trial-schedule";

/** Supabase の trial_settings テーブルの1行 */
type TrialSettingsRow = {
  lead_days: number;
  range_days: number;
  slots_by_weekday: Record<string, unknown>;
  closed_dates: unknown;
  /** trial_settings_date_overrides.sql 実行前の環境では存在しない */
  date_overrides?: unknown;
};

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}

function toSchedule(row: TrialSettingsRow): TrialSchedule {
  const overrides =
    row.date_overrides && typeof row.date_overrides === "object" && !Array.isArray(row.date_overrides)
      ? (row.date_overrides as Record<string, unknown>)
      : {};

  return normalizeTrialSchedule({
    leadDays: row.lead_days,
    rangeDays: row.range_days,
    slotsByWeekday: Array.from({ length: 7 }, (_, weekday) =>
      toStringArray(row.slots_by_weekday?.[String(weekday)]),
    ),
    closedDates: toStringArray(row.closed_dates),
    dateOverrides: Object.fromEntries(
      Object.entries(overrides).map(([date, slots]) => [date, toStringArray(slots)]),
    ),
  });
}

/**
 * 管理画面で設定した受付設定を取得する。
 * テーブル未作成・取得失敗のときは content.ts の設定で動かし、フォームを止めない。
 */
export async function loadTrialSchedule(): Promise<TrialSchedule> {
  const supabase = getSupabaseClient();
  if (!supabase) return fallbackTrialSchedule;

  // date_overrides 列の追加前でも取得できるよう、列を指定せずに読む
  const { data, error } = await supabase.from("trial_settings").select("*").eq("id", 1).maybeSingle();

  if (error) {
    console.error("[trial] 受付設定の取得に失敗しました:", error.message);
    return fallbackTrialSchedule;
  }

  return data ? toSchedule(data as TrialSettingsRow) : fallbackTrialSchedule;
}
