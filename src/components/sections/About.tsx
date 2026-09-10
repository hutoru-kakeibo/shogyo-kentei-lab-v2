import Image from "next/image";
import { about } from "@/lib/content";

export function About() {
  return (
    <section id="about" className="bg-lemon-50 px-6 py-14">
      {/* 見出し（STRONG POINTと同じ「はさみ棒」付きの型で統一） */}
      <div className="text-center">
        <p className="flex items-center justify-center gap-2 font-round text-sm font-bold text-sakura-500">
          <span className="inline-block h-5 w-0.5 rotate-[25deg] rounded-full bg-sakura-300" />
          {about.eyebrow}
          <span className="inline-block h-5 w-0.5 -rotate-[25deg] rounded-full bg-sakura-300" />
        </p>
        <h2 className="mt-3 font-round text-3xl font-bold tracking-tight text-ink">
          {about.title}
        </h2>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-sakura-400">
          {about.englishTitle}
        </p>
      </div>

      {/* ミッション：マーカーで下線を引いたような強調コピー */}
      <p className="relative mt-8 whitespace-pre-line text-center font-round text-xl font-bold leading-relaxed text-ink">
        {about.mission}
      </p>

      {/* リード文 */}
      <div className="mt-6 space-y-3 text-[13px] leading-relaxed text-ink-muted">
        {about.lead.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      {/* 塾長メッセージ */}
      <div className="mt-8 flex gap-4 rounded-3xl bg-white p-5 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full ring-4 ring-sakura-200">
          <Image
            src={about.founder.photo}
            alt={`${about.founder.name}の写真`}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-round text-base font-bold text-ink">{about.founder.name}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
            {about.founder.message}
          </p>
        </div>
      </div>

      {/* 基本情報テーブル */}
      <dl className="mt-6 overflow-hidden rounded-2xl ring-1 ring-sakura-100">
        {about.facts.map((item) => (
          <div
            key={item.label}
            className="flex gap-3 border-b border-sakura-100 bg-white px-4 py-3 last:border-b-0"
          >
            <dt className="w-20 shrink-0 text-[12px] font-bold text-ink-muted">{item.label}</dt>
            <dd className="flex-1 text-[13px] font-bold leading-relaxed text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
