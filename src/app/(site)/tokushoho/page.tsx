import type { Metadata } from "next";
import { siteMeta } from "@/lib/content";
import { formatArticleDate } from "@/lib/articles";
import { tokushoho } from "@/lib/tokushoho";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { withDefaultOpenGraph } from "@/lib/seo";
import { LegalHead, LegalRow } from "@/components/lp/LpParts";
import s from "@/components/lp/lp.module.css";

export const metadata: Metadata = {
  title: tokushoho.title,
  description: tokushoho.metaDescription,
  alternates: { canonical: "/tokushoho" },
  robots: { index: tokushoho.confirmed },
  openGraph: withDefaultOpenGraph({
    title: `${tokushoho.title}｜${siteMeta.name}`,
    description: tokushoho.metaDescription,
    url: `${siteMeta.url}/tokushoho`,
  }),
};

export default function TokushohoPage() {
  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", path: "" },
          { name: tokushoho.title, path: "/tokushoho" },
        ]}
      />

      {/* デザインは参考サイトの規約ページに合わせている（2026-11-05 運営者の指示） */}
      <LegalHead eyebrow={tokushoho.englishTitle} title={tokushoho.title} />

      <section className={s.legalBody}>
        <p className={s.legalIntro}>{tokushoho.lead}</p>
        {tokushoho.rows.map(([label, value]) => (
          <LegalRow key={label} label={label}>
            {value}
          </LegalRow>
        ))}
        <p className={s.legalSign}>
          制定日：{formatArticleDate(tokushoho.enactedAt)}
          <br />
          改定日：{formatArticleDate(tokushoho.revisedAt)}
        </p>
      </section>
    </main>
  );
}
