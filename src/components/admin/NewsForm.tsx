"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { adminNews, news } from "@/lib/content";
import {
  createNews,
  updateNews,
  type AdminNewsItem,
  type NewsFormInput,
} from "@/lib/admin/news-actions";

const inputClass =
  "w-full rounded-xl border border-sakura-200 bg-white px-4 py-3 text-[15px] text-ink outline-none placeholder:text-ink-muted/60 focus:border-sakura-400 focus:ring-2 focus:ring-sakura-200";

/** 今日の日付を input[type=date] 用の文字列にする */
function todayAsDateInput() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** 新規作成・編集の両方で使うフォーム。existing があれば編集モードになる */
export function NewsForm({ existing }: { existing?: AdminNewsItem }) {
  const router = useRouter();
  const [publishedAt, setPublishedAt] = useState(existing?.publishedAt ?? todayAsDateInput());
  const [category, setCategory] = useState(existing?.category ?? news.categories[0]);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [isPublished, setIsPublished] = useState(existing?.isPublished ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const input: NewsFormInput = { publishedAt, category, title, isPublished };
    const result = existing ? await updateNews(existing.id, input) : await createNews(input);

    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }

    router.push("/admin/news");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="publishedAt" className="mb-1.5 block font-round text-[14px] font-bold text-ink">
          {adminNews.form.dateLabel}
        </label>
        <input
          id="publishedAt"
          type="date"
          value={publishedAt}
          onChange={(event) => setPublishedAt(event.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1.5 block font-round text-[14px] font-bold text-ink">
          {adminNews.form.categoryLabel}
        </label>
        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={inputClass}
        >
          {news.categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="mb-1.5 block font-round text-[14px] font-bold text-ink">
          {adminNews.form.titleLabel}
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClass}
        />
      </div>

      <label className="flex items-start gap-3 rounded-2xl bg-lemon-50 p-4 ring-1 ring-lemon-200">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(event) => setIsPublished(event.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-sakura-500"
        />
        <span className="text-[13px] leading-relaxed text-ink">{adminNews.form.publishedLabel}</span>
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
            ? adminNews.form.submittingLabel
            : existing
              ? adminNews.form.submitEditLabel
              : adminNews.form.submitCreateLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/news")}
          className="rounded-full bg-white px-6 py-3 font-round text-[15px] font-bold text-ink-muted ring-1 ring-sakura-200 transition active:translate-y-0.5"
        >
          {adminNews.form.cancelLabel}
        </button>
      </div>
    </form>
  );
}
