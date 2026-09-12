import { hero } from "@/lib/content";
import { ImagePlaceholder, type PlaceholderTone } from "@/components/ui/ImagePlaceholder";

const badgeTone: Record<PlaceholderTone, string> = {
  sakura: "border-sakura-300 text-sakura-600",
  lemon: "border-lemon-400 text-lemon-600",
  sky: "border-sky-300 text-sky-600",
  mint: "border-mint-300 text-mint-500",
};

/** 丸バッジの配置（参考サイトのように写真の上へ散らす） */
const badgePosition = ["left-2 top-5", "right-2 top-20", "bottom-8 left-8"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-lemon-100 via-sakura-100 to-canvas">
      <div className="relative h-[430px] overflow-hidden">
        {/* 斜めの切り込み：グリッド全体を傾けて、画面端でタイルが斜めに切れるようにする */}
        <div className="absolute -inset-x-24 -inset-y-16 -rotate-[8deg]">
          <div className="grid auto-rows-[136px] grid-cols-3 gap-2">
            {hero.tiles.map((tile) => (
              <ImagePlaceholder
                key={tile.label}
                label={tile.label}
                icon={tile.icon}
                tone={tile.tone}
                className={`size-full rounded-[1.75rem] ${tile.span}`}
                showLabel={false}
              />
            ))}
          </div>
        </div>

        {/* キャッチコピーを読ませるための白ベール */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/35 to-white/80" />

        {/* 丸バッジ */}
        {hero.badges.map((badge, index) => (
          <span
            key={badge.label}
            className={`absolute grid size-[80px] place-items-center whitespace-pre-line rounded-full border-2 bg-white/90 text-center font-round text-[10px] font-bold leading-tight shadow-md shadow-sakura-600/10 backdrop-blur-sm ${badgeTone[badge.tone]} ${badgePosition[index]}`}
          >
            {badge.label}
          </span>
        ))}

        {/* キャッチコピー。ページ唯一の h1 としてサイトの主題を検索エンジンに伝える */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 text-center">
          <h1>
            <span className="block">
              <span className="inline-block -rotate-2 rounded-lg bg-sakura-500 px-3 py-1 font-round text-[26px] font-bold tracking-tight text-white shadow-lg shadow-sakura-600/25">
                {hero.copyLines[0]}
              </span>
            </span>
            <span className="mt-2 block">
              <span className="inline-block rotate-1 rounded-lg bg-lemon-400 px-3 py-1 font-round text-[26px] font-bold tracking-tight text-ink shadow-lg shadow-lemon-600/25">
                {hero.copyLines[1]}
              </span>
            </span>
          </h1>
          <p className="mt-4 font-script text-2xl font-bold text-sakura-500">{hero.script}</p>
        </div>
      </div>

      {/* サブコピー */}
      <div className="relative -mt-6 px-6 pb-10 text-center">
        <p className="inline-block rounded-full bg-white/90 px-4 py-1 text-xs font-bold text-ink-muted shadow-sm">
          {hero.leadTop}
        </p>
        <p className="mt-2 font-round text-[15px] font-bold leading-relaxed text-ink">
          {hero.leadBottom}
        </p>
      </div>
    </section>
  );
}
