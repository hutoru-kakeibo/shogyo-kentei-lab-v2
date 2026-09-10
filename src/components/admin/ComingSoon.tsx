import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/** Step 1〜4 で実装するまでの仮ページ */
export function ComingSoon({ title, step }: { title: string; step: number }) {
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
        <ChevronLeft className="size-4" strokeWidth={3} />
        管理画面トップに戻る
      </Link>
      <h1 className="mt-4 font-round text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-3 rounded-2xl bg-white p-6 text-[13px] font-bold text-ink-muted shadow-sm ring-1 ring-sakura-100">
        Step {step} で実装予定です。
      </p>
    </div>
  );
}
