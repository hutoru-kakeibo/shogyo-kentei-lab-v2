import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { news } from "@/lib/content";
import { getNewsItems } from "@/lib/news";
import { NewsCategoryTag } from "@/components/ui/NewsCategoryTag";

export async function News() {
  const items = await getNewsItems();

  return (
    <section id="news" className="bg-white px-6 py-14">
      <div className="text-center">
        <h2 className="font-round text-3xl font-bold tracking-tight text-ink">{news.title}</h2>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {news.englishTitle}
        </p>
      </div>

      {items.length > 0 ? (
        <ul className="mt-8">
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
        <p className="mt-8 rounded-2xl bg-canvas p-6 text-center text-[13px] font-bold text-ink-muted">
          {news.emptyMessage}
        </p>
      )}

      <div className="mt-8 text-center">
        <Link
          href={news.moreHref}
          className="inline-flex items-center gap-8 rounded-full bg-gradient-to-r from-lemon-300 to-lemon-500 px-8 py-4 font-round text-base font-bold text-ink shadow-lg shadow-lemon-600/30 transition active:translate-y-0.5"
        >
          {news.moreLabel}
          <ArrowRight className="size-5" strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}
