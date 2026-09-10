import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isCurrentUserAdmin } from "@/lib/auth/server";
import { admin } from "@/lib/content";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: admin.title,
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // 管理者でなければ、この配下のページは一切表示しない
  // （RLSでもデータは守られているが、それ以前にページ自体を見せない）
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) redirect("/login");

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="flex items-center justify-between border-b border-sakura-100 bg-white px-5 py-4">
        <Link href="/admin" className="font-round text-lg font-bold text-ink">
          {admin.title}
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs font-bold text-ink-muted">
            {admin.backToSite}
          </Link>
          <LogoutButton />
        </div>
      </header>
      <div className="px-5 py-6">{children}</div>
    </div>
  );
}
