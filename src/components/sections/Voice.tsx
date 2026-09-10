"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { voice } from "@/lib/content";
import { ImagePlaceholder, type PlaceholderTone } from "@/components/ui/ImagePlaceholder";

const arrowTone: Record<PlaceholderTone, string> = {
  sakura: "bg-gradient-to-br from-sakura-300 to-sakura-500 shadow-sakura-400/30",
  lemon: "bg-gradient-to-br from-lemon-300 to-lemon-500 shadow-lemon-500/30",
  sky: "bg-gradient-to-br from-sky-300 to-sky-500 shadow-sky-400/30",
  mint: "bg-gradient-to-br from-mint-300 to-mint-500 shadow-mint-500/30",
};

const dotTone: Record<PlaceholderTone, string> = {
  sakura: "bg-sakura-500",
  lemon: "bg-lemon-500",
  sky: "bg-sky-500",
  mint: "bg-mint-500",
};

const ringTone: Record<PlaceholderTone, string> = {
  sakura: "ring-sakura-200",
  lemon: "ring-lemon-300",
  sky: "ring-sky-300",
  mint: "ring-mint-300",
};

/** カード外枠の色（ノートの表紙にあたる部分） */
const borderTone: Record<PlaceholderTone, string> = {
  sakura: "border-sakura-300",
  lemon: "border-lemon-400",
  sky: "border-sky-300",
  mint: "border-mint-300",
};

/** 数値を強調する文字色 */
const valueTone: Record<PlaceholderTone, string> = {
  sakura: "text-sakura-600",
  lemon: "text-lemon-600",
  sky: "text-sky-600",
  mint: "text-mint-500",
};

/** マーカーで引いたような下線の色 */
const markerTone: Record<PlaceholderTone, string> = {
  sakura: "bg-sakura-200",
  lemon: "bg-lemon-300",
  sky: "bg-sky-200",
  mint: "bg-mint-200",
};

/** ノートのリング留め穴の色 */
const bindingTone: Record<PlaceholderTone, string> = {
  sakura: "border-sakura-300 bg-sakura-50",
  lemon: "border-lemon-400 bg-lemon-50",
  sky: "border-sky-300 bg-sky-50",
  mint: "border-mint-300 bg-mint-50",
};

function StatCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: PlaceholderTone;
}) {
  return (
    <div className="px-3 py-2.5">
      <p className="text-[10px] font-bold text-ink-muted">{label}</p>
      <p className={`mt-0.5 font-round text-lg font-bold ${valueTone[tone]}`}>{value}</p>
    </div>
  );
}

/** 「塾の推しポイント」用のハイライトボックス。2行までの改行付きテキストに対応する */
function RecommendPoint({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: PlaceholderTone;
}) {
  return (
    <div className={`rounded-xl px-3 py-2.5 ${markerTone[tone]}/40`}>
      <p className="flex items-center gap-1 text-[10px] font-bold text-ink-muted">
        <Sparkles className={`size-3 ${valueTone[tone]}`} strokeWidth={2.5} />
        {label}
      </p>
      <p className="mt-1 whitespace-pre-line text-[13px] font-bold leading-relaxed text-ink">
        {value}
      </p>
    </div>
  );
}

export function Voice() {
  const [index, setIndex] = useState(0);
  const { items, labels } = voice;
  const current = items[index];
  // 声が1件しかない間は、矢印・ドットを出さずカードだけを表示する
  const hasMultiple = items.length > 1;

  const go = (delta: number) => {
    setIndex((prev) => (prev + delta + items.length) % items.length);
  };

  return (
    <section id="voice" className="bg-white px-5 py-14">
      <div className="text-center">
        <h2 className="font-round text-3xl font-bold tracking-tight text-ink">{voice.title}</h2>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {voice.englishTitle}
        </p>
        <p className="mt-4 text-[13px] font-bold leading-relaxed text-ink-muted">{voice.lead}</p>
      </div>

      <div className="relative mt-8 flex items-center gap-2">
        {hasMultiple ? (
          <button
            type="button"
            aria-label={voice.prevLabel}
            onClick={() => go(-1)}
            className={`grid size-10 shrink-0 place-items-center rounded-full text-white shadow-md transition active:translate-y-0.5 ${arrowTone[current.tone]}`}
          >
            <ChevronLeft className="size-5" strokeWidth={3} />
          </button>
        ) : null}

        {/* 合格体験記カード：ノートの表紙をイメージした方眼紙背景＋リング留め */}
        <div
          aria-live="polite"
          className={`relative min-w-0 flex-1 overflow-hidden rounded-[1.5rem] border-[3px] bg-white pr-4 shadow-md shadow-sakura-600/10 ${borderTone[current.tone]}`}
        >
          {/* 方眼紙の背景パターン */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:18px_18px]"
          />

          {/* 右端のノートリング留め */}
          <div className="absolute inset-y-0 right-0 z-10 flex w-4 flex-col items-center justify-evenly py-3">
            {Array.from({ length: 6 }, (_, i) => (
              <span
                key={i}
                className={`size-3 shrink-0 rounded-full border-2 ${bindingTone[current.tone]}`}
              />
            ))}
          </div>

          <div className="relative px-5 py-5">
            {/* 見出しバッジ：マーカーで引いたような下線付き */}
            <p className="flex items-center justify-center gap-2 text-center">
              <span className="text-sakura-300">＼</span>
              <span className="relative inline-block">
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0.5 h-2.5 -rotate-1 ${markerTone[current.tone]}`}
                />
                <span className="relative font-round text-xl font-bold text-ink">
                  {current.gradeLabel}
                </span>
              </span>
              <span className="text-sakura-300">／</span>
            </p>

            {/* アバター＋プロフィール */}
            <div className="mt-4 flex items-center gap-3">
              {current.photo ? (
                <div
                  className={`relative size-14 shrink-0 overflow-hidden rounded-full ring-4 ${ringTone[current.tone]}`}
                >
                  <Image
                    src={current.photo}
                    alt={`${current.name}の写真`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <ImagePlaceholder
                  label={`${current.name}の写真`}
                  icon="PartyPopper"
                  tone={current.tone}
                  showLabel={false}
                  className={`size-14 shrink-0 rounded-full ring-4 ${ringTone[current.tone]}`}
                />
              )}
              <div>
                <p className="text-[11px] font-bold text-ink-muted">{current.bio}</p>
                <p className="font-round text-base font-bold text-ink">{current.name}</p>
              </div>
            </div>

            {/* 学習実績テーブル */}
            <div className="mt-4 overflow-hidden rounded-xl border border-sakura-100 bg-white/70">
              <div className="grid grid-cols-2 divide-x divide-sakura-100 border-b border-sakura-100">
                <StatCell label={labels.totalHours} value={current.totalHours} tone={current.tone} />
                <StatCell
                  label={labels.mockBestScore}
                  value={current.mockBestScore}
                  tone={current.tone}
                />
              </div>
              <div className="grid grid-cols-2 divide-x divide-sakura-100">
                <StatCell label={labels.totalDays} value={current.totalDays} tone={current.tone} />
                <StatCell label={labels.mockCount} value={current.mockCount} tone={current.tone} />
              </div>
            </div>

            {/* 塾の推しポイント（2行まで） */}
            <div className="mt-3">
              <RecommendPoint
                label={labels.recommendPoint}
                value={current.recommendPoint}
                tone={current.tone}
              />
            </div>
          </div>
        </div>

        {hasMultiple ? (
          <button
            type="button"
            aria-label={voice.nextLabel}
            onClick={() => go(1)}
            className={`grid size-10 shrink-0 place-items-center rounded-full text-white shadow-md transition active:translate-y-0.5 ${arrowTone[current.tone]}`}
          >
            <ChevronRight className="size-5" strokeWidth={3} />
          </button>
        ) : null}
      </div>

      {/* ドットインジケーター（声が2件以上あるときだけ表示） */}
      {hasMultiple ? (
        <div className="mt-5 flex justify-center gap-2">
          {items.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              aria-label={`${itemIndex + 1}件目の声を表示`}
              aria-current={itemIndex === index}
              onClick={() => setIndex(itemIndex)}
              className={`h-2 rounded-full transition-all ${
                itemIndex === index ? `w-6 ${dotTone[current.tone]}` : "w-2 bg-sakura-100"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
