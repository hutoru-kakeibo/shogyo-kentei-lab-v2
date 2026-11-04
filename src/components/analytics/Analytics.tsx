"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { GA_ID, ctaLocationFromPath, trackEvent } from "@/lib/analytics";

/**
 * GA4 の計測スクリプトと、「無料体験」ボタンのクリック計測。
 * 生徒向けページ（(site) グループ）のレイアウトにだけ置く。管理画面・ログインは計測しない。
 *
 * 授業申し込みページ（/lesson/<秘密の文字列>）では読み込まない。
 * 読み込むと、閲覧したURL＝秘密の文字列がGoogleに送られてしまうため。
 * （このページは 2026-11-05 に閉じた。古いURLを開かれたときも文字列を送らないよう、外さずに残している）
 */
export function Analytics() {
  const pathname = usePathname();
  const enabled = Boolean(GA_ID) && !pathname.startsWith("/lesson");

  useEffect(() => {
    if (!enabled) return;

    // ボタンごとに onClick を書く代わりに、/trial へのリンクのクリックをまとめて拾う。
    // コラム本文中のリンクのように、コンポーネントを持たないリンクも数えられる
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== "/trial") return;

      const location =
        anchor.closest("[data-cta]")?.getAttribute("data-cta") ??
        ctaLocationFromPath(window.location.pathname);
      trackEvent("cta_click", { cta_location: location });
    };

    // トップいちばん下の「検定を選んで申し込む」フォーム（/trial へ移るだけのフォーム）も同じく数える
    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const url = new URL(form.action, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== "/trial") return;
      const location =
        form.closest("[data-cta]")?.getAttribute("data-cta") ??
        ctaLocationFromPath(window.location.pathname);
      trackEvent("cta_click", { cta_location: location });
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
