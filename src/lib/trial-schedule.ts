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
  /** その日だけの受付時間（YYYY-MM-DD → 時間の一覧）。曜日ごとの設定より優先する */
  dateOverrides: Record<string, string[]>;
};

export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function uniqueSortedTimes(times: string[]) {
  return [...new Set(times.filter((time) => TIME_PATTERN.test(time)))].sort();
}

/** 取得前に並べ替え・重複削除しておき、どこで使っても同じ形になるようにする */
export function normalizeTrialSchedule(input: TrialSchedule): TrialSchedule {
  return {
    leadDays: Math.trunc(input.leadDays),
    rangeDays: Math.trunc(input.rangeDays),
    slotsByWeekday: Array.from({ length: 7 }, (_, weekday) =>
      uniqueSortedTimes(input.slotsByWeekday[weekday] ?? []),
    ),
    closedDates: [...new Set(input.closedDates.filter((date) => DATE_PATTERN.test(date)))].sort(),
    dateOverrides: Object.fromEntries(
      Object.entries(input.dateOverrides ?? {})
        .filter(([date, slots]) => DATE_PATTERN.test(date) && Array.isArray(slots))
        .map(([date, slots]) => [date, uniqueSortedTimes(slots)] as const)
        .sort(([a], [b]) => a.localeCompare(b)),
    ),
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
  dateOverrides: {},
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

/** 日本時間の現在時刻（HH:mm） */
function currentTimeInJapan(now: Date) {
  return now.toLocaleTimeString("sv-SE", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

/**
 * その日の受付時間（予約が埋まっているかは見ない）。
 * 休講日 → その日だけの設定 → 曜日ごとの設定 の順に優先する。
 */
export function slotsForDate(schedule: TrialSchedule, dateKey: string, now = new Date()) {
  if (schedule.closedDates.includes(dateKey)) return [];
  const slots =
    schedule.dateOverrides[dateKey] ?? schedule.slotsByWeekday[weekdayOf(dateKey)] ?? [];
  // 当日も受け付ける設定のとき、すでに過ぎた時間は選べないようにする
  if (dateKey === todayInJapan(now)) {
    const currentTime = currentTimeInJapan(now);
    return slots.filter((slot) => slot > currentTime);
  }
  return slots;
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
