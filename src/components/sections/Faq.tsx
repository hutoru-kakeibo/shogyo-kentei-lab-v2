"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faq } from "@/lib/content";

export function Faq() {
  // 複数まとめて開けるようにする（初期状態はすべて閉じる）
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) =>
    setOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  return (
    <section id="faq" className="bg-gradient-to-b from-lemon-50 to-sakura-50 px-5 py-14">
      <div className="text-center">
        <h2 className="font-round text-3xl font-bold tracking-tight text-ink">{faq.title}</h2>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {faq.englishTitle}
        </p>
        <p className="mt-4 text-[13px] font-bold leading-relaxed text-ink-muted">{faq.lead}</p>
      </div>

      <ul className="mt-8 space-y-3">
        {faq.items.map((item) => {
          const isOpen = openIds.includes(item.id);
          const panelId = `${item.id}-answer`;

          return (
            <li
              key={item.id}
              className="overflow-hidden rounded-2xl bg-white shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100"
            >
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sakura-300 to-sakura-500 font-round text-sm font-bold text-white shadow-sm shadow-sakura-600/30">
                    Q
                  </span>
                  <span className="flex-1 font-round text-[15px] font-bold leading-snug text-ink">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-sakura-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    strokeWidth={3}
                  />
                </button>
              </h3>

              <div id={panelId} className={isOpen ? "" : "hidden"}>
                <div className="flex items-start gap-3 border-t border-sakura-100 bg-lemon-50 p-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-lemon-300 to-lemon-500 font-round text-sm font-bold text-ink shadow-sm shadow-lemon-600/30">
                    A
                  </span>
                  <p className="flex-1 pt-1 text-[13px] leading-relaxed text-ink-muted">
                    {item.answer}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
