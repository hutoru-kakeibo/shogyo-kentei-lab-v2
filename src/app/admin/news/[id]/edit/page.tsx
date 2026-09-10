import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { adminNews } from "@/lib/content";
import { getNewsForAdmin } from "@/lib/admin/news-actions";
import { NewsForm } from "@/components/admin/NewsForm";

export default async function AdminNewsEditPage({
  params,
}: PageProps<"/admin/news/[id]/edit">) {
  const { id } = await params;
  const item = await getNewsForAdmin(id);

  if (!item) notFound();

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/admin/news"
        className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted"
      >
        <ChevronLeft className="size-4" strokeWidth={3} />
        {adminNews.title}に戻る
      </Link>
      <h1 className="mt-4 font-round text-2xl font-bold text-ink">{adminNews.editLabel}</h1>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
        <NewsForm existing={item} />
      </div>
    </div>
  );
}
