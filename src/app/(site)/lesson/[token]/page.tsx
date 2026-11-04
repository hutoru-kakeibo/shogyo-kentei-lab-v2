import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrialForm } from "@/components/forms/TrialForm";
import { lessonForm } from "@/lib/content";
import { isValidLessonToken } from "@/lib/lesson-token";
import { PageHead } from "@/components/lp/LpParts";
import s from "@/components/lp/lp.module.css";

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
      <PageHead eyebrow={lessonForm.englishTitle} title={lessonForm.title} lead={lessonForm.lead} />

      <section className={s.pageBody}>
        <div className={s.formTheme}>
          <TrialForm kind="lesson" lessonToken={token} />
        </div>
      </section>
    </main>
  );
}
