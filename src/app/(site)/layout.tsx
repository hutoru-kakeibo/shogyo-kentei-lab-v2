import { Analytics } from "@/components/analytics/Analytics";
import { VisitSourceRecorder } from "@/components/analytics/VisitSourceRecorder";
import { LpHeader } from "@/components/lp/LpHeader";
import { LpFooter } from "@/components/lp/LpParts";
import s from "@/components/lp/lp.module.css";
import { lp } from "@/lib/lp-content";

/**
 * 生徒向けページ共通のレイアウト（2026-11 から新デザイン）。
 * 黒い帯のヘッダー（メニュー）・フッター・スマホ幅の枠・アクセス計測を、このグループの配下にだけ適用する。
 * /login・/admin はこのグループの外にあるため、この見た目を持たない。
 * 旧デザインは git の印 archive/site-v1 に残してある
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className={s.root}>
      {/* このデザインで使う英字・等幅・明朝のフォント */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,600;0,800;0,900;1,800;1,900&family=JetBrains+Mono:wght@500;700&family=Noto+Serif+JP:wght@700;900&display=swap"
        precedence="default"
      />
      {/* スクロールで出てくる要素は、JavaScript が動かない環境では最初から見せる */}
      <noscript>
        <style>{"[data-rv]{opacity:1!important;translate:none!important}"}</style>
      </noscript>
      <div className={s.col}>
        <LpHeader />
        {children}
        <LpFooter links={lp.footer.links} copyright={lp.footer.copyright} />
      </div>
      <Analytics />
      <VisitSourceRecorder />
    </div>
  );
}
