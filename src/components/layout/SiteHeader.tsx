"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { globalNav, siteMeta } from "@/lib/content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  // ドロワーを開いている間は背面のスクロールを止める
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40">
      <div className="relative flex h-16 items-center justify-between gap-2 bg-white/95 pl-4 pr-[3.75rem] shadow-sm shadow-sakura-500/10 backdrop-blur">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <span className="leading-tight">
            <span className="block whitespace-nowrap font-round text-[15px] font-bold tracking-tight text-ink">
              {siteMeta.name}
            </span>
            <span className="block whitespace-nowrap text-[9px] font-medium tracking-tight text-ink-muted">
              {siteMeta.headerTagline}
            </span>
          </span>
        </Link>

        {/* ハンバーガー：参考サイトと同じく右上の角までベタ塗りブロックで届かせる */}
        <button
          type="button"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="absolute right-0 top-0 grid h-16 w-14 place-items-center rounded-bl-2xl bg-gradient-to-b from-sakura-300 to-sakura-500 text-white shadow-lg shadow-sakura-400/30"
        >
          {open ? <X className="size-7" strokeWidth={2.5} /> : <Menu className="size-7" strokeWidth={2.5} />}
        </button>
      </div>

      {/* ドロワーメニュー */}
      <div
        className={`fixed inset-0 top-16 z-30 transition ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-ink/30"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        {/* 項目が増えてスマホの画面に収まらなくなったため、メニューの中だけスクロールさせる。
            背面のスクロールは止めているので、ここにスクロールが無いと下の項目に届かない。
            高さは「画面 − ヘッダー（4rem） − 画面下の固定ボタン（約5rem＋ホームバー分）」までにして、
            一番下の項目が固定ボタンに隠れないようにしている */}
        <nav
          className={`absolute inset-x-0 top-0 mx-auto max-h-[calc(100dvh-9rem-env(safe-area-inset-bottom))] max-w-[480px] overflow-y-auto overscroll-contain rounded-b-3xl bg-gradient-to-b from-sakura-100 to-white p-5 shadow-xl transition duration-300 ${
            open ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          <ul className="space-y-2">
            {globalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-bold text-ink shadow-sm shadow-sakura-400/15 transition active:scale-[0.99]"
                >
                  {item.label}
                  <span className="grid size-6 place-items-center rounded-full bg-lemon-200 text-ink">
                    <ChevronRight className="size-4" strokeWidth={3} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
