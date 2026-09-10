import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  Laptop,
  PencilLine,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { flow } from "@/lib/content";
import type { PlaceholderTone } from "@/components/ui/ImagePlaceholder";

const icons: Record<string, LucideIcon> = { PencilLine, CalendarCheck, Laptop, Trophy };

/** ステップ番号バッジの色。イエローだけ白文字が読めないので濃いインク色にする */
const badgeTone: Record<PlaceholderTone, string> = {
  sakura: "from-sakura-300 to-sakura-500 text-white shadow-sakura-600/30",
  lemon: "from-lemon-300 to-lemon-500 text-ink shadow-lemon-600/30",
  sky: "from-sky-300 to-sky-500 text-white shadow-sky-600/30",
  mint: "from-mint-300 to-mint-500 text-white shadow-mint-500/30",
};

/** カード右上に薄く敷くアイコンの色 */
const watermarkTone: Record<PlaceholderTone, string> = {
  sakura: "text-sakura-300",
  lemon: "text-lemon-400",
  sky: "text-sky-300",
  mint: "text-mint-300",
};

export function Flow() {
  return (
    <section id="flow" className="bg-gradient-to-b from-sakura-50 to-lemon-50 px-5 py-14">
      <div className="text-center">
        <h2 className="font-round text-3xl font-bold tracking-tight text-ink">{flow.title}</h2>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {flow.englishTitle}
        </p>
        <p className="mt-4 whitespace-pre-line text-[13px] font-bold leading-relaxed text-ink-muted">
          {flow.lead}
        </p>
      </div>

      <ol className="mt-8">
        {flow.steps.map((step, index) => {
          const Icon = icons[step.icon];
          return (
            <li key={step.no}>
              <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
                {/* 背景に薄く敷くアイコン */}
                <Icon
                  className={`absolute -right-3 -top-3 size-24 opacity-15 ${watermarkTone[step.tone]}`}
                  strokeWidth={1.5}
                />

                <div className="relative flex items-center gap-3">
                  {/*
                    2つの文字を grid の行に均等配置すると間延びするため、
                    place-content-center で内容の高さぶんだけ縦に並べて余白を詰める。
                    上半分の白いハイライトとリングで立体感を出している。
                  */}
                  <span
                    className={`relative grid size-14 shrink-0 place-content-center overflow-hidden rounded-2xl bg-gradient-to-br text-center leading-none shadow-md ring-1 ring-white/60 before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-white/25 before:content-[''] ${badgeTone[step.tone]}`}
                  >
                    <span className="relative text-[9px] font-bold leading-none tracking-[0.18em] opacity-90">
                      STEP
                    </span>
                    <span className="relative mt-1 font-round text-[22px] font-bold leading-none">
                      {step.no}
                    </span>
                  </span>
                  <h3 className="font-round text-[17px] font-bold leading-snug text-ink">
                    {step.title}
                  </h3>
                </div>

                <p className="relative mt-3 text-[13px] leading-relaxed text-ink-muted">
                  {step.description}
                </p>
              </div>

              {/* ステップ間の下向き矢印 */}
              {index < flow.steps.length - 1 ? (
                <div className="flex justify-center py-2">
                  <ChevronDown className="size-7 text-sakura-300" strokeWidth={3} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 text-center">
        <Link
          href={flow.ctaHref}
          className="inline-flex items-center gap-6 rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-8 py-4 font-round text-base font-bold text-white shadow-lg shadow-sakura-600/30 transition active:translate-y-0.5"
        >
          {flow.ctaLabel}
          <ArrowRight className="size-5" strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}
