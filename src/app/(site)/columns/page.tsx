import type { Metadata } from "next";
import { columns, siteMeta } from "@/lib/content";
import { getArticleSummaries } from "@/lib/articles";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { withDefaultOpenGraph } from "@/lib/seo";
import { ScrollEffects } from "@/components/lp/LpClient";
import { CtaCard, PageHead } from "@/components/lp/LpParts";
import { ColumnCards } from "@/components/lp/LpPosts";
import s from "@/components/lp/lp.module.css";

export const metadata: Metadata = {
  title: columns.metaTitle,
  description: columns.metaDescription,
  alternates: { canonical: "/columns" },
  openGraph: withDefaultOpenGraph({
    title: `${columns.metaTitle}｜${siteMeta.name}`,
    description: columns.metaDescription,
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

      {/* カードは画面に入ったときに表示する（data-rv）ので、この部品がないと見えないままになる */}
      <ScrollEffects />

      <PageHead eyebrow={columns.englishTitle} title={columns.title} lead={columns.listLead} />

      <section className={`${s.columnListSec} ${s.gridW}`}>
        {items.length > 0 ? <ColumnCards items={items} /> : <p className={s.emptyNote}>{columns.emptyMessage}</p>}
      </section>

      <CtaCard title={columns.cta.title} body={columns.cta.body} label={columns.cta.label} href={columns.cta.href} cta="column_list" />
    </main>
  );
}
