import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { columns, siteMeta } from "@/lib/content";
import { formatArticleDate, getArticleBySlug, toJstDate } from "@/lib/articles";
import { ArticleBody } from "@/components/ui/ArticleBody";
import { ArticleCategoryTag } from "@/components/ui/ArticleCategoryTag";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { withDefaultOpenGraph } from "@/lib/seo";
import { CtaCard, PageHead } from "@/components/lp/LpParts";
import s from "@/components/lp/lp.module.css";

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
        <PageHead
          eyebrow={columns.englishTitle}
          title={article.title}
          lead={article.description}
          back={{ label: columns.backToList, href: "/columns" }}
          meta={
            <>
              <ArticleCategoryTag category={article.category} />
              <span>
                {columns.publishedLabel}{" "}
                <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
              </span>
              {showUpdated ? (
                <span>
                  {columns.updatedLabel} <time dateTime={updatedDate}>{formatArticleDate(updatedDate)}</time>
                </span>
              ) : null}
            </>
          }
        />

        <div className={s.pageBody} style={{ paddingTop: 32 }}>
          <ArticleBody source={article.body} />
        </div>
      </article>

      <CtaCard title={columns.cta.title} body={columns.cta.body} label={columns.cta.label} href={columns.cta.href} cta="column_cta" />
      <p className={s.moreLink} style={{ margin: 0, paddingBottom: 40, background: "#fff" }}>
        <Link href="/columns">‹ {columns.backToList}</Link>
      </p>
    </main>
  );
}
