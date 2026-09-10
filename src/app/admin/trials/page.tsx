import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { adminTrials } from "@/lib/content";
import { listTrialsForAdmin } from "@/lib/admin/trial-actions";
import { TrialList } from "@/components/admin/TrialList";

export default async function AdminTrialsPage() {
  const items = await listTrialsForAdmin();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
        <ChevronLeft className="size-4" strokeWidth={3} />
        管理画面トップに戻る
      </Link>
      <h1 className="mt-4 font-round text-2xl font-bold text-ink">{adminTrials.title}</h1>

      <TrialList items={items} />
    </div>
  );
}
