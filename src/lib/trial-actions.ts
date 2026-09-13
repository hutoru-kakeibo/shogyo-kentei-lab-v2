"use server";

import { getSupabaseClient } from "@/lib/supabase";
import { sendTrialMails } from "@/lib/emails";
import { trialForm } from "@/lib/content";
import { isBookable, type TrialSchedule } from "@/lib/trial-schedule";
import { loadTrialSchedule } from "@/lib/trial-schedule-data";

export type TrialApplicationInput = {
  subject: string;
  targetGrade: string;
  name: string;
  kana: string;
  gradeYear: string;
  school: string;
  email: string;
  tel: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  consent: boolean;
  /** ボット対策の隠し項目。人間が入力することはない */
  website: string;
};

export type SubmitResult = { ok: true } | { ok: false; message: string };

/** 日付（YYYY-MM-DD）ごとの、すでに埋まっている時間の一覧 */
export type TakenSlots = Record<string, string[]>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Postgres の一意制約違反エラーコード */
const UNIQUE_VIOLATION = "23505";

/**
 * 申し込みフォームのカレンダーに使う受付設定。
 * ページのキャッシュを通さずに毎回取得するので、管理画面での変更がすぐ反映される。
 */
export async function getTrialSchedule(): Promise<TrialSchedule> {
  return loadTrialSchedule();
}

/**
 * 指定期間内で、すでに予約が入っている日時の一覧を取得する。
 * 氏名・連絡先などの個人情報は含まれない（Supabase側の trial_taken_slots 関数がそう作られている）。
 * カレンダーの空き状況表示に使う。取得に失敗した場合は空を返し、カレンダー側は
 * 「制約なし」として動作を続ける（フォーム自体は使えなくならない）。
 */
export async function getTakenSlots(fromDate: string, toDate: string): Promise<TakenSlots> {
  const supabase = getSupabaseClient();
  if (!supabase) return {};

  const { data, error } = await supabase.rpc("trial_taken_slots", {
    p_from: fromDate,
    p_to: toDate,
  });

  if (error) {
    console.error("[trial] 予約状況の取得に失敗しました:", error.message);
    return {};
  }

  const taken: TakenSlots = {};
  for (const row of (data ?? []) as { preferred_date: string; preferred_time: string }[]) {
    (taken[row.preferred_date] ??= []).push(row.preferred_time);
  }
  return taken;
}

/**
 * 無料体験の申し込みを保存する。
 * ブラウザ側の検証はすり抜けられるため、サーバー側でも必須項目を確認してから書き込む。
 */
export async function submitTrialApplication(
  input: TrialApplicationInput,
): Promise<SubmitResult> {
  // 隠し項目が埋まっているのは自動投稿。保存せず、正常終了として返す
  if (input.website.trim()) return { ok: true };

  const filled =
    input.subject &&
    input.targetGrade &&
    input.name.trim() &&
    input.gradeYear &&
    input.school.trim() &&
    emailPattern.test(input.email.trim()) &&
    input.preferredDate &&
    input.preferredTime &&
    input.consent;

  if (!filled) return { ok: false, message: trialForm.errors.invalid };

  // 受付外の日時は保存しない（フォームを開いたあとに管理画面で受付を止めた場合など）
  const schedule = await loadTrialSchedule();
  if (!isBookable(schedule, input.preferredDate, input.preferredTime)) {
    return { ok: false, message: trialForm.errors.slotUnavailable };
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    console.error("[trial] Supabase が未設定のため申し込みを保存できませんでした");
    return { ok: false, message: trialForm.errors.send };
  }

  const { error } = await supabase.from("trial_applications").insert({
    subject: input.subject,
    target_grade: input.targetGrade,
    name: input.name.trim(),
    kana: input.kana.trim() || null,
    grade_year: input.gradeYear,
    school: input.school.trim(),
    email: input.email.trim(),
    tel: input.tel.trim() || null,
    preferred_date: input.preferredDate,
    preferred_time: input.preferredTime,
    message: input.message.trim() || null,
    consent: input.consent,
  });

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      // 同じ日時にほぼ同時に別の人が申し込んだ場合、DB側の一意制約に阻まれてここに来る。
      // クライアント側の空き状況チェックはすり抜けられる（表示後に他の人が予約する等）ため、
      // 最終的な防波堤としてここでも必ず弾く。
      return { ok: false, message: trialForm.errors.slotTaken };
    }
    console.error("[trial] 申し込みの保存に失敗しました:", error.message);
    return { ok: false, message: trialForm.errors.send };
  }

  // 保存は済んでいるので、メールが送れなくても申し込みは成立させる
  await sendTrialMails(input);

  return { ok: true };
}
