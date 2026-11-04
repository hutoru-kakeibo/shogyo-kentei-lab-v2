import Link from "next/link";
import { ArticleCategoryTag } from "@/components/ui/ArticleCategoryTag";
import { NewsCategoryTag } from "@/components/ui/NewsCategoryTag";
import { columns, news } from "@/lib/content";
import { formatArticleDate, getArticleSummaries, type ArticleSummary } from "@/lib/articles";
import { getNewsItems, type NewsItem } from "@/lib/news";
import s from "@/components/lp/lp.module.css";

/** コラムのカードの並び（トップの欄と一覧ページで共通） */
export function ColumnCards({ items }: { items: ArticleSummary[] }) {
  return (
    <ul className={s.postList}>
      {items.map((item) => (
        <li key={item.slug} data-rv>
          <Link href={`/columns/${item.slug}`} className={s.postCard}>
            <div style={{ minWidth: 0 }}>
              <div className={s.postMeta}>
                <ArticleCategoryTag category={item.category} />
                <time dateTime={item.publishedAt}>{formatArticleDate(item.publishedAt)}</time>
              </div>
              <h3 className={s.postTitle}>{item.title}</h3>
              <p className={s.postDesc}>{item.description}</p>
            </div>
            <span className={s.postArrow} aria-hidden>
              ›
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** 文中の URL（https://…）を、押せるリンクにする */
function Linkify({ text }: { text: string }) {
  return (
    <>
      {text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className={s.inlineLink}>
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** お知らせの並び（トップの欄と一覧ページで共通） */
export function NewsRows({ items }: { items: NewsItem[] }) {
  return (
    <ul className={s.postList}>
      {items.map((item) => (
        <li key={item.id} className={s.newsRow}>
          <div className={s.postMeta}>
            <time>{item.date}</time>
            <NewsCategoryTag category={item.category} />
          </div>
          <p className={s.postTitle}>
            <Linkify text={item.title} />
          </p>
        </li>
      ))}
    </ul>
  );
}

/** トップのコラム欄。公開中の記事が1件もない間は出さない */
export async function LpColumnsSection() {
  const items = await getArticleSummaries(3);
  if (items.length === 0) return null;
  return (
    <section id="columns" className={`${s.sec} ${s.gridW}`}>
      <p className={s.eyebrow} data-rv>
        {columns.englishTitle}
      </p>
      <h2 className={s.secTitle} data-rv>
        {columns.title}
      </h2>
      <ColumnCards items={items} />
      <p className={s.moreLink}>
        <Link href={columns.moreHref}>{columns.moreLabel} ›</Link>
      </p>
    </section>
  );
}

/** トップのお知らせ欄（新しい3件） */
export async function LpNewsSection() {
  const items = await getNewsItems();
  return (
    <section id="news" className={`${s.sec} ${s.gridW}`} style={{ paddingTop: 8 }}>
      <p className={s.eyebrow} data-rv>
        {news.englishTitle}
      </p>
      <h2 className={s.secTitle} data-rv>
        {news.title}
      </h2>
      {items.length > 0 ? <NewsRows items={items} /> : <p className={s.emptyNote}>{news.emptyMessage}</p>}
      <p className={s.moreLink}>
        <Link href={news.moreHref}>{news.moreLabel} ›</Link>
      </p>
    </section>
  );
}
