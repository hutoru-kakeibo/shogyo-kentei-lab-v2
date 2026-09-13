import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { columns, siteMeta } from "@/lib/content";
import { formatArticleDate, getArticleSummaries } from "@/lib/articles";
import { ArticleCategoryTag } from "@/components/ui/ArticleCategoryTag";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { withDefaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: columns.title,
  description: `${siteMeta.name}の${columns.title}。${columns.listLead}`,
  alternates: { canonical: "/columns" },
  openGraph: withDefaultOpenGraph({
    title: `${columns.title}｜${siteMeta.name}`,
    url: `${siteMeta.url}/columns`,
  }),
};

// 管理画面での公開は revalidatePath で即時反映されるが、念のため定期的にも作り直す
export const revalidate = 300;

export default async function ColumnListPage() {
  const items = await getArticleSummaries();

  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", path: "" },
          { name: columns.title, path: "/columns" },
        ]}
      />

      <section className="bg-gradient-to-b from-sky-100 to-canvas px-5 pb-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
          <ChevronLeft className="size-4" strokeWidth={3} />
          トップページに戻る
        </Link>

        <h1 className="mt-5 font-round text-3xl font-bold leading-tight text-ink">{columns.title}</h1>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {columns.englishTitle}
        </p>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{columns.listLead}</p>
      </section>

      <section className="bg-canvas px-5 pb-14 pt-4">
        {items.length > 0 ? (
          <ul className="space-y-4">
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
                    <h2 className="mt-2 font-round text-[16px] font-bold leading-snug text-ink">
                      {item.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-ink-muted">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-sakura-400" strokeWidth={2.5} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl bg-white p-6 text-center text-[13px] font-bold text-ink-muted">
            {columns.emptyMessage}
          </p>
        )}
      </section>
    </main>
  );
}
