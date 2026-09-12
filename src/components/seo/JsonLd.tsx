import { about, faq, siteMeta } from "@/lib/content";

/**
 * 構造化データ（JSON-LD）。
 * 検索結果にFAQのアコーディオンやサイト名・運営情報を出すためのもので、
 * 画面上には何も描画されない。
 */
function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** 塾そのものの情報。トップページに置く */
export function OrganizationJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "@id": `${siteMeta.url}/#organization`,
        name: siteMeta.name,
        alternateName: siteMeta.tagline,
        url: siteMeta.url,
        image: `${siteMeta.url}${siteMeta.ogImage}`,
        description: siteMeta.description,
        // 肩書きつきの表示名から「（塾長）」を落として人名だけにする
        founder: { "@type": "Person", name: about.founder.name.replace(/（.*）/, "") },
        areaServed: { "@type": "Country", name: "日本" },
        availableLanguage: "ja",
        knowsAbout: [
          "全商簿記実務検定",
          "全商情報処理検定",
          "全商英語検定",
          "全商ビジネス文書実務検定",
          "日商簿記検定",
        ],
      }}
    />
  );
}

/** よくある質問。検索結果にQ&Aとして出る可能性がある */
export function FaqJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }}
    />
  );
}

/** 検定ページ用。どんな講座なのかを検索エンジンに伝える */
export function CourseJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Course",
        name,
        description,
        url,
        inLanguage: "ja",
        provider: {
          "@type": "EducationalOrganization",
          name: siteMeta.name,
          url: siteMeta.url,
        },
        offers: {
          "@type": "Offer",
          category: "無料体験",
          price: 0,
          priceCurrency: "JPY",
          url: `${siteMeta.url}/trial`,
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "PT60M",
        },
      }}
    />
  );
}

/** パンくず。検索結果のURL表示が階層つきになる */
export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${siteMeta.url}${item.path}`,
        })),
      }}
    />
  );
}
