"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { courseSearch } from "@/lib/content";
import { subjectSlugs } from "@/lib/subjects";
import { SearchSectionHeading } from "@/components/ui/SearchSectionHeading";

/** 詳細ページが用意できている検定だけリンクにする */
function hasDetailPage(href: string) {
  return subjectSlugs.some((slug) => href === `/subjects/${slug}`);
}

export function CourseSearch() {
  // 参考サイトと同じく、初期状態はすべて開いた状態
  const [openCategories, setOpenCategories] = useState<string[]>(
    courseSearch.categories.map((category) => category.name),
  );

  const toggle = (name: string) =>
    setOpenCategories((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );

  return (
    <section id="course" className="bg-canvas">
      <SearchSectionHeading
        title={courseSearch.title}
        englishTitle={courseSearch.englishTitle}
        gradient="bg-gradient-to-b from-lemon-100 to-sakura-100"
      />

      {/* 見出しブロックに食い込む白いカード */}
      <div className="-mt-10 rounded-t-[2rem] bg-white px-5 pb-12 pt-8">
        {courseSearch.categories.map((category) => {
          const isOpen = openCategories.includes(category.name);
          const panelId = `course-panel-${category.name}`;

          return (
            <div key={category.name} className="mb-6 last:mb-0">
              <button
                type="button"
                onClick={() => toggle(category.name)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center gap-2 px-1 pb-3 text-left"
              >
                {isOpen ? (
                  <Minus className="size-5 text-sakura-500" strokeWidth={3} />
                ) : (
                  <Plus className="size-5 text-sakura-500" strokeWidth={3} />
                )}
                <span className="font-round text-lg font-bold text-sakura-500">{category.name}</span>
              </button>

              <ul id={panelId} className={`space-y-3 ${isOpen ? "" : "hidden"}`}>
                {category.items.map((item) => {
                  // 詳細ページがあっても、準備中（ready: false）の間はタップできないようにする
                  const linkable = item.ready && hasDetailPage(item.href);
                  const inner = (
                    <>
                      <span className="font-round text-[15px] font-bold leading-snug text-ink">
                        {item.name}
                        {item.ready ? null : (
                          <span className="ml-2 rounded-full bg-lemon-200 px-2 py-0.5 align-middle text-[10px] font-bold text-ink">
                            準備中
                          </span>
                        )}
                      </span>
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-full text-white shadow-sm ${
                          linkable
                            ? "bg-gradient-to-br from-sakura-400 to-sakura-600 shadow-sakura-600/30"
                            : "bg-sakura-200 shadow-sakura-300/30"
                        }`}
                      >
                        <ArrowRight className="size-4" strokeWidth={3} />
                      </span>
                    </>
                  );

                  return (
                    <li key={item.href}>
                      {/* 詳細ページが未作成の検定は、404を出さないようリンクにしない */}
                      {linkable ? (
                        <Link
                          href={item.href}
                          className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100 transition active:translate-y-0.5"
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
                          {inner}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
