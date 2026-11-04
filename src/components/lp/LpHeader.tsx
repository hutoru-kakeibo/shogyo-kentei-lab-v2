"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ondemand, ondemandHref } from "@/lib/content";
import { lp } from "@/lib/lp-content";
import { Logo } from "@/components/lp/LpParts";
import s from "@/components/lp/lp.module.css";

/**
 * 全ページ共通のヘッダー。黒い細い帯にロゴと、右にメニューのボタン。
 * ボタンを押すと、帯の下にメニューが開く
 */
export function LpHeader() {
  const [open, setOpen] = useState(false);

  // メニューを開いているあいだは、うしろのページがスクロールしないようにする
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className={s.siteHeader}>
      <div className={s.siteHeaderBar}>
        <Link href="/" className={s.siteHeaderLogo} onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <button
          type="button"
          className={s.menuButton}
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={s.menuIcon} data-open={open || undefined} aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className={s.menuLabel}>{open ? "CLOSE" : "MENU"}</span>
        </button>
      </div>

      <div className={s.menuLayer} data-open={open || undefined} aria-hidden={!open}>
        <div className={s.menuBackdrop} onClick={() => setOpen(false)} />
        <nav className={s.menuPanel} aria-label="サイトメニュー">
          <ul className={s.menuList}>
            {lp.nav.map((item, i) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  {item.label}
                  <span aria-hidden>›</span>
                </Link>
              </li>
            ))}
            <li>
              <a
                href={ondemandHref("/", "menu")}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
              >
                <b>{String(lp.nav.length + 1).padStart(2, "0")}</b>
                {ondemand.navLabel}
                <span aria-hidden>↗</span>
              </a>
            </li>
          </ul>
          <Link
            href="/trial"
            data-cta="menu"
            className={s.ctaBig}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            <span className={s.ctaMain}>{lp.menuCta}</span>
            <span className={s.ctaArrow} aria-hidden>
              ›
            </span>
          </Link>
          <p className={s.menuSub}>
            {lp.navSub.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                {item.label}
              </Link>
            ))}
          </p>
        </nav>
      </div>
    </header>
  );
}
