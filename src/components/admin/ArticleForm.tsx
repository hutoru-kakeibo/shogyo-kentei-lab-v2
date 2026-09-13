"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Eye, PencilLine } from "lucide-react";
import { adminArticles, columns, siteMeta } from "@/lib/content";
import { ArticleBody } from "@/components/ui/ArticleBody";
import {
  createArticle,
  updateArticle,
  type AdminArticleItem,
  type ArticleFormInput,
} from "@/lib/admin/article-actions";

const inputClass =
  "w-full rounded-xl border border-sakura-200 bg-white px-4 py-3 text-[15px] text-ink outline-none placeholder:text-ink-muted/60 focus:border-sakura-400 focus:ring-2 focus:ring-sakura-200";
const labelClass = "mb-1.5 block font-round text-[14px] font-bold text-ink";
const hintClass = "mt-1.5 text-[12px] leading-relaxed text-ink-muted";

function todayAsDateInput() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** 入力しやすいよう、大文字は小文字に、空白や _ はハイフンにその場で置き換える */
function normalizeSlug(value: string) {
  return value.toLowerCase().replace(/[\s_]+/g, "-");
}

/** 新規作成・編集の両方で使うフォーム。existing があれば編集モードになる */
export function ArticleForm({ existing }: { existing?: AdminArticleItem }) {
  const router = useRouter();
  const form = adminArticles.form;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [category, setCategory] = useState<string>(existing?.category ?? columns.categories[0]);
  const [publishedAt, setPublishedAt] = useState(existing?.publishedAt ?? todayAsDateInput());
  const [body, setBody] = useState(existing?.body ?? "");
  const [isPublished, setIsPublished] = useState(existing?.isPublished ?? false);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const input: ArticleFormInput = {
      title,
      slug,
      description,
      category,
      publishedAt,
      body,
      isPublished,
    };
    const result = existing ? await updateArticle(existing.id, input) : await createArticle(input);

    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }

    router.push("/admin/columns");
    router.refresh();
  };

  const tabClass = (active: boolean) =>
    `flex items-center gap-1.5 rounded-full px-4 py-1.5 font-round text-[13px] font-bold transition ${
      active ? "bg-sakura-500 text-white shadow-sm" : "text-ink-muted"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <label htmlFor="title" className={labelClass}>
          {form.titleLabel}
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClass}
        />
        <p className={hintClass}>{form.titleHint}</p>
      </div>

      <div>
        <label htmlFor="slug" className={labelClass}>
          {form.slugLabel}
        </label>
        <input
          id="slug"
          type="text"
          inputMode="url"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={slug}
          onChange={(event) => setSlug(normalizeSlug(event.target.value))}
          placeholder="zensho-eiken-2kyu-benkyouhou"
          className={inputClass}
        />
        <p className="mt-1.5 break-all text-[12px] font-bold text-sky-600">
          {siteMeta.url}/columns/{slug || "…"}
        </p>
        <p className={hintClass}>{form.slugHint}</p>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          {form.descriptionLabel}
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={inputClass}
        />
        <p className={hintClass}>
          {form.descriptionHint}（現在 {description.trim().length}
          {form.charCount}）
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className={labelClass}>
            {form.categoryLabel}
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={inputClass}
          >
            {columns.categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="publishedAt" className={labelClass}>
            {form.dateLabel}
          </label>
          <input
            id="publishedAt"
            type="date"
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="body" className="font-round text-[14px] font-bold text-ink">
            {form.bodyLabel}
          </label>
          <div className="flex rounded-full bg-sakura-50 p-1 ring-1 ring-sakura-100">
            <button
              type="button"
              onClick={() => setTab("edit")}
              aria-pressed={tab === "edit"}
              className={tabClass(tab === "edit")}
            >
              <PencilLine className="size-3.5" strokeWidth={2.5} />
              {form.editTab}
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              aria-pressed={tab === "preview"}
              className={tabClass(tab === "preview")}
            >
              <Eye className="size-3.5" strokeWidth={2.5} />
              {form.previewTab}
            </button>
          </div>
        </div>

        <details className="mb-3 rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-100">
          <summary className="cursor-pointer font-round text-[13px] font-bold text-sky-600">
            {adminArticles.guide.title}
          </summary>
          <table className="mt-3 w-full text-[12px]">
            <tbody>
              {adminArticles.guide.items.map((item) => (
                <tr key={item.syntax} className="border-t border-sky-100">
                  <td className="whitespace-nowrap py-1.5 pr-4 font-mono text-ink">{item.syntax}</td>
                  <td className="py-1.5 text-ink-muted">{item.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">{adminArticles.guide.note}</p>
        </details>

        {tab === "edit" ? (
          <textarea
            id="body"
            rows={20}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className={`${inputClass} leading-relaxed`}
          />
        ) : (
          <div className="min-h-80 rounded-xl border border-sakura-200 bg-white p-5">
            {body.trim() ? (
              <ArticleBody source={body} />
            ) : (
              <p className="text-[13px] text-ink-muted">{form.previewEmpty}</p>
            )}
          </div>
        )}
      </div>

      <label className="flex items-start gap-3 rounded-2xl bg-lemon-50 p-4 ring-1 ring-lemon-200">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(event) => setIsPublished(event.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-sakura-500"
        />
        <span className="text-[13px] leading-relaxed text-ink">{form.publishedLabel}</span>
      </label>

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
          disabled={submitting}
          className="flex-1 rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-6 py-3 font-round text-[15px] font-bold text-white shadow-lg shadow-sakura-600/30 transition active:translate-y-0.5 disabled:opacity-60"
        >
          {submitting
            ? form.submittingLabel
            : existing
              ? form.submitEditLabel
              : form.submitCreateLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/columns")}
          className="rounded-full bg-white px-6 py-3 font-round text-[15px] font-bold text-ink-muted ring-1 ring-sakura-200 transition active:translate-y-0.5"
        >
          {form.cancelLabel}
        </button>
      </div>
    </form>
  );
}
