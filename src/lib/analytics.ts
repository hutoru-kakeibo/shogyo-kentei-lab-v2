/**
 * Googleアナリティクス4（GA4）へのイベント送信。
 *
 * 測定ID（環境変数 NEXT_PUBLIC_GA_ID）が未設定の環境や、計測スクリプトを読み込まないページ
 * （授業申し込みの秘密ページなど）では何もしない。
 * ⚠️ 氏名・メールアドレス・学校名などの個人情報は、イベントのパラメータに絶対に入れないこと。
 */

/** 「G-」で始まる形式のときだけ有効にする（想定外の文字列をスクリプトに埋め込まないため） */
export const GA_ID = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID ?? "")
  ? (process.env.NEXT_PUBLIC_GA_ID as string)
  : "";

type EventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

/**
 * 無料体験ボタンが押された場所。
 * ボタン（またはその親）に data-cta="..." が付いていればその値、
 * 無ければ、どの種類のページで押されたかを返す（コラム本文中のリンクなど）
 */
export function ctaLocationFromPath(pathname: string) {
  if (pathname === "/") return "home_other";
  if (pathname.startsWith("/columns/")) return "column_body";
  if (pathname.startsWith("/subjects/")) return "subject_other";
  return "other";
}
