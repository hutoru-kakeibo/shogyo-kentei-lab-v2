"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { CircleAlert, CircleCheck, Send } from "lucide-react";
import { courseSearch, lessonForm, trialForm } from "@/lib/content";
import { submitTrialApplication, type ApplicationKind } from "@/lib/trial-actions";

// 「今日」を基準にカレンダーを組み立てるため、サーバー側では描画しない（表示ズレ防止）
const TrialDateTimePicker = dynamic(
  () => import("@/components/forms/TrialDateTimePicker").then((mod) => mod.TrialDateTimePicker),
  {
    ssr: false,
    loading: () => <div className="h-72 animate-pulse rounded-2xl bg-sakura-100" />,
  },
);

type Values = {
  subject: string;
  targetGrade: string;
  name: string;
  kana: string;
  gradeYear: string;
  school: string;
  email: string;
  tel: string;
  /** 希望日（YYYY-MM-DD） */
  preferredDate: string;
  /** 希望時間（HH:mm） */
  preferredTime: string;
  message: string;
  consent: boolean;
  /** ボット対策の隠し項目。人間には見えない */
  website: string;
};

const initialValues: Values = {
  subject: "",
  targetGrade: "",
  name: "",
  kana: "",
  gradeYear: "",
  school: "",
  email: "",
  tel: "",
  preferredDate: "",
  preferredTime: "",
  message: "",
  consent: false,
  website: "",
};

/** 無料体験と授業で変わる文言。それ以外の項目・エラー文言は共通 */
const copyByKind = {
  trial: {
    subjectLabel: "受けたい検定",
    scheduleLabel: trialForm.schedule.label,
    messageLabel: "相談したいこと",
    messagePlaceholder: "つまずいているところ、検定日までの残り期間など",
    submitLabel: trialForm.submitLabel,
    done: trialForm.done,
  },
  lesson: {
    subjectLabel: lessonForm.subjectLabel,
    scheduleLabel: lessonForm.scheduleLabel,
    messageLabel: lessonForm.messageLabel,
    messagePlaceholder: lessonForm.messagePlaceholder,
    submitLabel: lessonForm.submitLabel,
    done: lessonForm.done,
  },
} as const;

/** 検定の選択肢は「検定を探す」の一覧から生成する */
const subjectOptions = [
  ...courseSearch.categories.flatMap((category) => category.items.map((item) => item.name)),
  trialForm.undecidedSubject,
];

const inputClass =
  "w-full rounded-xl border border-sakura-200 bg-white px-4 py-3 text-[15px] text-ink outline-none placeholder:text-ink-muted/60 focus:border-sakura-400 focus:ring-2 focus:ring-sakura-200";

function FieldLabel({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-2">
      <span className="font-round text-[14px] font-bold text-ink">{label}</span>
      <span
        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
          required ? "bg-sakura-500 text-white" : "bg-sakura-100 text-sakura-600"
        }`}
      >
        {required ? trialForm.requiredLabel : trialForm.optionalLabel}
      </span>
    </label>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[12px] font-bold text-sakura-600">
      {message}
    </p>
  );
}

type Props = {
  /** 無料体験（既定）か、既存生徒の授業か */
  kind?: ApplicationKind;
  /** 授業の申し込みのときに、ページURLの秘密のトークンを渡す */
  lessonToken?: string;
};

export function TrialForm({ kind = "trial", lessonToken }: Props) {
  const copy = copyByKind[kind];
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState("");
  const [done, setDone] = useState(false);
  // 「その日時は埋まった」エラーのあと、日程ピッカーを丸ごと作り直して
  // 最新の空き状況を取得し直させるためのキー
  const [pickerKey, setPickerKey] = useState(0);

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof Values, string>> = {};
    const { errors: messages } = trialForm;

    if (!values.subject) next.subject = messages.select;
    if (!values.targetGrade) next.targetGrade = messages.select;
    if (!values.name.trim()) next.name = messages.required;
    if (!values.gradeYear) next.gradeYear = messages.select;
    if (!values.school.trim()) next.school = messages.required;
    if (!values.email.trim()) {
      next.email = messages.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      next.email = messages.email;
    }
    if (!values.preferredDate) {
      next.preferredDate = messages.date;
    } else if (!values.preferredTime) {
      next.preferredTime = messages.time;
    }
    if (!values.consent) next.consent = messages.consent;

    return next;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      // 最初のエラー項目までスクロールして気づけるようにする
      const firstKey = Object.keys(nextErrors)[0];
      document.getElementById(firstKey)?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setSendError("");

    const result = await submitTrialApplication({ ...values, kind, lessonToken });

    setSubmitting(false);

    if (!result.ok) {
      // 保存できていないので、完了画面は出さず入力内容を残したままエラーを表示する
      setSendError(result.message);

      if (
        result.message === trialForm.errors.slotTaken ||
        result.message === trialForm.errors.slotUnavailable
      ) {
        // 選んでいた日時はもう埋まっている（または受付を止めた）ので選択を外し、
        // ピッカーを作り直して最新の受付設定・空き状況を取り直す
        setValues((current) => ({ ...current, preferredDate: "", preferredTime: "" }));
        setPickerKey((key) => key + 1);
      }
      return;
    }

    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-mint-100">
          <CircleCheck className="size-9 text-mint-500" strokeWidth={2.5} />
        </span>
        <h2 className="mt-4 font-round text-xl font-bold text-ink">{copy.done.title}</h2>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{copy.done.message}</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-6 py-3 font-round text-[15px] font-bold text-white shadow-lg shadow-sakura-600/30"
        >
          {copy.done.backLabel}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* 受けたい（受講する）検定 */}
      <div>
        <FieldLabel htmlFor="subject" label={copy.subjectLabel} required />
        <select
          id="subject"
          value={values.subject}
          onChange={(event) => update("subject", event.target.value)}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={inputClass}
        >
          <option value="">選択してください</option>
          {subjectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ErrorText id="subject-error" message={errors.subject} />
      </div>

      {/* 受験予定の級 */}
      <div>
        <FieldLabel htmlFor="targetGrade" label="受験予定の級" required />
        <select
          id="targetGrade"
          value={values.targetGrade}
          onChange={(event) => update("targetGrade", event.target.value)}
          aria-invalid={Boolean(errors.targetGrade)}
          aria-describedby={errors.targetGrade ? "targetGrade-error" : undefined}
          className={inputClass}
        >
          <option value="">選択してください</option>
          {trialForm.targetGrades.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ErrorText id="targetGrade-error" message={errors.targetGrade} />
      </div>

      {/* お名前 */}
      <div>
        <FieldLabel htmlFor="name" label="お名前" required />
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="商業 花子"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={inputClass}
        />
        <ErrorText id="name-error" message={errors.name} />
      </div>

      {/* ふりがな */}
      <div>
        <FieldLabel htmlFor="kana" label="ふりがな" />
        <input
          id="kana"
          type="text"
          placeholder="しょうぎょう はなこ"
          value={values.kana}
          onChange={(event) => update("kana", event.target.value)}
          className={inputClass}
        />
      </div>

      {/* 学年 */}
      <div>
        <FieldLabel htmlFor="gradeYear" label="学年" required />
        <select
          id="gradeYear"
          value={values.gradeYear}
          onChange={(event) => update("gradeYear", event.target.value)}
          aria-invalid={Boolean(errors.gradeYear)}
          aria-describedby={errors.gradeYear ? "gradeYear-error" : undefined}
          className={inputClass}
        >
          <option value="">選択してください</option>
          {trialForm.gradeYears.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ErrorText id="gradeYear-error" message={errors.gradeYear} />
      </div>

      {/* 学校名 */}
      <div>
        <FieldLabel htmlFor="school" label="学校名" required />
        <input
          id="school"
          type="text"
          placeholder="○○県立○○商業高等学校"
          value={values.school}
          onChange={(event) => update("school", event.target.value)}
          aria-invalid={Boolean(errors.school)}
          aria-describedby={errors.school ? "school-error" : undefined}
          className={inputClass}
        />
        <ErrorText id="school-error" message={errors.school} />
      </div>

      {/* メールアドレス */}
      <div>
        <FieldLabel htmlFor="email" label="メールアドレス" required />
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="example@mail.com"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClass}
        />
        <ErrorText id="email-error" message={errors.email} />
      </div>

      {/* 電話番号 */}
      <div>
        <FieldLabel htmlFor="tel" label="電話番号" />
        <input
          id="tel"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="09012345678"
          value={values.tel}
          onChange={(event) => update("tel", event.target.value)}
          className={inputClass}
        />
      </div>

      {/* 希望日時 */}
      <div>
        <FieldLabel htmlFor="preferredDate" label={copy.scheduleLabel} required />
        <div id="preferredDate">
          <TrialDateTimePicker
            key={pickerKey}
            date={values.preferredDate}
            time={values.preferredTime}
            onDateChange={(next) => update("preferredDate", next)}
            onTimeChange={(next) => update("preferredTime", next)}
            dateError={errors.preferredDate}
            timeError={errors.preferredTime}
          />
        </div>
      </div>

      {/* 相談したいこと／先生に伝えたいこと */}
      <div>
        <FieldLabel htmlFor="message" label={copy.messageLabel} />
        <textarea
          id="message"
          rows={4}
          placeholder={copy.messagePlaceholder}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* 保護者の同意 */}
      <div id="consent" className="rounded-2xl bg-lemon-50 p-4 ring-1 ring-lemon-200">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(event) => update("consent", event.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-0.5 size-5 shrink-0 accent-sakura-500"
          />
          <span className="text-[13px] leading-relaxed text-ink">{trialForm.consent}</span>
        </label>
        <ErrorText id="consent-error" message={errors.consent} />
      </div>

      {/* ボット対策の隠し項目。人間には見えず、埋まっていたら自動投稿と判断する */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={values.website}
        onChange={(event) => update("website", event.target.value)}
        className="absolute left-[-9999px] size-0 opacity-0"
      />

      {sendError ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-2xl bg-sakura-100 p-4 text-[13px] font-bold leading-relaxed text-sakura-600"
        >
          <CircleAlert className="size-5 shrink-0" strokeWidth={2.5} />
          {sendError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-8 py-4 font-round text-base font-bold text-white shadow-lg shadow-sakura-600/30 transition active:translate-y-0.5 disabled:opacity-60"
      >
        {submitting ? trialForm.submittingLabel : copy.submitLabel}
        {submitting ? null : <Send className="size-5" strokeWidth={2.5} />}
      </button>
    </form>
  );
}
