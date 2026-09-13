import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { adminTrialSettings } from "@/lib/content";
import { getTrialSettingsForAdmin } from "@/lib/admin/trial-settings-actions";
import { TrialSettingsForm } from "@/components/admin/TrialSettingsForm";

export default async function AdminTrialSettingsPage() {
  const schedule = await getTrialSettingsForAdmin();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
        <ChevronLeft className="size-4" strokeWidth={3} />
        管理画面トップに戻る
      </Link>
      <h1 className="mt-4 font-round text-2xl font-bold text-ink">{adminTrialSettings.title}</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{adminTrialSettings.lead}</p>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
        <TrialSettingsForm initial={schedule} />
      </div>
    </div>
  );
}
