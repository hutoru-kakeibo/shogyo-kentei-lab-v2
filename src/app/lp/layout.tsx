import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * 新しいトップページ（MVP）の試作。公開前の確認用なので検索エンジンには載せない。
 * いまのトップページ（(site)/page.tsx）には影響しない。
 */
export const metadata: Metadata = {
  title: "新トップページ（試作）",
  robots: { index: false, follow: false },
};

export default function LpLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* このページだけで使う英字・等幅・明朝のフォント */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,600;0,800;0,900;1,800;1,900&family=JetBrains+Mono:wght@500;700&family=Noto+Serif+JP:wght@700;900&display=swap"
        precedence="default"
      />
      {children}
    </>
  );
}
