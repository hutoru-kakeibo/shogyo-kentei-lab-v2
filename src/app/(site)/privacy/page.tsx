import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { siteMeta } from "@/lib/content";
import { formatArticleDate } from "@/lib/articles";
import { privacyPolicy } from "@/lib/privacy-policy";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { withDefaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: privacyPolicy.title,
  description: privacyPolicy.metaDescription,
  alternates: { canonical: "/privacy" },
  openGraph: withDefaultOpenGraph({
    title: `${privacyPolicy.title}｜${siteMeta.name}`,
    description: privacyPolicy.metaDescription,
    url: `${siteMeta.url}/privacy`,
  }),
};

export default function PrivacyPage() {
  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", path: "" },
          { name: privacyPolicy.title, path: "/privacy" },
        ]}
      />

      <section className="bg-gradient-to-b from-mint-100 to-canvas px-5 pb-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
          <ChevronLeft className="size-4" strokeWidth={3} />
          トップページに戻る
        </Link>

        <h1 className="mt-5 font-round text-3xl font-bold leading-tight text-ink">
          {privacyPolicy.title}
        </h1>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {privacyPolicy.englishTitle}
        </p>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{privacyPolicy.lead}</p>
      </section>

      <section className="space-y-8 bg-white px-5 py-10">
        {privacyPolicy.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-round text-[17px] font-bold text-ink">{section.heading}</h2>

            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-[13px] leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}

            {section.items ? (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-ink-muted marker:text-sakura-400">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}

            {section.links ? (
              <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sky-600 underline underline-offset-2"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

        <p className="text-right text-[12px] text-ink-muted">
          制定日：{formatArticleDate(privacyPolicy.enactedAt)}
        </p>
      </section>
    </main>
  );
}
