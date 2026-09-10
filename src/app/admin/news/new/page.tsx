import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { adminNews } from "@/lib/content";
import { NewsForm } from "@/components/admin/NewsForm";

export default function AdminNewsNewPage() {
  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/admin/news"
        className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted"
      >
        <ChevronLeft className="size-4" strokeWidth={3} />
        {adminNews.title}に戻る
      </Link>
      <h1 className="mt-4 font-round text-2xl font-bold text-ink">{adminNews.newLabel}</h1>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
        <NewsForm />
      </div>
    </div>
  );
}
