import Link from "next/link";
import { siteMeta } from "@/lib/content";
import type { LpTextPart } from "@/lib/lp-content";
import s from "@/components/lp/lp.module.css";

/** 新トップページ（/lp）と、その申し込みページ・完了ページで使う共通の部品 */

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`${s.logo} ${className ?? ""}`}>
      <b>商業検定</b>
      <em>ラボ</em>
    </span>
  );
}

/** 黒い帯に置くロゴ＋サブタイトル（日本初の商業高校生専門検定塾） */
export function BarBrand() {
  return (
    <span className={s.barBrand}>
      <Logo />
      <span className={s.barTagline}>{siteMeta.tagline}</span>
    </span>
  );
}

/** 文の一部をオレンジにするための部品（hl: true の部分がオレンジ、mark: true は下線のマーカー） */
export function Parts({ parts }: { parts: LpTextPart[] }) {
  return (
    <>
      {parts.map((p, i) => (
        <span key={i} className={p.hl ? s.hl : p.mark ? s.mark : undefined}>
          {p.t}
        </span>
      ))}
    </>
  );
}

/** 横に流れ続ける帯 */
export function Marquee({
  items,
  itemClass,
  dur,
  className,
}: {
  items: string[];
  itemClass: string;
  dur: string;
  className: string;
}) {
  const group = (hidden: boolean) => (
    <div className={s.marqueeGroup} aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i} className={itemClass}>
          {t}
        </span>
      ))}
    </div>
  );
  return (
    <div className={`${s.marquee} ${className}`}>
      <div className={s.marqueeTrack} style={{ "--dur": dur } as React.CSSProperties}>
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}

/** オレンジの大きいボタン。external のときは別タブで開く */
export function CtaBig({
  href,
  small,
  main,
  external,
}: {
  href: string;
  small?: string;
  main: string;
  external?: boolean;
}) {
  const inner = (
    <>
      {small && <span className={s.ctaSmall}>{small}</span>}
      <span className={s.ctaMain}>{main}</span>
      <span className={s.ctaArrow} aria-hidden>
        ›
      </span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={s.ctaBig}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={s.ctaBig}>
      {inner}
    </Link>
  );
}

/** ページいちばん下のフッター */
export function LpFooter({ links, copyright }: { links: { label: string; href: string }[]; copyright: string }) {
  return (
    <footer className={s.footer}>
      <Logo />
      <p className={s.footerLinks}>
        {links.map((l, i) => (
          <span key={l.href} style={{ opacity: 1 }}>
            {i > 0 && <span style={{ marginRight: 10, opacity: 0.5 }}>｜</span>}
            <Link href={l.href}>{l.label}</Link>
          </span>
        ))}
      </p>
      <p className={s.copy}>{copyright}</p>
    </footer>
  );
}
