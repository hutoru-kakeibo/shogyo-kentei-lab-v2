import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TrialForm } from "@/components/forms/TrialForm";
import { siteMeta, trialForm } from "@/lib/content";

export const metadata: Metadata = {
  title: trialForm.title,
  description: `${siteMeta.name}の無料体験のお申し込みページです。対策したい検定と希望の日時をお送りください。1時間の無料体験で実際の授業を体験いただけます。`,
  robots: { index: true, follow: true },
};

export default function TrialPage() {
  return (
    <main>
      <section className="bg-gradient-to-b from-sakura-100 to-canvas px-5 pb-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted">
          <ChevronLeft className="size-4" strokeWidth={3} />
          トップページに戻る
        </Link>

        <h1 className="mt-5 font-round text-3xl font-bold leading-tight text-ink">
          {trialForm.title}
        </h1>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {trialForm.englishTitle}
        </p>
        <p className="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-ink-muted">
          {trialForm.lead}
        </p>
      </section>

      <section className="bg-canvas px-5 pb-14 pt-4">
        <TrialForm />
      </section>
    </main>
  );
}
