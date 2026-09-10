import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { adminSubjects } from "@/lib/content";
import { listSubjectsForAdmin } from "@/lib/admin/subject-actions";

export default async function AdminSubjectsPage() {
  const items = await listSubjectsForAdmin();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
        <ChevronLeft className="size-4" strokeWidth={3} />
        管理画面トップに戻る
      </Link>
      <h1 className="mt-4 font-round text-2xl font-bold text-ink">{adminSubjects.title}</h1>

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/admin/subjects/${item.slug}/edit`}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sakura-100 transition hover:shadow-md"
            >
              <div>
                <p className="text-[11px] font-bold text-ink-muted">{item.category}</p>
                <p className="mt-0.5 font-round text-[15px] font-bold text-ink">{item.name}</p>
              </div>
              <ChevronRight className="size-5 shrink-0 text-sakura-400" strokeWidth={2.5} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
