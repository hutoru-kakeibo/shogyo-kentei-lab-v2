import type { Metadata } from "next";
import { courseSearch, siteMeta, subjectSearchNames } from "@/lib/content";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * ページごとの openGraph に、サイト共通のOGP画像・サイト名などを足す。
 * Next.js のメタデータは openGraph を丸ごと上書きするため、下層ページで openGraph を
 * 指定すると、ルートレイアウトで設定したOGP画像が消えてしまう。それを防ぐためのもの。
 */
export function withDefaultOpenGraph(openGraph: OpenGraph): OpenGraph {
  return {
    type: "website",
    locale: "ja_JP",
    siteName: siteMeta.name,
    images: [
      {
        url: siteMeta.ogImage,
        width: 1200,
        height: 630,
        alt: siteMeta.title,
      },
    ],
    ...openGraph,
  } as OpenGraph;
}

/**
 * 検定ページのタイトル・構造化データ用の呼び名（例：全商簿記実務検定）。
 * 「全商」を付けるのは全商検定の科目だけ（日商簿記などには付けない）。
 */
export function subjectSearchName(subject: { slug: string; name: string; category: string }) {
  const custom = subjectSearchNames[subject.slug];
  if (custom) return custom;
  return subject.category === "全商検定" ? `全商${subject.name}` : subject.name;
}

/**
 * 「検定を探す」で公開（ready: true）にしている検定ページかどうか。
 * 下書き中のページはURLを直接開けば見られるが、サイトマップに載せず noindex にする。
 */
export function isSubjectPublished(slug: string) {
  return courseSearch.categories.some((category) =>
    category.items.some((item) => item.href === `/subjects/${slug}` && item.ready),
  );
}
