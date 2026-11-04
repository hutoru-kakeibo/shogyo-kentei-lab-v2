import type { Metadata } from "next";
import { siteMeta, teachers } from "@/lib/content";
import { TeacherList } from "@/components/sections/Teachers";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { withDefaultOpenGraph } from "@/lib/seo";
import { CtaCard, PageHead } from "@/components/lp/LpParts";
import s from "@/components/lp/lp.module.css";

export const metadata: Metadata = {
  title: teachers.metaTitle,
  description: teachers.metaDescription,
  alternates: { canonical: "/teachers" },
  openGraph: withDefaultOpenGraph({
    title: `${teachers.metaTitle}｜${siteMeta.name}`,
    description: teachers.metaDescription,
    url: `${siteMeta.url}/teachers`,
  }),
};

/** 講師一覧ページ。トップページの講師紹介の「もっと見る」から来る */
export default function TeacherListPage() {
  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", path: "" },
          { name: teachers.title, path: "/teachers" },
        ]}
      />

      <PageHead eyebrow={teachers.englishTitle} title={teachers.title} lead={teachers.lead} />

      <section className={s.pageBody}>
        <TeacherList items={teachers.items} />
      </section>

      <CtaCard
        title="講師と1対1の授業を、まずは無料で"
        body="1時間の無料体験で、実際の授業を体験できます。"
        label="無料体験を申し込む"
        cta="teachers"
      />
    </main>
  );
}
