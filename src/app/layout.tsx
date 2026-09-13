import type { Metadata, Viewport } from "next";
import { siteMeta } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: siteMeta.title,
    template: `%s｜${siteMeta.name}`,
  },
  description: siteMeta.description,
  keywords: [
    "全商検定",
    "商業高校",
    "全商簿記",
    "情報処理検定",
    "全商英検",
    "検定対策",
    "オンライン塾",
    "商業高校生",
    "日商簿記",
    "個別指導",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteMeta.url,
    siteName: siteMeta.name,
    title: siteMeta.title,
    description: siteMeta.description,
    images: [
      {
        url: siteMeta.ogImage,
        width: 1200,
        height: 630,
        alt: siteMeta.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
    images: [siteMeta.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff8fb4",
};

/**
 * ルートレイアウト。
 * 生徒向けページ共通のヘッダー・追従ボトムナビ・スマホ幅の枠は、
 * ここではなく src/app/(site)/layout.tsx 側で描画する
 * （/login・/admin は管理者用の別画面なので、その見た目を持たせないため）。
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          日本語フォントは next/font/google の subsets: ["japanese"] がビルドエラーになるため、
          ルートレイアウトで手動 <link> する（アプリ全体に適用されるのでページ単位フォントではない）。
        */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Zen+Maru+Gothic:wght@500;700;900&family=Caveat:wght@600;700&display=swap"
        />
      </head>
      <body className="min-h-full bg-canvas font-sans">{children}</body>
    </html>
  );
}
