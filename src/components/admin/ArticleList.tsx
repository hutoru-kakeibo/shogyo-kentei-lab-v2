"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { adminArticles } from "@/lib/content";
import { ArticleCategoryTag } from "@/components/ui/ArticleCategoryTag";
import { deleteArticle, type AdminArticleItem } from "@/lib/admin/article-actions";

export function ArticleList({ items }: { items: AdminArticleItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (item: AdminArticleItem) => {
    if (!window.confirm(adminArticles.deleteConfirm)) return;

    setDeletingId(item.id);
    startTransition(async () => {
      const result = await deleteArticle(item.id);
      setDeletingId(null);
      if (result.ok) router.refresh();
    });
  };

  return (
    <div>
      <div className="flex justify-end">
        <Link
          href="/admin/columns/new"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-5 py-2.5 font-round text-[13px] font-bold text-white shadow-md shadow-sakura-600/30"
        >
          <Plus className="size-4" strokeWidth={3} />
          {adminArticles.newLabel}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white p-6 text-center text-[13px] font-bold text-ink-muted shadow-sm ring-1 ring-sakura-100">
          {adminArticles.emptyMessage}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sakura-100"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <time className="text-xs font-bold text-ink-muted">{item.publishedAt}</time>
                  <ArticleCategoryTag category={item.category} />
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.isPublished
                        ? "bg-mint-100 text-mint-500"
                        : "bg-ink-muted/10 text-ink-muted"
                    }`}
                  >
                    {item.isPublished ? adminArticles.publishedLabel : adminArticles.draftLabel}
                  </span>
                </div>
                <p className="mt-1.5 truncate text-[14px] font-bold text-ink">{item.title}</p>
                <p className="mt-0.5 truncate text-[11px] text-ink-muted">/columns/{item.slug}</p>
              </div>

              <div className="flex shrink-0 gap-1.5">
                {item.isPublished ? (
                  <a
                    href={`/columns/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={adminArticles.viewLabel}
                    className="grid size-9 place-items-center rounded-full bg-mint-100 text-mint-500"
                  >
                    <ExternalLink className="size-4" strokeWidth={2.5} />
                  </a>
                ) : null}
                <Link
                  href={`/admin/columns/${item.id}/edit`}
                  aria-label={adminArticles.editLabel}
                  className="grid size-9 place-items-center rounded-full bg-sky-100 text-sky-600"
                >
                  <Pencil className="size-4" strokeWidth={2.5} />
                </Link>
                <button
                  type="button"
                  aria-label={adminArticles.deleteLabel}
                  onClick={() => handleDelete(item)}
                  disabled={isPending && deletingId === item.id}
                  className="grid size-9 place-items-center rounded-full bg-sakura-100 text-sakura-600 disabled:opacity-50"
                >
                  <Trash2 className="size-4" strokeWidth={2.5} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
