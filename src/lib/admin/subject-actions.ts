"use server";

import { createAuthClient, isCurrentUserAdmin } from "@/lib/auth/server";
import { adminSubjects } from "@/lib/content";
import type { Subject } from "@/lib/subjects";

/** 管理画面の一覧に出す最小限の情報 */
export type AdminSubjectSummary = { slug: string; name: string; category: string };

/** Supabase の subjects テーブルの1行 */
type SubjectRow = {
  slug: string;
  name: string;
  full_name: string;
  category: string;
  organizer: string;
  tone: string;
  catch_copy: string;
  overview: string;
  basics: Subject["basics"];
  training: Subject["training"];
  pricing_lead: string;
  pricing_plans: Subject["pricing"]["plans"];
  pricing_options: Subject["pricing"]["options"];
  pricing_note: string;
  struggles: Subject["struggles"];
};

function toSubject(row: SubjectRow): Subject {
  return {
    slug: row.slug,
    name: row.name,
    fullName: row.full_name,
    category: row.category,
    organizer: row.organizer,
    tone: row.tone as Subject["tone"],
    catchCopy: row.catch_copy,
    overview: row.overview,
    basics: row.basics,
    training: row.training,
    pricing: {
      lead: row.pricing_lead,
      plans: row.pricing_plans,
      options: row.pricing_options,
      note: row.pricing_note,
    },
    struggles: row.struggles,
  };
}

const columns =
  "slug, name, full_name, category, organizer, tone, catch_copy, overview, basics, training, pricing_lead, pricing_plans, pricing_options, pricing_note, struggles";

/** 管理画面の一覧用。名前順で全件取得する */
export async function listSubjectsForAdmin(): Promise<AdminSubjectSummary[]> {
  const supabase = await createAuthClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("subjects")
    .select("slug, name, category")
    .order("name", { ascending: true });

  if (error) {
    console.error("[admin/subjects] 一覧の取得に失敗しました:", error.message);
    return [];
  }

  return data as AdminSubjectSummary[];
}

/** 編集画面の初期値として、1件だけ取得する */
export async function getSubjectForAdmin(slug: string): Promise<Subject | null> {
  const supabase = await createAuthClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("subjects")
    .select(columns)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;

  return toSubject(data as SubjectRow);
}

export type ActionResult = { ok: true } | { ok: false; message: string };

/**
 * 検定ページの内容を更新する。
 * slug・カテゴリなど、削除・追加に関わる項目（存在自体）は変更できない
 * （Step 4 の要件は編集のみのため）。
 */
export async function updateSubject(slug: string, input: Subject): Promise<ActionResult> {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) return { ok: false, message: adminSubjects.errors.generic };

  const supabase = await createAuthClient();
  if (!supabase) return { ok: false, message: adminSubjects.errors.generic };

  const { error } = await supabase
    .from("subjects")
    .update({
      name: input.name.trim(),
      full_name: input.fullName.trim(),
      category: input.category.trim(),
      organizer: input.organizer.trim(),
      tone: input.tone,
      catch_copy: input.catchCopy.trim(),
      overview: input.overview.trim(),
      basics: input.basics,
      training: input.training,
      pricing_lead: input.pricing.lead.trim(),
      pricing_plans: input.pricing.plans,
      pricing_options: input.pricing.options,
      pricing_note: input.pricing.note.trim(),
      struggles: input.struggles,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) {
    console.error("[admin/subjects] 更新に失敗しました:", error.message);
    return { ok: false, message: adminSubjects.errors.generic };
  }

  return { ok: true };
}
