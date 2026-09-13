import { trialSchedule as defaultSchedule } from "@/lib/content";

/**
 * 無料体験の受付設定と、それを使った日付計算。
 * 申し込みフォーム（ブラウザ）・申し込み処理（サーバー）・管理画面の全部から使うため、
 * ここにはデータ取得を書かない（取得は trial-schedule-data.ts）。
 */
export type TrialSchedule = {
  /** 何日後から受け付けるか（0 = 当日から） */
  leadDays: number;
  /** 今日から何日先まで受け付けるか */
  rangeDays: number;
  /** 0=日曜 … 6=土曜 の順に7件。空配列の曜日は受付なし */
  slotsByWeekday: string[][];
  /** 受付を止める日（YYYY-MM-DD） */
  closedDates: string[];
};

export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** 取得前に並べ替え・重複削除しておき、どこで使っても同じ形になるようにする */
export function normalizeTrialSchedule(input: TrialSchedule): TrialSchedule {
  return {
    leadDays: Math.trunc(input.leadDays),
    rangeDays: Math.trunc(input.rangeDays),
    slotsByWeekday: Array.from({ length: 7 }, (_, weekday) =>
      [...new Set((input.slotsByWeekday[weekday] ?? []).filter((time) => TIME_PATTERN.test(time)))].sort(),
    ),
    closedDates: [...new Set(input.closedDates.filter((date) => DATE_PATTERN.test(date)))].sort(),
  };
}

/** Supabase 未設定・未作成・取得失敗のときに使う、content.ts の設定 */
export const fallbackTrialSchedule: TrialSchedule = normalizeTrialSchedule({
  leadDays: defaultSchedule.leadDays,
  rangeDays: defaultSchedule.rangeDays,
  slotsByWeekday: Array.from({ length: 7 }, (_, weekday) => [
    ...(defaultSchedule.slotsByWeekday[weekday] ?? []),
  ]),
  closedDates: [...defaultSchedule.closedDates],
});

/** YYYY-MM-DD の曜日（0=日曜）。実行環境のタイムゾーンに左右されないよう UTC で計算する */
export function weekdayOf(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** YYYY-MM-DD に日数を足す */
export function addDaysToKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

/** 日本時間の今日（YYYY-MM-DD）。サーバー（UTC）とブラウザで同じ日付になるようにする */
export function todayInJapan(now = new Date()) {
  return now.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

/** カレンダーで選べる最初と最後の日 */
export function bookableRange(schedule: TrialSchedule, today = todayInJapan()) {
  return {
    from: addDaysToKey(today, schedule.leadDays),
    to: addDaysToKey(today, schedule.rangeDays),
  };
}

/** その日に受け付けている時間（予約が埋まっているかは見ない） */
export function slotsForDate(schedule: TrialSchedule, dateKey: string) {
  if (schedule.closedDates.includes(dateKey)) return [];
  return schedule.slotsByWeekday[weekdayOf(dateKey)] ?? [];
}

/** その日時が受付対象か（予約が埋まっているかは見ない） */
export function isBookable(
  schedule: TrialSchedule,
  dateKey: string,
  time: string,
  today = todayInJapan(),
) {
  if (!DATE_PATTERN.test(dateKey)) return false;
  const { from, to } = bookableRange(schedule, today);
  if (dateKey < from || dateKey > to) return false;
  return slotsForDate(schedule, dateKey).includes(time);
}
