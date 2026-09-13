import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { adminArticles } from "@/lib/content";
import { listArticlesForAdmin } from "@/lib/admin/article-actions";
import { ArticleList } from "@/components/admin/ArticleList";

export default async function AdminColumnsPage() {
  const items = await listArticlesForAdmin();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
        <ChevronLeft className="size-4" strokeWidth={3} />
        管理画面トップに戻る
      </Link>
      <h1 className="mt-4 font-round text-2xl font-bold text-ink">{adminArticles.title}</h1>

      <div className="mt-6">
        <ArticleList items={items} />
      </div>
    </div>
  );
}
