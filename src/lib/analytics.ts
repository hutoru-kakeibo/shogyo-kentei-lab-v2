/**
 * Googleアナリティクス4（GA4）へのイベント送信。
 *
 * 計測スクリプトを読み込まないページ（授業申し込みの秘密ページなど）や、
 * 測定IDが無効な環境では何もしない。
 * ⚠️ 氏名・メールアドレス・学校名などの個人情報は、イベントのパラメータに絶対に入れないこと。
 */

/**
 * GA4「商業検定ラボ」プロパティの測定ID。HTMLに載る公開情報なので、コードに置いている。
 * 別の測定IDで試したいときは環境変数 NEXT_PUBLIC_GA_ID で上書きできる
 */
const PRODUCTION_GA_ID = "G-PH20MP7WZK";

// 開発中（npm run dev）のアクセスを本番の数字に混ぜないよう、既定の測定IDは本番ビルドでだけ使う
const candidate =
  process.env.NEXT_PUBLIC_GA_ID ||
  (process.env.NODE_ENV === "production" ? PRODUCTION_GA_ID : "");

/** 「G-」で始まる形式のときだけ有効にする（想定外の文字列をスクリプトに埋め込まないため） */
export const GA_ID = /^G-[A-Z0-9]+$/.test(candidate) ? candidate : "";

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
