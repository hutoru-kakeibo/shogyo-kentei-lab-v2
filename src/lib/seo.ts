import type { Metadata } from "next";
import { siteMeta } from "@/lib/content";

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
        alt: `${siteMeta.name}｜${siteMeta.tagline}`,
      },
    ],
    ...openGraph,
  } as OpenGraph;
}
