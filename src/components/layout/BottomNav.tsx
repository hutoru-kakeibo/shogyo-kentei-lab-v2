import Link from "next/link";
import { GraduationCap, PencilLine, Search } from "lucide-react";
import { bottomNav, type BottomNavTone } from "@/lib/content";

const icons = { Search, PencilLine, GraduationCap };

/**
 * トーンごとの背景グラデーションと文字色。
 * イエローは白文字だと読めないので、濃いインク色を載せる。
 */
const toneClass: Record<BottomNavTone, string> = {
  lemon: "from-lemon-300 to-lemon-500 text-ink shadow-lemon-500/30",
  sakura: "from-sakura-300 to-sakura-500 text-white shadow-sakura-400/30",
  sky: "from-sky-300 to-sky-500 text-white shadow-sky-400/30",
};

export function BottomNav() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div className="pointer-events-auto mx-auto grid max-w-[480px] grid-cols-3 gap-1 px-1 pb-safe">
        {bottomNav.map((item) => {
          const Icon = icons[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-t-2xl bg-gradient-to-b py-2.5 shadow-lg transition active:translate-y-0.5 ${toneClass[item.tone]}`}
            >
              <Icon className="size-5" strokeWidth={2.5} />
              <span className="font-round text-[13px] font-bold tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
