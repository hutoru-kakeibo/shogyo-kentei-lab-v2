"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { adminNews } from "@/lib/content";
import { NewsCategoryTag } from "@/components/ui/NewsCategoryTag";
import { deleteNews, type AdminNewsItem } from "@/lib/admin/news-actions";

export function NewsList({ items }: { items: AdminNewsItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (item: AdminNewsItem) => {
    if (!window.confirm(adminNews.deleteConfirm)) return;

    setDeletingId(item.id);
    startTransition(async () => {
      const result = await deleteNews(item.id);
      setDeletingId(null);
      if (result.ok) router.refresh();
    });
  };

  return (
    <div>
      <div className="flex justify-end">
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-5 py-2.5 font-round text-[13px] font-bold text-white shadow-md shadow-sakura-600/30"
        >
          <Plus className="size-4" strokeWidth={3} />
          {adminNews.newLabel}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white p-6 text-center text-[13px] font-bold text-ink-muted shadow-sm ring-1 ring-sakura-100">
          {adminNews.emptyMessage}
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
                  <NewsCategoryTag category={item.category} />
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.isPublished
                        ? "bg-mint-100 text-mint-500"
                        : "bg-ink-muted/10 text-ink-muted"
                    }`}
                  >
                    {item.isPublished ? adminNews.publishedLabel : adminNews.draftLabel}
                  </span>
                </div>
                <p className="mt-1.5 truncate text-[14px] font-bold text-ink">{item.title}</p>
              </div>

              <div className="flex shrink-0 gap-1.5">
                <Link
                  href={`/admin/news/${item.id}/edit`}
                  aria-label={adminNews.editLabel}
                  className="grid size-9 place-items-center rounded-full bg-sky-100 text-sky-600"
                >
                  <Pencil className="size-4" strokeWidth={2.5} />
                </Link>
                <button
                  type="button"
                  aria-label={adminNews.deleteLabel}
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
