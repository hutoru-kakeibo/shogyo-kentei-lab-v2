import { SiteHeader } from "@/components/layout/SiteHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { ScrollTopButton } from "@/components/layout/ScrollTopButton";

/**
 * 生徒向けページ共通のレイアウト（旧ルートレイアウトの中身）。
 * ヘッダー・追従ボトムナビ・スマホ幅の枠は、このグループの配下にだけ適用される。
 * /login・/admin はこのグループの外にあるため、この見た目を持たない。
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-full bg-sakura-100/60">
      <div className="mx-auto min-h-dvh w-full max-w-[480px] bg-canvas shadow-xl shadow-sakura-600/10">
        <SiteHeader />
        <div className="pb-28">{children}</div>
      </div>
      <ScrollTopButton />
      <BottomNav />
    </div>
  );
}
