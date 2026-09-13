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
};

function toSchedule(row: TrialSettingsRow): TrialSchedule {
  return normalizeTrialSchedule({
    leadDays: row.lead_days,
    rangeDays: row.range_days,
    slotsByWeekday: Array.from({ length: 7 }, (_, weekday) => {
      const slots = row.slots_by_weekday?.[String(weekday)];
      return Array.isArray(slots) ? slots.map(String) : [];
    }),
    closedDates: Array.isArray(row.closed_dates) ? row.closed_dates.map(String) : [],
  });
}

/**
 * 管理画面で設定した受付設定を取得する。
 * テーブル未作成・取得失敗のときは content.ts の設定で動かし、フォームを止めない。
 */
export async function loadTrialSchedule(): Promise<TrialSchedule> {
  const supabase = getSupabaseClient();
  if (!supabase) return fallbackTrialSchedule;

  const { data, error } = await supabase
    .from("trial_settings")
    .select("lead_days, range_days, slots_by_weekday, closed_dates")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("[trial] 受付設定の取得に失敗しました:", error.message);
    return fallbackTrialSchedule;
  }

  return data ? toSchedule(data as TrialSettingsRow) : fallbackTrialSchedule;
}
