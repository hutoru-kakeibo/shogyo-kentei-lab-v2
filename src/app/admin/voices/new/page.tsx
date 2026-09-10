import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { adminVoices } from "@/lib/content";
import { VoiceForm } from "@/components/admin/VoiceForm";

export default function AdminVoicesNewPage() {
  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/admin/voices"
        className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted"
      >
        <ChevronLeft className="size-4" strokeWidth={3} />
        {adminVoices.title}に戻る
      </Link>
      <h1 className="mt-4 font-round text-2xl font-bold text-ink">{adminVoices.newLabel}</h1>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
        <VoiceForm />
      </div>
    </div>
  );
}
