import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { columns, siteMeta } from "@/lib/content";
import { formatArticleDate, getArticleBySlug, toJstDate } from "@/lib/articles";
import { ArticleBody } from "@/components/ui/ArticleBody";
import { ArticleCategoryTag } from "@/components/ui/ArticleCategoryTag";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { withDefaultOpenGraph } from "@/lib/seo";

export const revalidate = 300;

// 記事はビルド後に管理画面から増えるので、ビルド時には1件も作らず初回アクセス時に生成する
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps<"/columns/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/columns/${slug}` },
    openGraph: withDefaultOpenGraph({
      type: "article",
      title: `${article.title}｜${siteMeta.name}`,
      description: article.description,
      url: `${siteMeta.url}/columns/${slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    }),
    twitter: { title: `${article.title}｜${siteMeta.name}`, description: article.description },
  };
}

export default async function ColumnPage({ params }: PageProps<"/columns/[slug]">) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const url = `${siteMeta.url}/columns/${slug}`;
  const updatedDate = toJstDate(article.updatedAt);
  const showUpdated = updatedDate > article.publishedAt;

  return (
    <main>
      <ArticleJsonLd
        title={article.title}
        description={article.description}
        url={url}
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", path: "" },
          { name: columns.title, path: "/columns" },
          { name: article.title, path: `/columns/${slug}` },
        ]}
      />

      <article>
        <header className="bg-gradient-to-b from-sky-100 to-canvas px-5 pb-8 pt-6">
          <Link
            href="/columns"
            className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted"
          >
            <ChevronLeft className="size-4" strokeWidth={3} />
            {columns.backToList}
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <ArticleCategoryTag category={article.category} />
            <span className="text-xs font-bold text-ink-muted">
              {columns.publishedLabel}{" "}
              <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
            </span>
            {showUpdated ? (
              <span className="text-xs font-bold text-ink-muted">
                {columns.updatedLabel}{" "}
                <time dateTime={updatedDate}>{formatArticleDate(updatedDate)}</time>
              </span>
            ) : null}
          </div>

          <h1 className="mt-3 font-round text-2xl font-bold leading-snug text-ink">
            {article.title}
          </h1>
          <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{article.description}</p>
        </header>

        <div className="bg-white px-5 py-10">
          <ArticleBody source={article.body} />
        </div>
      </article>

      <section className="bg-canvas px-5 pb-14 pt-4">
        <div className="rounded-3xl bg-gradient-to-br from-sakura-100 to-lemon-100 p-6 text-center shadow-md shadow-sakura-600/10 ring-1 ring-sakura-200">
          <p className="font-round text-lg font-bold leading-snug text-ink">{columns.cta.title}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{columns.cta.body}</p>
          <Link
            href={columns.cta.href}
            className="mt-5 inline-flex items-center gap-4 rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-7 py-3.5 font-round text-[15px] font-bold text-white shadow-lg shadow-sakura-600/30 transition active:translate-y-0.5"
          >
            {columns.cta.label}
            <ArrowRight className="size-5" strokeWidth={2.5} />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/columns"
            className="inline-flex items-center gap-1 text-[13px] font-bold text-ink-muted"
          >
            <ChevronLeft className="size-4" strokeWidth={3} />
            {columns.backToList}
          </Link>
        </div>
      </section>
    </main>
  );
}
