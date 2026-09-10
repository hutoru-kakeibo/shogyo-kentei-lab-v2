"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { adminVoices } from "@/lib/content";
import { createAuthBrowserClient } from "@/lib/auth/client";
import { createVoice, type VoiceFormInput } from "@/lib/admin/voice-actions";
import type { PlaceholderTone } from "@/components/ui/ImagePlaceholder";

const inputClass =
  "w-full rounded-xl border border-sakura-200 bg-white px-4 py-3 text-[15px] text-ink outline-none placeholder:text-ink-muted/60 focus:border-sakura-400 focus:ring-2 focus:ring-sakura-200";

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-round text-[14px] font-bold text-ink">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-[11px] text-ink-muted">{hint}</p> : null}
    </div>
  );
}

/** ファイル名の拡張子・記号を落として、アップロード先パスに使える形にする */
function toSafeFileName(fileName: string) {
  const dot = fileName.lastIndexOf(".");
  const ext = dot >= 0 ? fileName.slice(dot) : "";
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext.toLowerCase()}`;
}

export function VoiceForm() {
  const router = useRouter();
  const { form } = adminVoices;

  const [gradeLabel, setGradeLabel] = useState("");
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [tone, setTone] = useState<PlaceholderTone>("sakura");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [totalHours, setTotalHours] = useState("");
  const [mockBestScore, setMockBestScore] = useState("");
  const [totalDays, setTotalDays] = useState("");
  const [mockCount, setMockCount] = useState("");
  const [recommendPoint, setRecommendPoint] = useState("");

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    let photoUrl: string | null = null;

    if (photoFile) {
      setUploading(true);
      try {
        const supabase = createAuthBrowserClient();
        const path = toSafeFileName(photoFile.name);
        const { error: uploadError } = await supabase.storage
          .from("voice-photos")
          .upload(path, photoFile, { upsert: false });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("voice-photos").getPublicUrl(path);
        photoUrl = data.publicUrl;
      } catch (uploadCatchError) {
        console.error("[admin/voices] 写真のアップロードに失敗しました:", uploadCatchError);
        setError(adminVoices.errors.uploadFailed);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    setSubmitting(true);

    const input: VoiceFormInput = {
      gradeLabel,
      bio,
      name,
      tone,
      photo: photoUrl,
      totalHours,
      mockBestScore,
      totalDays,
      mockCount,
      recommendPoint,
    };

    const result = await createVoice(input);

    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }

    router.push("/admin/voices");
    router.refresh();
  };

  const busy = uploading || submitting;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field id="gradeLabel" label={form.gradeLabelLabel}>
        <input
          id="gradeLabel"
          type="text"
          placeholder={form.gradeLabelPlaceholder}
          value={gradeLabel}
          onChange={(event) => setGradeLabel(event.target.value)}
          className={inputClass}
        />
      </Field>

      <Field id="bio" label={form.bioLabel}>
        <input
          id="bio"
          type="text"
          placeholder={form.bioPlaceholder}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          className={inputClass}
        />
      </Field>

      <Field id="name" label={form.nameLabel}>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClass}
        />
      </Field>

      <div>
        <label className="mb-1.5 block font-round text-[14px] font-bold text-ink">
          {adminVoices.toneLabel}
        </label>
        <div className="flex flex-wrap gap-2">
          {adminVoices.toneOptions.map((option) => (
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

      <Field id="photo" label={form.photoLabel} hint={form.photoHint}>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="block w-full text-[13px] text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-sakura-100 file:px-4 file:py-2 file:font-round file:text-[13px] file:font-bold file:text-sakura-600"
        />
        {photoPreview ? (
          // eslint-disable-next-line @next/next/no-img-element -- 選択直後のローカルプレビューのみに使用（next/image最適化の対象は不要）
          <img
            src={photoPreview}
            alt="選択した写真のプレビュー"
            className="mt-3 size-24 rounded-full object-cover ring-4 ring-sakura-100"
          />
        ) : null}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field id="totalHours" label={form.totalHoursLabel}>
          <input
            id="totalHours"
            type="text"
            placeholder="例：90h"
            value={totalHours}
            onChange={(event) => setTotalHours(event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="mockBestScore" label={form.mockBestScoreLabel}>
          <input
            id="mockBestScore"
            type="text"
            placeholder="例：64点"
            value={mockBestScore}
            onChange={(event) => setMockBestScore(event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="totalDays" label={form.totalDaysLabel}>
          <input
            id="totalDays"
            type="text"
            placeholder="例：70日"
            value={totalDays}
            onChange={(event) => setTotalDays(event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="mockCount" label={form.mockCountLabel}>
          <input
            id="mockCount"
            type="text"
            placeholder="例：15回"
            value={mockCount}
            onChange={(event) => setMockCount(event.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        id="recommendPoint"
        label={form.recommendPointLabel}
        hint={form.recommendPointHint}
      >
        <textarea
          id="recommendPoint"
          rows={3}
          value={recommendPoint}
          onChange={(event) => setRecommendPoint(event.target.value)}
          className={`${inputClass} resize-y`}
        />
      </Field>

      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-2xl bg-sakura-100 p-4 text-[13px] font-bold leading-relaxed text-sakura-600"
        >
          <CircleAlert className="size-5 shrink-0" strokeWidth={2.5} />
          {error}
        </p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="flex-1 rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-6 py-3 font-round text-[15px] font-bold text-white shadow-lg shadow-sakura-600/30 transition active:translate-y-0.5 disabled:opacity-60"
        >
          {uploading
            ? form.uploadingLabel
            : submitting
              ? form.submittingLabel
              : form.submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/voices")}
          className="rounded-full bg-white px-6 py-3 font-round text-[15px] font-bold text-ink-muted ring-1 ring-sakura-200 transition active:translate-y-0.5"
        >
          {form.cancelLabel}
        </button>
      </div>
    </form>
  );
}
