"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type ReactNode } from "react";
import type { LpTextPart } from "@/lib/lp-content";
import s from "./lp.module.css";

/** 画面に入ったら、1文字ずつ打ち込むように表示する */
export function Typewriter({ lines }: { lines: LpTextPart[][] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const total = lines.reduce((sum, line) => sum + line.reduce((n, p) => n + p.t.length, 0), 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || timer) return;
        timer = setInterval(() => {
          setCount((c) => {
            if (c + 1 >= total && timer) clearInterval(timer);
            return Math.min(c + 1, total);
          });
        }, 85);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [total]);

  // 各行・各まとまりが、全体の何文字目から始まるか
  const lineStarts = lines.map((_, i) =>
    lines.slice(0, i).reduce((sum, l) => sum + l.reduce((n, p) => n + p.t.length, 0), 0),
  );
  return (
    <div ref={ref} className={s.typeBox} aria-label={lines.map((l) => l.map((p) => p.t).join("")).join("")}>
      {lines.map((line, i) => {
        const start = lineStarts[i];
        const lineLength = line.reduce((n, p) => n + p.t.length, 0);
        const shown = Math.max(0, Math.min(count - start, lineLength));
        if (shown === 0) {
          // 打ち始める前は、カーソルだけを最初の行の位置に出す
          return i === 0 ? <span key={i} className={s.typeCaret} aria-hidden /> : null;
        }
        // カーソルは打っている途中の行、打ち終わったら最後の行に出す
        const isCurrent = count < start + lineLength || (count >= total && i === lines.length - 1);
        const partStarts = line.map((_, j) => line.slice(0, j).reduce((n, p) => n + p.t.length, 0));
        return (
          <span key={i} aria-hidden>
            <span className={s.typeLine}>
              {line.map((p, j) => {
                const text = p.t.slice(0, Math.max(0, shown - partStarts[j]));
                return text ? (
                  <span key={j} className={p.hl ? s.hl : undefined}>
                    {text}
                  </span>
                ) : null;
              })}
            </span>
            {isCurrent ? <span className={s.typeCaret} /> : null}
          </span>
        );
      })}
    </div>
  );
}

/** 横にスワイプするカード。下に今どのカードかの点（と、必要なら左右の矢印）を出す */
export function SnapCarousel({
  children,
  arrows = false,
  wide = false,
  autoplayMs,
  label,
}: {
  children: ReactNode;
  arrows?: boolean;
  wide?: boolean;
  /** 指定すると、この間隔（ミリ秒）で次のカードへ自動で送る。最後まで行ったら最初に戻る */
  autoplayMs?: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  /** 指で触ったあとしばらくは自動で送らない（この時刻まで止める） */
  const pausedUntil = useRef(0);
  const items = Children.toArray(children);
  const count = items.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const c = child as HTMLElement;
        const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      activeRef.current = best;
      setActive(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => {
    const el = ref.current;
    const target = el?.children[Math.max(0, Math.min(count - 1, i))] as HTMLElement | undefined;
    if (!el || !target) return;
    // カルーセルの中だけを横に動かす（ページ全体はスクロールさせない）
    el.scrollTo({ left: target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2, behavior: "smooth" });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el || !autoplayMs || count < 2) return;
    // 動きを減らす設定にしている人には自動で動かさない
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pause = () => {
      pausedUntil.current = Date.now() + 4000;
    };
    el.addEventListener("pointerdown", pause, { passive: true });
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("wheel", pause, { passive: true });
    const timer = setInterval(() => {
      if (Date.now() < pausedUntil.current || document.hidden) return;
      const next = (activeRef.current + 1) % count;
      const target = el.children[next] as HTMLElement | undefined;
      if (!target) return;
      el.scrollTo({ left: target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2, behavior: "smooth" });
    }, autoplayMs);
    return () => {
      clearInterval(timer);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("wheel", pause);
    };
  }, [autoplayMs, count]);

  const dots = (
    <div className={s.carouselDots}>
      {items.map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i + 1}枚目を表示`}
          onClick={() => {
            pausedUntil.current = Date.now() + 4000;
            go(i);
          }}
          className={`${s.carouselDot} ${i === active ? s.carouselDotActive : ""}`}
        />
      ))}
    </div>
  );

  return (
    <div>
      <div ref={ref} className={`${s.carousel} ${wide ? s.carouselWide : ""}`} aria-label={label}>
        {/* 表示中のカードに data-active="true" を付ける（拡大などの見た目は CSS 側で決める） */}
        {items.map((item, i) =>
          isValidElement<{ "data-active"?: string }>(item)
            ? cloneElement(item, { "data-active": i === active ? "true" : "false" })
            : item,
        )}
      </div>
      {items.length > 1 &&
        (arrows ? (
          <div className={s.carouselNav}>
            <button type="button" className={s.arrowBtn} aria-label="前へ" onClick={() => go(active - 1)}>
              ‹
            </button>
            {dots}
            <button type="button" className={s.arrowBtn} aria-label="次へ" onClick={() => go(active + 1)}>
              ›
            </button>
          </div>
        ) : (
          dots
        ))}
    </div>
  );
}

/** ファーストビューを過ぎたら画面下に出る申し込みボタン。申し込み欄が見えている間は隠す */
export function StickyCta({ label, href }: { label: string; href: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // 申し込み欄が画面に出ているあいだだけ隠す（通り過ぎたら、よくある質問などの上でまた出す）
      const rect = document.getElementById("apply")?.getBoundingClientRect();
      const applyOnScreen = rect ? rect.top < window.innerHeight * 0.6 && rect.bottom > 80 : false;
      setShow(window.scrollY > 600 && !applyOnScreen);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`${s.sticky} ${show ? "" : s.stickyHidden}`} aria-hidden={!show} data-cta="sticky">
      <a href={href} className={s.ctaBig} tabIndex={show ? 0 : -1}>
        <span className={s.ctaMain}>{label}</span>
      </a>
    </div>
  );
}

/**
 * スクロールに合わせた動きをまとめて担当する（画面には何も出さない）。
 * - data-rv の要素：画面に入ったら data-in を付ける（出方は CSS 側で決める）
 * - data-flow：受講の流れの線を、スクロールした分だけ伸ばし、通過した番号に data-lit を付ける
 * - data-promise / data-promise-dot：読み進めた約束の番号に data-on を付ける
 */
export function ScrollEffects() {
  useEffect(() => {
    const reveal = document.querySelectorAll<HTMLElement>("[data-rv]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    reveal.forEach((el) => io.observe(el));

    const flowList = document.querySelector<HTMLElement>("[data-flow]");
    const rail = flowList?.querySelector<HTMLElement>("[data-rail]");
    const steps = flowList ? Array.from(flowList.querySelectorAll<HTMLElement>("[data-step]")) : [];
    const promises = Array.from(document.querySelectorAll<HTMLElement>("[data-promise]"));
    const dots = Array.from(document.querySelectorAll<HTMLElement>("[data-promise-dot]"));

    let frame = 0;
    const update = () => {
      frame = 0;
      // 画面の上から6割の位置を「読んでいる場所」とみなす
      const mark = window.innerHeight * 0.6;
      if (flowList && rail) {
        const r = flowList.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (mark - r.top) / Math.max(1, r.height - 60)));
        rail.style.setProperty("--p", String(p));
        steps.forEach((st) => st.toggleAttribute("data-lit", st.getBoundingClientRect().top + 20 < mark));
      }
      promises.forEach((pr, i) => dots[i]?.toggleAttribute("data-on", pr.getBoundingClientRect().top < mark));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}

/** よくある質問。押すと答えが開く（いくつでも同時に開ける） */
export function LpFaq({ items }: { items: readonly { id: string; question: string; answer: string }[] }) {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const toggle = (id: string) =>
    setOpenIds((current) => (current.includes(id) ? current.filter((v) => v !== id) : [...current, id]));

  return (
    <ul className={s.faqList}>
      {items.map((item) => {
        const open = openIds.includes(item.id);
        const panelId = `${item.id}-answer`;
        return (
          <li key={item.id} className={s.faqItem} data-open={open || undefined} data-rv>
            <h3>
              <button
                type="button"
                className={s.faqQ}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span className={s.faqMark} aria-hidden>
                  Q
                </span>
                {item.question}
                <span className={s.faqToggle} aria-hidden>
                  ＋
                </span>
              </button>
            </h3>
            <div id={panelId} className={s.faqA} hidden={!open}>
              <span className={s.faqMark} aria-hidden>
                A
              </span>
              <p>{item.answer}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
