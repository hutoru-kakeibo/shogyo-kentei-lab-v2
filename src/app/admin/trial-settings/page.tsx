import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { adminTrialSettings } from "@/lib/content";
import { getTrialSettingsForAdmin } from "@/lib/admin/trial-settings-actions";
import { getTakenSlots } from "@/lib/trial-actions";
import { addDaysToKey, todayInJapan } from "@/lib/trial-schedule";
import { TrialSettingsForm } from "@/components/admin/TrialSettingsForm";

/** 日ごとの受付時間カレンダーで表示する期間（TrialDateOverridesEditor と揃える） */
const EDITABLE_DAYS = 365;

export default async function AdminTrialSettingsPage() {
  const today = todayInJapan();
  // 生徒側のカレンダーと同じ予約状況を読み、予約済みの時間を管理画面でも分かるようにする
  const [schedule, takenSlots] = await Promise.all([
    getTrialSettingsForAdmin(),
    getTakenSlots(today, addDaysToKey(today, EDITABLE_DAYS)),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
        <ChevronLeft className="size-4" strokeWidth={3} />
        管理画面トップに戻る
      </Link>
      <h1 className="mt-4 font-round text-2xl font-bold text-ink">{adminTrialSettings.title}</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{adminTrialSettings.lead}</p>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
        <TrialSettingsForm initial={schedule} takenSlots={takenSlots} />
      </div>
    </div>
  );
}
