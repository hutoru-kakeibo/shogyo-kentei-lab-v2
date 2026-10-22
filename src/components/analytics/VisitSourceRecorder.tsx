"use client";

import { useEffect } from "react";
import { rememberVisitSource } from "@/lib/visit-source";

/**
 * サイトに来たときの流入元（utm・参照元のドメイン・最初のページ）をブラウザに覚えておく。
 * 無料体験の申し込みと一緒に保存し、どの経路から申し込みがあったかを見るため。
 *
 * 生徒向けページのレイアウトに置く。レイアウトはページを移動しても作り直されないので、
 * サイトを開いた最初の1回だけ動く（サイト内の移動を「外から来た」と数えないため）。
 * 授業申し込みページ（/lesson/...）は既存生徒専用なので記録しない。
 */
export function VisitSourceRecorder() {
  useEffect(() => {
    if (window.location.pathname.startsWith("/lesson")) return;
    rememberVisitSource();
  }, []);

  return null;
}
