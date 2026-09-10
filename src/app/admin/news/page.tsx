import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { adminNews } from "@/lib/content";
import { listNewsForAdmin } from "@/lib/admin/news-actions";
import { NewsList } from "@/components/admin/NewsList";

export default async function AdminNewsPage() {
  const items = await listNewsForAdmin();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
        <ChevronLeft className="size-4" strokeWidth={3} />
        管理画面トップに戻る
      </Link>
      <h1 className="mt-4 font-round text-2xl font-bold text-ink">{adminNews.title}</h1>

      <div className="mt-6">
        <NewsList items={items} />
      </div>
    </div>
  );
}
