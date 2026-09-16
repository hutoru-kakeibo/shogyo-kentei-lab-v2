"use server";

import { createAuthClient, isCurrentUserAdmin } from "@/lib/auth/server";
import { adminTrials } from "@/lib/content";
import type { ApplicationKind } from "@/lib/trial-actions";

export type TrialStatus = (typeof adminTrials.statusOptions)[number]["value"];

export type AdminTrialItem = {
  id: string;
  kind: ApplicationKind;
  subject: string;
  targetGrade: string;
  name: string;
  kana: string | null;
  gradeYear: string;
  school: string;
  email: string;
  tel: string | null;
  preferredDate: string;
  preferredTime: string;
  message: string | null;
  status: TrialStatus;
  createdAt: string;
};

/** Supabase の trial_applications テーブルの1行 */
type TrialRow = {
  id: string;
  /** trial_applications_kind.sql 実行前の環境では存在しない */
  kind?: string;
  subject: string;
  target_grade: string;
  name: string;
  kana: string | null;
  grade_year: string;
  school: string;
  email: string;
  tel: string | null;
  preferred_date: string;
  preferred_time: string;
  message: string | null;
  status: string;
  created_at: string;
};

function toAdminItem(row: TrialRow): AdminTrialItem {
  return {
    id: row.id,
    kind: row.kind === "lesson" ? "lesson" : "trial",
    subject: row.subject,
    targetGrade: row.target_grade,
    name: row.name,
    kana: row.kana,
    gradeYear: row.grade_year,
    school: row.school,
    email: row.email,
    tel: row.tel,
    preferredDate: row.preferred_date,
    preferredTime: row.preferred_time,
    message: row.message,
    // 想定外の値が入っていた場合は "new" 扱いにして、一覧の表示自体は壊さない
    status: (adminTrials.statusOptions.some((option) => option.value === row.status)
      ? row.status
      : "new") as TrialStatus,
    createdAt: row.created_at,
  };
}

/**
 * 申し込み一覧を、新しい順に取得する。
 * kind 列の追加前でも一覧が壊れないよう、列を指定せずに読む。
 * RLS（is_admin()）で保護されているため、管理者としてログインしていなければ何も返らない。
 */
export async function listTrialsForAdmin(): Promise<AdminTrialItem[]> {
  const supabase = await createAuthClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("trial_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/trials] 一覧の取得に失敗しました:", error.message);
    return [];
  }

  return (data as TrialRow[]).map(toAdminItem);
}

/** 詳細画面用に、1件だけ取得する */
export async function getTrialForAdmin(id: string): Promise<AdminTrialItem | null> {
  const supabase = await createAuthClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("trial_applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return toAdminItem(data as TrialRow);
}

export type ActionResult = { ok: true } | { ok: false; message: string };

export async function updateTrialStatus(id: string, status: TrialStatus): Promise<ActionResult> {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) return { ok: false, message: adminTrials.errors.generic };

  const supabase = await createAuthClient();
  if (!supabase) return { ok: false, message: adminTrials.errors.generic };

  const { error } = await supabase
    .from("trial_applications")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("[admin/trials] 対応状況の更新に失敗しました:", error.message);
    return { ok: false, message: adminTrials.errors.generic };
  }

  return { ok: true };
}
