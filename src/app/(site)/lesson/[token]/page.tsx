import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { TrialForm } from "@/components/forms/TrialForm";
import { lessonForm } from "@/lib/content";
import { isValidLessonToken } from "@/lib/lesson-token";

/**
 * 既存生徒用「授業のお申し込み」ページ。
 * URL（/lesson/<token>）を知っている生徒だけが使う前提で、サイト内のどこからもリンクせず、
 * 検索エンジンにも載せない。トークンは環境変数 LESSON_FORM_TOKEN と一致したときだけ表示する。
 */
export const metadata: Metadata = {
  title: lessonForm.title,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  // ルートレイアウトの canonical（トップページ）を引き継がないようにする
  alternates: { canonical: null },
  // ページから外へ移動したとき、秘密のURLがリンク先に伝わらないようにする
  referrer: "no-referrer",
};

// 環境変数を毎回サーバー側で確認し、ページをキャッシュしない
export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: PageProps<"/lesson/[token]">) {
  const { token } = await params;
  if (!isValidLessonToken(token)) notFound();

  return (
    <main>
      <section className="bg-gradient-to-b from-lemon-100 to-canvas px-5 pb-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
          <ChevronLeft className="size-4" strokeWidth={3} />
          トップページに戻る
        </Link>

        <h1 className="mt-5 font-round text-3xl font-bold leading-tight text-ink">
          {lessonForm.title}
        </h1>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {lessonForm.englishTitle}
        </p>
        <p className="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-ink-muted">
          {lessonForm.lead}
        </p>
      </section>

      <section className="bg-canvas px-5 pb-14 pt-4">
        <TrialForm kind="lesson" lessonToken={token} />
      </section>
    </main>
  );
}
