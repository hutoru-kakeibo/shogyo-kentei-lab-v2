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

/** 下の階層のページの見出し（戻るリンク・英字・明朝の見出し・説明） */
export function PageHead({
  eyebrow,
  title,
  lead,
  back = { label: "トップページに戻る", href: "/" },
  meta,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  back?: { label: string; href: string };
  meta?: React.ReactNode;
}) {
  return (
    <section className={`${s.pageHead} ${s.gridW}`}>
      <div className={s.pageBackRow}>
        <Link href={back.href} className={s.pageBack}>
          ‹ {back.label}
        </Link>
      </div>
      <p className={s.eyebrow}>{eyebrow}</p>
      <h1 className={s.pageTitle}>{title}</h1>
      {meta && <div className={s.pageMeta}>{meta}</div>}
      {lead && <p className={s.pageLead}>{lead}</p>}
    </section>
  );
}

/**
 * 規約ページ（特定商取引法に基づく表記・プライバシーポリシー）の見出し。
 * 薄いグレーの帯に、英字の小見出し・太い見出し・短い黒い線
 */
export function LegalHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <section className={s.legalHead}>
      <p className={s.legalSub}>{eyebrow}</p>
      <h1 className={s.legalTitle}>{title}</h1>
      <span className={s.legalBar} aria-hidden />
    </section>
  );
}

/** 規約ページの1項目（オレンジの印つきの見出し＋本文） */
export function LegalRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={s.legalRow}>
      <h2 className={s.legalLabel}>
        <span className={s.legalMarker} aria-hidden />
        {label}
      </h2>
      <div className={s.legalText}>{children}</div>
    </div>
  );
}

/** 下の階層のページの最後に置く、無料体験への案内カード。cta は計測用の置き場所の名前 */
export function CtaCard({
  title,
  body,
  label,
  href = "/trial",
  cta,
}: {
  title: string;
  body?: string;
  label: string;
  href?: string;
  cta: string;
}) {
  return (
    <section className={`${s.ctaCardWrap} ${s.gridW}`}>
      <div className={s.ctaCard} data-cta={cta}>
        <p className={s.ctaCardTitle}>{title}</p>
        {body && <p className={s.ctaCardBody}>{body}</p>}
        <CtaBig href={href} main={label} />
      </div>
    </section>
  );
}

/** ページいちばん下のフッター */
export function LpFooter({
  links,
  copyright,
}: {
  links: readonly { label: string; href: string }[];
  copyright: string;
}) {
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
