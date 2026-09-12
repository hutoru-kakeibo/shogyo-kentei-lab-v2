import Image from "next/image";
import { strongPoint } from "@/lib/content";
import { ImagePlaceholder, type PlaceholderTone } from "@/components/ui/ImagePlaceholder";

/** 吹き出しの色。イエローだけ白文字が読めないので濃いインク色にする */
const bubbleTone: Record<PlaceholderTone, string> = {
  sakura: "bg-sakura-500 text-white shadow-sakura-600/30",
  lemon: "bg-lemon-400 text-ink shadow-lemon-600/30",
  sky: "bg-sky-500 text-white shadow-sky-600/30",
  mint: "bg-mint-500 text-white shadow-mint-500/30",
};

const bubbleTailTone: Record<PlaceholderTone, string> = {
  sakura: "bg-sakura-500",
  lemon: "bg-lemon-400",
  sky: "bg-sky-500",
  mint: "bg-mint-500",
};

/** ポイントごとの背景（白 → 薄イエロー → 薄ピンク） */
const pointBackground = ["bg-white", "bg-lemon-50", "bg-sakura-50"];

export function StrongPoint() {
  return (
    <section id="strong-point" className="bg-white">
      {/* 見出し */}
      <div className="px-6 pb-8 pt-12 text-center">
        <p className="flex items-center justify-center gap-2 font-round text-sm font-bold text-sakura-500">
          <span className="inline-block h-5 w-0.5 rotate-[25deg] rounded-full bg-sakura-300" />
          {strongPoint.eyebrow}
          <span className="inline-block h-5 w-0.5 -rotate-[25deg] rounded-full bg-sakura-300" />
        </p>
        <h2 className="mt-3 font-round text-3xl font-bold tracking-tight text-ink">
          {strongPoint.brandName}
        </h2>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-sakura-400">
          {strongPoint.englishTitle}
        </p>
        <div className="mt-6 space-y-2 text-left text-[13px] leading-relaxed text-ink-muted">
          {strongPoint.lead.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      {/* Point 1〜3。hidden: true のポイントは本格実装まで非表示にする */}
      {strongPoint.points
        .filter((point) => !point.hidden)
        .map((point, index) => (
        <div key={point.no} className={`px-6 py-12 text-center ${pointBackground[index]}`}>
          <div className="relative mx-auto w-[248px]">
            {point.image ? (
              <div className="relative size-[248px] overflow-hidden rounded-full shadow-lg shadow-sakura-600/10">
                <Image
                  src={point.image}
                  alt={point.imageLabel}
                  fill
                  sizes="248px"
                  className="object-cover"
                />
              </div>
            ) : (
              <ImagePlaceholder
                label={point.imageLabel}
                icon={point.icon}
                tone={point.tone}
                className="size-[248px] rounded-full shadow-lg shadow-sakura-600/10"
              />
            )}
            {/* 円からはみ出して重なる吹き出し */}
            <span
              className={`absolute -left-3 -top-2 z-10 rounded-2xl px-5 py-2 font-script text-xl font-bold shadow-lg ${bubbleTone[point.tone]}`}
            >
              {point.no}
              <span
                className={`absolute -bottom-1.5 right-6 size-4 rotate-45 rounded-[3px] ${bubbleTailTone[point.tone]}`}
              />
            </span>
          </div>
          <h3 className="mt-7 whitespace-pre-line font-round text-xl font-bold leading-relaxed text-ink">
            {point.headline}
          </h3>
        </div>
      ))}
    </section>
  );
}
