import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { siteMeta, teachers } from "@/lib/content";
import { TeacherList } from "@/components/sections/Teachers";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { withDefaultOpenGraph } from "@/lib/seo";

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

      <section className="bg-gradient-to-b from-mint-100 to-white px-5 pb-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
          <ChevronLeft className="size-4" strokeWidth={3} />
          トップページに戻る
        </Link>

        <h1 className="mt-5 font-round text-3xl font-bold leading-tight text-ink">{teachers.title}</h1>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {teachers.englishTitle}
        </p>
        <p className="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-ink-muted">
          {teachers.lead}
        </p>
      </section>

      <section className="bg-white px-5 pb-14 pt-4">
        <TeacherList items={teachers.items} />
      </section>
    </main>
  );
}
