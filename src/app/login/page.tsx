import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { LoginForm } from "@/components/forms/LoginForm";
import { adminLogin } from "@/lib/content";

export const metadata: Metadata = {
  title: adminLogin.title,
  // 検索結果に載せる必要がないページなので、noindex にしておく
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main>
      <section className="bg-gradient-to-b from-sakura-100 to-canvas px-5 pb-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
          <ChevronLeft className="size-4" strokeWidth={3} />
          トップページに戻る
        </Link>

        <h1 className="mt-5 font-round text-3xl font-bold leading-tight text-ink">
          {adminLogin.title}
        </h1>
      </section>

      <section className="bg-canvas px-5 pb-14 pt-6">
        <div className="rounded-3xl bg-white p-6 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
