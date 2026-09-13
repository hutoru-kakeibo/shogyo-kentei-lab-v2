"use server";

import { revalidatePath } from "next/cache";
import { createAuthClient, isCurrentUserAdmin } from "@/lib/auth/server";
import { adminTrialSettings } from "@/lib/content";
import {
  DATE_PATTERN,
  TIME_PATTERN,
  normalizeTrialSchedule,
  type TrialSchedule,
} from "@/lib/trial-schedule";
import { loadTrialSchedule } from "@/lib/trial-schedule-data";

export type TrialSettingsResult = { ok: true } | { ok: false; message: string };

export async function getTrialSettingsForAdmin(): Promise<TrialSchedule> {
  return loadTrialSchedule();
}

function isIntegerBetween(value: unknown, min: number, max: number) {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
}

/** ブラウザから届いた値はそのまま信用せず、形式と範囲を確認する */
function validate(input: TrialSchedule): string | null {
  const { errors } = adminTrialSettings;

  if (
    !isIntegerBetween(input.leadDays, 0, 60) ||
    !isIntegerBetween(input.rangeDays, 1, 365) ||
    input.leadDays > input.rangeDays
  ) {
    return errors.range;
  }

  const slotsValid =
    Array.isArray(input.slotsByWeekday) &&
    input.slotsByWeekday.length === 7 &&
    input.slotsByWeekday.every(
      (slots) =>
        Array.isArray(slots) &&
        slots.every((time) => typeof time === "string" && TIME_PATTERN.test(time)),
    );
  if (!slotsValid) return errors.time;

  const datesValid =
    Array.isArray(input.closedDates) &&
    input.closedDates.every((date) => typeof date === "string" && DATE_PATTERN.test(date));
  if (!datesValid) return errors.date;

  return null;
}

export async function updateTrialSettings(input: TrialSchedule): Promise<TrialSettingsResult> {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) return { ok: false, message: adminTrialSettings.errors.generic };

  const validationError = validate(input);
  if (validationError) return { ok: false, message: validationError };

  const supabase = await createAuthClient();
  if (!supabase) return { ok: false, message: adminTrialSettings.errors.generic };

  const schedule = normalizeTrialSchedule(input);
  const { data, error } = await supabase
    .from("trial_settings")
    .update({
      lead_days: schedule.leadDays,
      range_days: schedule.rangeDays,
      slots_by_weekday: Object.fromEntries(
        schedule.slotsByWeekday.map((slots, weekday) => [String(weekday), slots]),
      ),
      closed_dates: schedule.closedDates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1)
    .select("id");

  if (error) {
    console.error("[admin/trial-settings] 保存に失敗しました:", error.message);
    return { ok: false, message: adminTrialSettings.errors.generic };
  }

  // 更新対象の行が無い＝ supabase/trial_settings.sql が未実行
  if (!data || data.length === 0) {
    return { ok: false, message: adminTrialSettings.errors.notSetUp };
  }

  revalidatePath("/trial");
  return { ok: true };
}
