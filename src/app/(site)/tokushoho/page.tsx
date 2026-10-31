import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { siteMeta } from "@/lib/content";
import { formatArticleDate } from "@/lib/articles";
import { tokushoho } from "@/lib/tokushoho";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { withDefaultOpenGraph } from "@/lib/seo";

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

      <section className="bg-gradient-to-b from-mint-100 to-canvas px-5 pb-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
          <ChevronLeft className="size-4" strokeWidth={3} />
          トップページに戻る
        </Link>

        <h1 className="mt-5 font-round text-3xl font-bold leading-tight text-ink">{tokushoho.title}</h1>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">{tokushoho.englishTitle}</p>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{tokushoho.lead}</p>
      </section>

      <section className="bg-white px-5 py-10">
        <dl className="divide-y divide-sakura-100 border-y border-sakura-100">
          {tokushoho.rows.map(([label, value]) => (
            <div key={label} className="py-4">
              <dt className="font-round text-[14px] font-bold text-ink">{label}</dt>
              <dd className="mt-1 text-[13px] leading-relaxed text-ink-muted">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-right text-[12px] text-ink-muted">制定日：{formatArticleDate(tokushoho.enactedAt)}</p>
      </section>
    </main>
  );
}
