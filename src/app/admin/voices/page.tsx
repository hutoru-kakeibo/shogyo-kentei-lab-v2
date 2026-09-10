import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { adminVoices } from "@/lib/content";
import { listVoicesForAdmin } from "@/lib/admin/voice-actions";
import { VoiceList } from "@/components/admin/VoiceList";

export default async function AdminVoicesPage() {
  const items = await listVoicesForAdmin();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
        <ChevronLeft className="size-4" strokeWidth={3} />
        管理画面トップに戻る
      </Link>
      <h1 className="mt-4 font-round text-2xl font-bold text-ink">{adminVoices.title}</h1>

      <div className="mt-6">
        <VoiceList items={items} />
      </div>
    </div>
  );
}
