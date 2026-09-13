import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { adminArticles } from "@/lib/content";
import { getArticleForAdmin } from "@/lib/admin/article-actions";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function AdminColumnsEditPage({
  params,
}: PageProps<"/admin/columns/[id]/edit">) {
  const { id } = await params;
  const item = await getArticleForAdmin(id);

  if (!item) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/columns"
        className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted"
      >
        <ChevronLeft className="size-4" strokeWidth={3} />
        {adminArticles.title}に戻る
      </Link>
      <h1 className="mt-4 font-round text-2xl font-bold text-ink">{adminArticles.editLabel}</h1>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
        <ArticleForm existing={item} />
      </div>
    </div>
  );
}
