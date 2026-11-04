import type { Metadata } from "next";
import { siteMeta } from "@/lib/content";
import { formatArticleDate } from "@/lib/articles";
import { privacyPolicy } from "@/lib/privacy-policy";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { withDefaultOpenGraph } from "@/lib/seo";
import { LegalHead, LegalRow } from "@/components/lp/LpParts";
import s from "@/components/lp/lp.module.css";

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

      {/* デザインは参考サイトの規約ページに合わせている（2026-11-05 運営者の指示） */}
      <LegalHead eyebrow={privacyPolicy.englishTitle} title={privacyPolicy.title} />

      <section className={s.legalBody}>
        <p className={s.legalIntro}>{privacyPolicy.lead}</p>
        {privacyPolicy.sections.map((section) => (
          <LegalRow key={section.heading} label={section.heading}>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.items ? (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.links ? (
              <ul>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </LegalRow>
        ))}
        <p className={s.legalSign}>
          制定日：{formatArticleDate(privacyPolicy.enactedAt)}
          {privacyPolicy.revisedAt ? (
            <>
              <br />
              改定日：{formatArticleDate(privacyPolicy.revisedAt)}
            </>
          ) : null}
        </p>
      </section>
    </main>
  );
}
