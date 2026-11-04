import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { adminSubjects, courseSearch } from "@/lib/content";
import { listSubjectsForAdmin } from "@/lib/admin/subject-actions";
import { isSubjectPublished } from "@/lib/seo";

/** サイトの「対応検定」と同じ並び（courseSearch の順）。そこに無い検定は後ろに名前順 */
const siteOrder = courseSearch.categories.flatMap((category) =>
  category.items.map((item) => item.href.replace("/subjects/", "")),
);

export default async function AdminSubjectsPage() {
  const items = await listSubjectsForAdmin();
  const rank = (slug: string) => {
    const i = siteOrder.indexOf(slug);
    return i === -1 ? siteOrder.length : i;
  };
  const sorted = [...items].sort((a, b) => rank(a.slug) - rank(b.slug) || a.name.localeCompare(b.name, "ja"));

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
        <ChevronLeft className="size-4" strokeWidth={3} />
        管理画面トップに戻る
      </Link>
      <h1 className="mt-4 font-round text-2xl font-bold text-ink">{adminSubjects.title}</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{adminSubjects.lead}</p>

      <ul className="mt-6 space-y-3">
        {sorted.map((item) => {
          const published = isSubjectPublished(item.slug);
          return (
            <li key={item.slug} className="flex items-stretch gap-2">
              <Link
                href={`/admin/subjects/${item.slug}/edit`}
                className="flex flex-1 items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sakura-100 transition hover:shadow-md"
              >
                <div>
                  <p className="flex items-center gap-2 text-[11px] font-bold text-ink-muted">
                    {item.category}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        published ? "bg-mint-100 text-mint-500" : "bg-ink-muted/10 text-ink-muted"
                      }`}
                    >
                      {published ? adminSubjects.publishedLabel : adminSubjects.draftLabel}
                    </span>
                  </p>
                  <p className="mt-0.5 font-round text-[15px] font-bold text-ink">{item.name}</p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-sakura-400" strokeWidth={2.5} />
              </Link>
              <a
                href={`/subjects/${item.slug}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`${item.name}の${adminSubjects.viewPageLabel}`}
                className="flex w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-white text-[10px] font-bold text-ink-muted shadow-sm ring-1 ring-sakura-100"
              >
                <ExternalLink className="size-4" strokeWidth={2.5} />
                {adminSubjects.viewPageLabel}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
