import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { news, siteMeta } from "@/lib/content";
import { getNewsItems } from "@/lib/news";
import { NewsCategoryTag } from "@/components/ui/NewsCategoryTag";

export const metadata: Metadata = {
  title: news.title,
  description: `${siteMeta.name}からのお知らせ・講座情報・合格実績を一覧でご覧いただけます。`,
  alternates: { canonical: "/news" },
  openGraph: { title: `${news.title}｜${siteMeta.name}`, url: `${siteMeta.url}/news` },
  robots: { index: true, follow: true },
};

// 新着情報の一覧はSupabaseの更新をなるべく早く反映したいので、トップページより短い間隔で作り直す
export const revalidate = 60;

export default async function NewsListPage() {
  // トップページの3件表示と違い、一覧ページでは全件を表示する
  const items = await getNewsItems(100);

  return (
    <main>
      <section className="bg-gradient-to-b from-lemon-100 to-canvas px-5 pb-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
          <ChevronLeft className="size-4" strokeWidth={3} />
          トップページに戻る
        </Link>

        <h1 className="mt-5 font-round text-3xl font-bold leading-tight text-ink">
          {news.title}
        </h1>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {news.englishTitle}
        </p>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{news.listLead}</p>
      </section>

      <section className="bg-white px-6 pb-14 pt-4">
        {items.length > 0 ? (
          <ul>
            {items.map((item) => (
              <li key={item.id} className="border-b border-sakura-100 py-5 first:border-t">
                <div className="flex items-center gap-3">
                  <time className="text-xs font-bold text-ink-muted">{item.date}</time>
                  <NewsCategoryTag category={item.category} />
                </div>
                <p className="mt-2 text-[15px] font-bold leading-relaxed text-ink">{item.title}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl bg-canvas p-6 text-center text-[13px] font-bold text-ink-muted">
            {news.emptyMessage}
          </p>
        )}
      </section>
    </main>
  );
}
