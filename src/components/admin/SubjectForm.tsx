"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, CircleCheck, Plus, Trash2 } from "lucide-react";
import { adminSubjects } from "@/lib/content";
import { updateSubject } from "@/lib/admin/subject-actions";
import type { Subject, SubjectTone } from "@/lib/subjects";

const inputClass =
  "w-full rounded-xl border border-sakura-200 bg-white px-3 py-2.5 text-[14px] text-ink outline-none placeholder:text-ink-muted/60 focus:border-sakura-400 focus:ring-2 focus:ring-sakura-200";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-round text-[13px] font-bold text-ink">{label}</label>
      {children}
    </div>
  );
}

/**
 * 「行を追加・削除できるリスト」の共通編集UI。
 * basics / pricing.plans / struggles のどれも
 * このパターン（オブジェクトの配列を増減させながら編集する）なので、まとめて面倒を見る。
 */
function RepeatableList<T extends Record<string, string>>({
  items,
  onChange,
  fields,
  emptyItem,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  fields: { key: keyof T; label: string; multiline?: boolean }[];
  emptyItem: T;
}) {
  const updateItem = (index: number, key: keyof T, value: string) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="space-y-2 rounded-xl border border-sakura-200 bg-canvas/40 p-3"
        >
          {fields.map((field) => (
            <div key={String(field.key)}>
              <label className="mb-1 block text-[11px] font-bold text-ink-muted">
                {field.label}
              </label>
              {field.multiline ? (
                <textarea
                  rows={3}
                  value={item[field.key]}
                  onChange={(event) => updateItem(index, field.key, event.target.value)}
                  className={`${inputClass} resize-y`}
                />
              ) : (
                <input
                  type="text"
                  value={item[field.key]}
                  onChange={(event) => updateItem(index, field.key, event.target.value)}
                  className={inputClass}
                />
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="flex items-center gap-1 text-[12px] font-bold text-sakura-600"
          >
            <Trash2 className="size-3.5" strokeWidth={2.5} />
            {adminSubjects.removeRowLabel}
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, emptyItem])}
        className="flex items-center gap-1 rounded-full bg-sakura-100 px-4 py-2 text-[12px] font-bold text-sakura-600"
      >
        <Plus className="size-3.5" strokeWidth={2.5} />
        {adminSubjects.addRowLabel}
      </button>
    </div>
  );
}

/** training は「文字列の配列」なので、RepeatableList とは別の単純な形で編集する */
function RepeatableStrings({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <textarea
            rows={3}
            value={item}
            onChange={(event) =>
              onChange(items.map((v, i) => (i === index ? event.target.value : v)))
            }
            className={`${inputClass} resize-y`}
          />
          <button
            type="button"
            aria-label={adminSubjects.removeRowLabel}
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-sakura-100 text-sakura-600"
          >
            <Trash2 className="size-4" strokeWidth={2.5} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="flex items-center gap-1 rounded-full bg-sakura-100 px-4 py-2 text-[12px] font-bold text-sakura-600"
      >
        <Plus className="size-3.5" strokeWidth={2.5} />
        {adminSubjects.addRowLabel}
      </button>
    </div>
  );
}

/** 検定ページの1つの区切り（見出しと説明）。fixed は「ここでは直せません」の欄 */
function Section({
  title,
  hint,
  fixed = false,
  children,
}: {
  title: string;
  hint: string;
  fixed?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`space-y-4 rounded-2xl p-4 ring-1 ${fixed ? "bg-canvas/60 ring-sakura-100" : "bg-white ring-sakura-200"}`}
    >
      <div>
        <h2 className={`font-round text-base font-bold ${fixed ? "text-ink-muted" : "text-ink"}`}>{title}</h2>
        <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">{hint}</p>
      </div>
      {children}
    </section>
  );
}

/**
 * 検定ページの編集フォーム。上から、検定ページに出る順に並べる（2026-11-05）。
 * 料金はページに出していないが、生徒管理アプリのコマ予約に使うので、級ごとの料金だけ最後に残す。
 * 料金のリード文・注記・追加オプションはどこにも出していないので、画面には出さずに今の値のまま保存する
 */
export function SubjectForm({ initial }: { initial: Subject }) {
  const router = useRouter();
  const { fields, sections } = adminSubjects;

  const [name, setName] = useState(initial.name);
  const [fullName, setFullName] = useState(initial.fullName);
  const [category, setCategory] = useState(initial.category);
  const [organizer, setOrganizer] = useState(initial.organizer);
  const [tone, setTone] = useState<SubjectTone>(initial.tone);
  const [catchCopy, setCatchCopy] = useState(initial.catchCopy);
  const [overview, setOverview] = useState(initial.overview);
  const [basics, setBasics] = useState(initial.basics);
  const [training, setTraining] = useState(initial.training);
  const [pricingPlans, setPricingPlans] = useState(initial.pricing.plans);
  const [struggles, setStruggles] = useState(initial.struggles);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setDone(false);
    setSubmitting(true);

    const input: Subject = {
      slug: initial.slug,
      name,
      fullName,
      category,
      organizer,
      tone,
      catchCopy,
      overview,
      basics,
      training,
      pricing: { ...initial.pricing, plans: pricingPlans },
      struggles,
    };

    const result = await updateSubject(initial.slug, input);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setDone(true);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-[12px] leading-relaxed text-ink-muted">{adminSubjects.editLead}</p>

      <Section title={sections.top.title} hint={sections.top.hint}>
        <Field label={fields.category}>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} />
        </Field>
        <Field label={fields.name}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <Field label={fields.fullName}>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
        </Field>
        <Field label={fields.catchCopy}>
          <input type="text" value={catchCopy} onChange={(e) => setCatchCopy(e.target.value)} className={inputClass} />
        </Field>
        <div>
          <label className="mb-1.5 block font-round text-[13px] font-bold text-ink">{fields.tone}</label>
          <div className="flex flex-wrap gap-2">
            {adminSubjects.toneOptions.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold ring-1 transition ${
                  tone === option.value
                    ? "bg-sakura-500 text-white ring-sakura-500"
                    : "bg-white text-ink-muted ring-sakura-200"
                }`}
              >
                <input
                  type="radio"
                  name="tone"
                  value={option.value}
                  checked={tone === option.value}
                  onChange={() => setTone(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      </Section>

      <Section title={sections.about.title} hint={sections.about.hint}>
        <Field label={fields.overview}>
          <textarea
            rows={5}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>
        <div>
          <p className="mb-1 font-round text-[13px] font-bold text-ink">{fields.basics}</p>
          <p className="mb-2 text-[11px] leading-relaxed text-ink-muted">{fields.basicsHint}</p>
          <RepeatableList
            items={basics}
            onChange={setBasics}
            fields={[
              { key: "label", label: fields.basicsLabel },
              { key: "value", label: fields.basicsValue },
            ]}
            emptyItem={{ label: "", value: "" }}
          />
        </div>
        <Field label={fields.organizer}>
          <input type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} className={inputClass} />
        </Field>
      </Section>

      <Section title={sections.schedule.title} hint={sections.schedule.hint} fixed />

      <Section title={sections.training.title} hint={sections.training.hint}>
        <RepeatableStrings items={training} onChange={setTraining} />
      </Section>

      <Section title={sections.choice.title} hint={sections.choice.hint} fixed />

      <Section title={sections.struggles.title} hint={sections.struggles.hint}>
        <RepeatableList
          items={struggles}
          onChange={setStruggles}
          fields={[
            { key: "problem", label: fields.struggleProblem },
            { key: "solution", label: fields.struggleSolution, multiline: true },
          ]}
          emptyItem={{ problem: "", solution: "" }}
        />
      </Section>

      <Section title={sections.fixed.title} hint={sections.fixed.hint} fixed />

      <Section title={sections.pricing.title} hint={sections.pricing.hint}>
        <RepeatableList
          items={pricingPlans}
          onChange={setPricingPlans}
          fields={[
            { key: "grade", label: fields.planGrade },
            { key: "price", label: fields.planPrice },
            { key: "unit", label: fields.planUnit },
          ]}
          emptyItem={{ grade: "", price: "", unit: "円 / 1時間" }}
        />
      </Section>

      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-2xl bg-sakura-100 p-4 text-[13px] font-bold leading-relaxed text-sakura-600"
        >
          <CircleAlert className="size-5 shrink-0" strokeWidth={2.5} />
          {error}
        </p>
      ) : null}

      {/* 長いフォームでも、いつでも保存できるように下に固定する */}
      <div className="sticky bottom-0 -mx-6 flex items-center gap-3 border-t border-sakura-100 bg-white/95 px-6 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-6 py-3 font-round text-[15px] font-bold text-white shadow-lg shadow-sakura-600/30 transition active:translate-y-0.5 disabled:opacity-60"
        >
          {submitting ? adminSubjects.savingLabel : adminSubjects.saveLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/subjects")}
          className="rounded-full bg-white px-5 py-3 font-round text-[14px] font-bold text-ink-muted ring-1 ring-sakura-200"
        >
          {adminSubjects.cancelLabel}
        </button>
        {done ? (
          <span className="flex items-center gap-1 text-[12px] font-bold text-mint-500">
            <CircleCheck className="size-4" strokeWidth={2.5} />
            {adminSubjects.savedLabel}
          </span>
        ) : null}
      </div>
    </form>
  );
}
