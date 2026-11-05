import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { columns, siteMeta } from "@/lib/content";
import { formatArticleDate, getArticleBySlug, getArticleSummaries, toJstDate } from "@/lib/articles";
import { ArticleBody, articleHeadings } from "@/components/ui/ArticleBody";
import { ArticleCategoryTag } from "@/components/ui/ArticleCategoryTag";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { withDefaultOpenGraph } from "@/lib/seo";
import { ScrollEffects } from "@/components/lp/LpClient";
import { CtaCard } from "@/components/lp/LpParts";
import { ColumnCards } from "@/components/lp/LpPosts";
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
  const headings = articleHeadings(article.body);
  const related = (await getArticleSummaries(4)).filter((item) => item.slug !== slug).slice(0, 3);

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

      <ScrollEffects />

      <article>
        <header className={`${s.articleHead} ${s.gridW}`}>
          <Link href="/columns" className={s.pageBack}>
            ‹ {columns.backToList}
          </Link>
          <p className={s.eyebrow}>{columns.englishTitle}</p>
          <h1 className={s.articleTitle}>{article.title}</h1>
          <div className={s.articleMeta}>
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
          </div>
          <p className={s.articleLead}>{article.description}</p>
        </header>

        <div className={s.articleBody}>
          {/* 長い記事で読みたい場所へ飛べるように、大見出しが3つ以上あれば目次を出す */}
          {headings.length >= 3 ? (
            <nav className={s.articleToc} aria-label={columns.tocTitle}>
              <div className={s.noteHead}>
                <span className={s.noteTitle}>{columns.tocTitle}</span>
              </div>
              <ol className={s.articleTocList}>
                {headings.map((heading, i) => (
                  <li key={heading}>
                    <a href={`#section-${i + 1}`}>
                      <span className={s.articleTocNo}>{String(i + 1).padStart(2, "0")}</span>
                      {heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <ArticleBody source={article.body} />
        </div>
      </article>

      <CtaCard title={columns.cta.title} body={columns.cta.body} label={columns.cta.label} href={columns.cta.href} cta="column_cta" />

      {related.length > 0 ? (
        <section className={`${s.columnRelated} ${s.gridW}`}>
          <p className={s.eyebrow} data-rv>
            {columns.relatedEyebrow}
          </p>
          <h2 className={s.columnRelatedTitle} data-rv>
            {columns.relatedTitle}
          </h2>
          <ColumnCards items={related} />
        </section>
      ) : null}

      <p className={`${s.moreLink} ${s.columnBack} ${s.gridW}`}>
        <Link href="/columns">‹ {columns.backToList}</Link>
      </p>
    </main>
  );
}
