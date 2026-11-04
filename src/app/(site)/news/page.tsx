import type { Metadata } from "next";
import { news, siteMeta } from "@/lib/content";
import { getNewsItems } from "@/lib/news";
import { withDefaultOpenGraph } from "@/lib/seo";
import { PageHead } from "@/components/lp/LpParts";
import { NewsRows } from "@/components/lp/LpPosts";
import s from "@/components/lp/lp.module.css";

export const metadata: Metadata = {
  title: news.title,
  description: `${siteMeta.name}からのお知らせ・講座情報・合格実績を一覧でご覧いただけます。`,
  alternates: { canonical: "/news" },
  openGraph: withDefaultOpenGraph({
    title: `${news.title}｜${siteMeta.name}`,
    url: `${siteMeta.url}/news`,
  }),
  robots: { index: true, follow: true },
};

// 新着情報の一覧はSupabaseの更新をなるべく早く反映したいので、トップページより短い間隔で作り直す
export const revalidate = 60;

export default async function NewsListPage() {
  // トップページの3件表示と違い、一覧ページでは全件を表示する
  const items = await getNewsItems(100);

  return (
    <main>
      <PageHead eyebrow={news.englishTitle} title={news.title} lead={news.listLead} />

      <section className={s.pageBody} style={{ paddingInline: 0 }}>
        {items.length > 0 ? <NewsRows items={items} /> : <p className={s.emptyNote}>{news.emptyMessage}</p>}
      </section>
    </main>
  );
}
