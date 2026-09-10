import { ArrowUpRight, Smartphone, type LucideIcon } from "lucide-react";
import { freeMaterials } from "@/lib/content";
import type { PlaceholderTone } from "@/components/ui/ImagePlaceholder";

// 新しい教材を追加してアイコンを変えたくなったら、ここに lucide-react のアイコンを追加する
const icons: Record<string, LucideIcon> = { Smartphone };

/**
 * 「全商英検対策アプリ」の正方形ロゴ（ピンク地に白抜きで「全商／英検」＋区切り線）を再現したバッジ。
 * アプリ側から提供された画像ファイルではなく、見た目をそのままコードで再現している。
 */
function ZenshoEikenLogo() {
  return (
    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sakura-500">
      <span className="flex flex-col items-center gap-1 leading-none text-white">
        <span className="font-round text-[10px] font-bold tracking-wide">全商</span>
        <span className="h-px w-4 bg-white/70" />
        <span className="font-round text-[10px] font-bold tracking-wide">英検</span>
      </span>
    </span>
  );
}

/** アイコンを載せる丸バッジの色 */
const iconTone: Record<PlaceholderTone, string> = {
  sakura: "bg-gradient-to-br from-sakura-300 to-sakura-500 text-white shadow-sakura-400/30",
  lemon: "bg-gradient-to-br from-lemon-300 to-lemon-500 text-ink shadow-lemon-500/30",
  sky: "bg-gradient-to-br from-sky-300 to-sky-500 text-white shadow-sky-400/30",
  mint: "bg-gradient-to-br from-mint-300 to-mint-500 text-white shadow-mint-500/30",
};

/** ジャンルタグ（アプリ／PDF／ドリル）の色 */
const tagTone: Record<PlaceholderTone, string> = {
  sakura: "bg-sakura-100 text-sakura-600",
  lemon: "bg-lemon-100 text-ink",
  sky: "bg-sky-100 text-sky-600",
  mint: "bg-mint-100 text-mint-500",
};

export function FreeMaterials() {
  return (
    <section id="materials" className="bg-gradient-to-b from-sky-50 to-white px-6 py-14">
      <div className="text-center">
        <h2 className="font-round text-3xl font-bold tracking-tight text-ink">
          {freeMaterials.title}
        </h2>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {freeMaterials.englishTitle}
        </p>
        <p className="mt-4 text-[13px] font-bold leading-relaxed text-ink-muted">
          {freeMaterials.lead}
        </p>
      </div>

      <ul className="mt-8 space-y-4">
        {freeMaterials.items.map((item) => {
          const Icon = icons[item.icon];
          const cardClass =
            "flex gap-4 rounded-2xl bg-white p-5 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100";

          const content = (
            <>
              {item.icon === "zensho-eiken-logo" ? (
                <ZenshoEikenLogo />
              ) : (
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-2xl ${iconTone[item.tone]}`}
                >
                  <Icon className="size-6" strokeWidth={2.5} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${tagTone[item.tone]}`}
                  >
                    {item.tag}
                  </span>
                  {item.available ? (
                    <span className="rounded-full bg-mint-100 px-2.5 py-0.5 text-[10px] font-bold text-mint-500">
                      {item.badgeLabel}
                    </span>
                  ) : (
                    <span className="rounded-full bg-lemon-200 px-2.5 py-0.5 text-[10px] font-bold text-ink">
                      {item.badgeLabel}
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-start justify-between gap-2">
                  <p className="font-round text-[15px] font-bold leading-snug text-ink">
                    {item.title}
                  </p>
                  {item.href ? (
                    <ArrowUpRight
                      className="mt-0.5 size-4 shrink-0 text-sky-500"
                      strokeWidth={2.5}
                    />
                  ) : null}
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
                  {item.description}
                </p>
              </div>
            </>
          );

          // 配布先URLがある教材だけ、外部サイトへのリンクにする
          return (
            <li key={item.id}>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${cardClass} transition active:translate-y-0.5`}
                >
                  {content}
                </a>
              ) : (
                <div className={cardClass}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
