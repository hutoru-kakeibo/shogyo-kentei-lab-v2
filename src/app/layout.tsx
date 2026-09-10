import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { ScrollTopButton } from "@/components/layout/ScrollTopButton";
import { siteMeta } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: `${siteMeta.name}｜${siteMeta.tagline}`,
    template: `%s｜${siteMeta.name}`,
  },
  description: siteMeta.description,
  keywords: ["全商検定", "商業高校", "全商簿記", "情報処理検定", "全商英検", "検定対策", "オンライン塾"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteMeta.url,
    siteName: siteMeta.name,
    title: `${siteMeta.name}｜${siteMeta.tagline}`,
    description: siteMeta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteMeta.name}｜${siteMeta.tagline}`,
    description: siteMeta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff8fb4",
};

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
      <body className="min-h-full bg-sakura-100/60 font-sans">
        <div className="mx-auto min-h-dvh w-full max-w-[480px] bg-canvas shadow-xl shadow-sakura-600/10">
          <SiteHeader />
          <div className="pb-28">{children}</div>
        </div>
        <ScrollTopButton />
        <BottomNav />
      </body>
    </html>
  );
}
