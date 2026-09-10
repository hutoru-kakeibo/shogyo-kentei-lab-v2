"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** 参考サイト同様、少しスクロールすると右下に現れる「トップへ戻る」丸ボタン */
export function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto flex max-w-[480px] justify-end px-4 pb-20">
        <button
          type="button"
          aria-label="ページの先頭へ戻る"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`pointer-events-auto grid size-12 place-items-center rounded-full bg-gradient-to-b from-sakura-300 to-sakura-500 text-white shadow-lg shadow-sakura-400/50 transition duration-300 ${
            visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          <ArrowUp className="size-6" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
