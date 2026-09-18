"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { voice } from "@/lib/content";
import type { VoiceItem } from "@/lib/voice";
import { ImagePlaceholder, type PlaceholderTone } from "@/components/ui/ImagePlaceholder";

/** これ以上横に動かしたらスワイプとみなす距離（px） */
const SWIPE_THRESHOLD = 40;

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

export function VoiceCarousel({ items }: { items: VoiceItem[] }) {
  const [index, setIndex] = useState(0);
  // 指を置いた位置。スワイプの向きと距離を判定するために使う
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const { labels } = voice;
  const current = items[index];
  // 声が1件しかない間は、ドットを出さず、スワイプもしない
  const hasMultiple = items.length > 1;

  /** 前後の声へ移る。端まで行ったら反対側に戻る */
  const go = (delta: number) => {
    setIndex((prev) => (prev + delta + items.length) % items.length);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || !hasMultiple) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    // 縦スクロールのついでに少し横にずれただけでは切り替えない
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return;

    // 左へスワイプで次、右へスワイプで前
    go(dx < 0 ? 1 : -1);
  };

  if (!current) return null;

  return (
    <>
      {/* 合格体験記カード：ノートの表紙をイメージした方眼紙背景＋リング留め。
          スマホの幅を使い切れるよう、左右に矢印は置かず、切り替えは指のスワイプと下のドットで行う。
          touch-pan-y で縦スクロールはブラウザに任せ、横の動きだけをスワイプとして受け取る */}
      <div
        aria-live="polite"
        onTouchStart={hasMultiple ? handleTouchStart : undefined}
        onTouchEnd={hasMultiple ? handleTouchEnd : undefined}
        className={`relative mt-8 touch-pan-y select-none overflow-hidden rounded-[1.5rem] border-[3px] bg-white pr-4 shadow-md shadow-sakura-600/10 ${borderTone[current.tone]}`}
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
                  draggable={false}
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

          {/* 塾の推しポイント（2行まで）。まだ聞けていない生徒は欄ごと出さない */}
          {current.recommendPoint.trim() ? (
            <div className="mt-3">
              <RecommendPoint
                label={labels.recommendPoint}
                value={current.recommendPoint}
                tone={current.tone}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* ドットインジケーター（声が2件以上あるときだけ表示）。
          スワイプできない環境（パソコン）では唯一の操作になるので、見た目より広くタップできるようにしている */}
      {hasMultiple ? (
        <div className="mt-3 flex justify-center">
          {items.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              aria-label={`${itemIndex + 1}件目の声を表示`}
              aria-current={itemIndex === index}
              onClick={() => setIndex(itemIndex)}
              className="grid h-9 min-w-9 place-items-center px-1.5"
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  itemIndex === index ? `w-6 ${dotTone[current.tone]}` : "w-2 bg-sakura-200"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
