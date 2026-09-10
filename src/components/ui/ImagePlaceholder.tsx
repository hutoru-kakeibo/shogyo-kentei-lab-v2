import {
  Calculator,
  ClipboardCheck,
  GraduationCap,
  Laptop,
  MessageCircleHeart,
  NotebookPen,
  PartyPopper,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

/** プレースホルダーで使えるアイコン。写真が用意でき次第このコンポーネントごと差し替える */
const icons: Record<string, LucideIcon> = {
  Calculator,
  ClipboardCheck,
  GraduationCap,
  Laptop,
  MessageCircleHeart,
  NotebookPen,
  PartyPopper,
  Sparkles,
  Users,
};

export type PlaceholderTone = "sakura" | "lemon" | "sky" | "mint";

const toneClass: Record<PlaceholderTone, string> = {
  sakura: "from-sakura-200 to-sakura-400 text-sakura-600",
  lemon: "from-lemon-200 to-lemon-400 text-lemon-600",
  sky: "from-sky-100 to-sky-300 text-sky-600",
  mint: "from-mint-100 to-mint-300 text-mint-500",
};

type Props = {
  label: string;
  icon?: string;
  tone?: PlaceholderTone;
  className?: string;
  /** 円形プレースホルダーなど、ラベルを出したくない場面で false にする */
  showLabel?: boolean;
};

/**
 * 写真が入る場所を示す仮置きブロック。
 * 実写真に差し替えるときは、このコンポーネントを next/image に置き換える。
 */
export function ImagePlaceholder({
  label,
  icon = "Sparkles",
  tone = "sakura",
  className = "",
  showLabel = true,
}: Props) {
  const Icon = icons[icon] ?? Sparkles;

  return (
    <div
      role="img"
      aria-label={label}
      className={`flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br ${toneClass[tone]} ${className}`}
    >
      <Icon className="size-8 opacity-70" strokeWidth={1.75} />
      {showLabel ? (
        <span className="px-2 text-center text-[10px] font-bold leading-tight opacity-80">
          {label}
        </span>
      ) : null}
    </div>
  );
}
