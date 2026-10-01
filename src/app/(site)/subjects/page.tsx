import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { courseSearch, siteMeta, subjectIndex } from "@/lib/content";
import { getAllSubjectData } from "@/lib/subjects-data";
import { getArticleSummaries } from "@/lib/articles";
import type { Subject } from "@/lib/subjects";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { isSubjectPublished, subjectSearchName, withDefaultOpenGraph } from "@/lib/seo";

// 管理画面から検定の内容を直しても反映されるよう、検定詳細ページと同じ間隔で作り直す
export const revalidate = 300;

export const metadata: Metadata = {
  title: subjectIndex.metaTitle,
  description: subjectIndex.metaDescription,
  alternates: { canonical: "/subjects" },
  openGraph: withDefaultOpenGraph({
    title: `${subjectIndex.metaTitle}｜${siteMeta.name}`,
    description: subjectIndex.metaDescription,
    url: `${siteMeta.url}/subjects`,
  }),
};

/**
 * 一覧カードに出す一言情報（例：年2回）。
 * 検定によって基本情報の項目名が違うので、載せたい項目を順に探して最初に見つかったものを使う
 */
function highlight(subject: Subject) {
  for (const label of subjectIndex.highlightLabels) {
    const found = subject.basics.find((item) => item.label === label);
    if (found) return `${label}：${found.value}`;
  }
  return null;
}

/** 基本情報から、指定したラベルの値を探す（見つからなければ比較表の空欄記号） */
function basicValue(subject: Subject, labels: readonly string[]) {
  for (const label of labels) {
    const found = subject.basics.find((item) => item.label === label);
    if (found) return found.value;
  }
  return subjectIndex.table.empty;
}

export default async function SubjectIndexPage() {
  const [subjects, articles] = await Promise.all([getAllSubjectData(), getArticleSummaries()]);
  const bySlug = new Map(subjects.map((subject) => [subject.slug, subject]));
  // 比較表に載せるのは、公開中の検定ページだけ（courseSearch の並び順）
  const tableRows = courseSearch.categories
    .flatMap((category): string[] => category.items.map((item) => item.href))
    .map((href) => bySlug.get(href.replace("/subjects/", "")))
    .filter((subject): subject is Subject => Boolean(subject) && isSubjectPublished(subject!.slug));
  // 受ける順番のコラムは、公開中のときだけ案内する
  const roadmapPublished = articles.some((article) => article.slug === subjectIndex.roadmap.slug);

  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", path: "" },
          { name: subjectIndex.title, path: "/subjects" },
        ]}
      />

      <section className="bg-gradient-to-b from-lemon-100 to-canvas px-5 pb-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
          <ChevronLeft className="size-4" strokeWidth={3} />
          {subjectIndex.backLabel}
        </Link>

        <h1 className="mt-5 font-round text-3xl font-bold leading-tight text-ink">
          {subjectIndex.title}
        </h1>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {subjectIndex.englishTitle}
        </p>
        <p className="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-ink-muted">
          {subjectIndex.lead}
        </p>
      </section>

      {/* 比較表。「全商検定 一覧」で検索する人は、まず全体を表で見比べたいので冒頭に置く。
          スマホでは表だけを横にスクロールさせ、ページ全体ははみ出させない */}
      <section className="bg-white px-5 pb-4 pt-6">
        <h2 className="font-round text-lg font-bold text-ink">{subjectIndex.table.title}</h2>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
          {subjectIndex.table.caption}
        </p>

        <div className="mt-4 overflow-x-auto rounded-2xl ring-1 ring-sakura-100">
          <table className="w-full min-w-[560px] border-collapse text-left text-[12px] leading-relaxed">
            <thead className="bg-sakura-50 text-ink-muted">
              <tr>
                <th scope="col" className="px-3 py-2 font-bold">
                  {subjectIndex.table.headers.name}
                </th>
                <th scope="col" className="px-3 py-2 font-bold">
                  {subjectIndex.table.headers.grades}
                </th>
                <th scope="col" className="px-3 py-2 font-bold">
                  {subjectIndex.table.headers.schedule}
                </th>
                <th scope="col" className="px-3 py-2 font-bold">
                  {subjectIndex.table.headers.passLine}
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((subject) => (
                <tr key={subject.slug} className="border-t border-sakura-100 align-top">
                  <th scope="row" className="px-3 py-2.5 font-bold">
                    <Link
                      href={`/subjects/${subject.slug}`}
                      className="text-sky-600 underline underline-offset-2"
                    >
                      {subjectSearchName(subject)}
                    </Link>
                  </th>
                  <td className="px-3 py-2.5 text-ink">{basicValue(subject, ["級"])}</td>
                  <td className="px-3 py-2.5 text-ink">
                    {basicValue(subject, subjectIndex.table.scheduleLabels)}
                  </td>
                  <td className="px-3 py-2.5 text-ink">{basicValue(subject, ["合格基準"])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-ink-muted">{subjectIndex.table.note}</p>

        {roadmapPublished ? (
          <Link
            href={`/columns/${subjectIndex.roadmap.slug}`}
            className="mt-5 flex items-center gap-3 rounded-2xl bg-lemon-50 p-4 ring-1 ring-lemon-200 transition active:translate-y-0.5"
          >
            <BookOpen className="size-6 shrink-0 text-lemon-600" strokeWidth={2.5} />
            <span className="flex-1 font-round text-[14px] font-bold leading-snug text-ink">
              {subjectIndex.roadmap.label}
            </span>
            <ArrowRight className="size-5 shrink-0 text-sakura-400" strokeWidth={2.5} />
          </Link>
        ) : null}
      </section>

      <section className="bg-white px-5 pb-12 pt-6">
        {courseSearch.categories.map((category) => (
          <div key={category.name} className="mb-8 last:mb-0">
            <h2 className="px-1 pb-3 font-round text-lg font-bold text-sakura-500">
              {category.name}
            </h2>

            <ul className="space-y-3">
              {category.items.map((item) => {
                const slug = item.href.replace("/subjects/", "");
                const subject = bySlug.get(slug);
                // 詳細ページがない・準備中の検定は、名前だけ出してリンクにしない
                const linkable = Boolean(subject) && isSubjectPublished(slug);
                const highlightText = subject ? highlight(subject) : null;

                const inner = (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="font-round text-[15px] font-bold leading-snug text-ink">
                        {subject ? subjectSearchName(subject) : item.name}
                        {linkable ? null : (
                          <span className="ml-2 rounded-full bg-lemon-200 px-2 py-0.5 align-middle text-[10px] font-bold text-ink">
                            {subjectIndex.preparingLabel}
                          </span>
                        )}
                      </p>
                      {subject ? (
                        <>
                          <p className="mt-1 text-[11px] font-bold text-ink-muted">
                            {subject.fullName}
                          </p>
                          <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
                            {subject.catchCopy}
                          </p>
                          {highlightText ? (
                            <p className="mt-2 inline-block rounded-full bg-canvas px-3 py-1 text-[11px] font-bold text-ink-muted ring-1 ring-sakura-100">
                              {highlightText}
                            </p>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                    <ChevronRight
                      className={`size-5 shrink-0 ${linkable ? "text-sakura-400" : "text-sakura-200"}`}
                      strokeWidth={2.5}
                    />
                  </>
                );

                return (
                  <li key={item.href}>
                    {linkable ? (
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100 transition active:translate-y-0.5"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <p className="mt-6 text-[11px] leading-relaxed text-ink-muted">
          {subjectIndex.preparingNote}
        </p>
      </section>

      <section className="bg-canvas px-5 pb-14 pt-4">
        <div className="rounded-3xl bg-gradient-to-br from-sakura-100 to-lemon-100 p-6 text-center shadow-md shadow-sakura-600/10 ring-1 ring-sakura-200">
          <p className="font-round text-lg font-bold leading-snug text-ink">
            {subjectIndex.cta.title}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{subjectIndex.cta.body}</p>
          <Link
            href={subjectIndex.cta.href}
            data-cta="subject_index"
            className="mt-5 inline-flex items-center gap-4 rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-7 py-3.5 font-round text-[15px] font-bold text-white shadow-lg shadow-sakura-600/30 transition active:translate-y-0.5"
          >
            {subjectIndex.cta.label}
            <ArrowRight className="size-5" strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </main>
  );
}
