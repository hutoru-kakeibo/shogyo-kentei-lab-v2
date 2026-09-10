import { subjects as fallbackSubjects, type Subject, type SubjectTone } from "@/lib/subjects";
import { getSupabaseClient } from "@/lib/supabase";

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

const validTones: SubjectTone[] = ["sakura", "lemon", "sky", "mint"];

function toTone(value: string): SubjectTone {
  return (validTones as string[]).includes(value) ? (value as SubjectTone) : "sakura";
}

function toSubject(row: SubjectRow): Subject {
  return {
    slug: row.slug,
    name: row.name,
    fullName: row.full_name,
    category: row.category,
    organizer: row.organizer,
    tone: toTone(row.tone),
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

/**
 * 検定詳細ページのデータを取得する。
 * Supabase が未設定、または取得に失敗した・該当行が無い場合は、
 * subjects.ts の固定データにフォールバックする
 * （公開できる検定＝ページを持つ検定の一覧そのものは、今回の Step 4 の範囲外の
 * 「追加・削除」に当たるため、subjectSlugs は引き続き subjects.ts 側を正とする）。
 */
export async function getSubjectData(slug: string): Promise<Subject | undefined> {
  const supabase = getSupabaseClient();
  const fallback = fallbackSubjects.find((subject) => subject.slug === slug);

  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("subjects")
    .select(columns)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[subjects] Supabase からの取得に失敗しました:", error.message);
    return fallback;
  }

  return data ? toSubject(data as SubjectRow) : fallback;
}
