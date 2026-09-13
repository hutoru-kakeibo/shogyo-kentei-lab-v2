import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { columns } from "@/lib/content";
import { formatArticleDate, getArticleSummaries } from "@/lib/articles";
import { ArticleCategoryTag } from "@/components/ui/ArticleCategoryTag";

/** トップページのコラム欄。公開中の記事が1件もない間は、セクションごと表示しない */
export async function Columns() {
  const items = await getArticleSummaries(3);
  if (items.length === 0) return null;

  return (
    <section id="columns" className="bg-gradient-to-b from-lemon-50 to-white px-6 py-14">
      <div className="text-center">
        <h2 className="font-round text-3xl font-bold tracking-tight text-ink">{columns.title}</h2>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {columns.englishTitle}
        </p>
        <p className="mt-4 text-[13px] font-bold leading-relaxed text-ink-muted">{columns.lead}</p>
      </div>

      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/columns/${item.slug}`}
              className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100 transition active:translate-y-0.5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <ArticleCategoryTag category={item.category} />
                  <time dateTime={item.publishedAt} className="text-xs font-bold text-ink-muted">
                    {formatArticleDate(item.publishedAt)}
                  </time>
                </div>
                <h3 className="mt-2 font-round text-[15px] font-bold leading-snug text-ink">
                  {item.title}
                </h3>
              </div>
              <ChevronRight className="size-5 shrink-0 text-sakura-400" strokeWidth={2.5} />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 text-center">
        <Link
          href={columns.moreHref}
          className="inline-flex items-center gap-6 rounded-full bg-gradient-to-r from-sky-300 to-sky-500 px-8 py-4 font-round text-base font-bold text-white shadow-lg shadow-sky-600/30 transition active:translate-y-0.5"
        >
          {columns.moreLabel}
          <ArrowRight className="size-5" strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}
