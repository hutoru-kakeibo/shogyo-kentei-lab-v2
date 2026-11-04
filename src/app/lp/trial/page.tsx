import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TrialForm } from "@/components/forms/TrialForm";
import { ScrollEffects } from "@/components/lp/LpClient";
import { Logo, LpFooter, Parts } from "@/components/lp/LpParts";
import s from "@/components/lp/lp.module.css";
import { trialForm } from "@/lib/content";
import { lp } from "@/lib/lp-content";

/**
 * 新しいデザインの無料体験の申し込みページ（試作）。
 * 入力する項目・送信先・計測は今の /trial と同じフォーム（TrialForm）をそのまま使い、
 * 見た目だけを新トップページ（/lp）に合わせている。送信が終わると /lp/trial/thanks へ移る
 */
export const metadata: Metadata = {
  title: "無料体験のお申し込み（試作）",
  robots: { index: false, follow: false },
};

export default async function LpTrialPage({ searchParams }: PageProps<"/lp/trial">) {
  const { subject } = await searchParams;
  const t = lp.trial;

  return (
    <div className={s.root}>
      <noscript>
        <style>{"[data-rv]{opacity:1!important;translate:none!important}"}</style>
      </noscript>
      <ScrollEffects />
      <div className={s.col}>
        <header className={s.topBar}>
          <Logo />
          <Link href="/lp" className={s.topLink}>
            ‹ {t.back}
          </Link>
        </header>

        <main>
          {/* ファーストビュー */}
          <section className={`${s.hero} ${s.gridW}`}>
            <div className={s.heroCard}>
              <div className={s.heroOrbit} aria-hidden />
              <div className={s.heroPhoto}>
                <Image src={lp.fv.photo} alt={lp.fv.photoAlt} fill sizes="124px" priority />
              </div>
              <div className={s.heroLabels}>
                {t.labels.map((parts, i) => (
                  <span key={i} className={s.blackLabel}>
                    <Parts parts={parts} />
                  </span>
                ))}
              </div>
              <h1 className={s.heroTitle}>
                {t.title.map((parts, i) => (
                  <span key={i}>
                    <span className={s.rise}>
                      <Parts parts={parts} />
                    </span>
                  </span>
                ))}
              </h1>
            </div>
          </section>

          {/* 入力の3ステップ */}
          <section className={`${s.darkCta} ${s.gridD}`}>
            <p className={s.darkLead}>
              {t.stepsLead}
              <span className={s.darkKey} style={{ marginLeft: 6 }}>
                {t.stepsKeyword}
              </span>
            </p>
            <ol className={s.stepRow}>
              {trialForm.steps.map((step, i) => (
                <li key={step.label} style={{ display: "contents" }}>
                  {i > 0 && (
                    <span className={s.stepArrow} aria-hidden>
                      ▶
                    </span>
                  )}
                  <span className={s.stepChip}>
                    <b>{String(i + 1).padStart(2, "0")}</b>
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* 申し込みフォーム（項目は今のサイトと同じ） */}
          <section id="form" className={`${s.formSec} ${s.gridW}`}>
            <p className={s.eyebrow}>{t.eyebrow}</p>
            <h2 className={s.secTitle}>{trialForm.title}</h2>
            <p className={s.formLead}>{trialForm.lead}</p>
            <div className={s.formTheme}>
              <TrialForm
                subjectSlug={typeof subject === "string" ? subject : undefined}
                doneHref="/lp/trial/thanks"
              />
            </div>
          </section>

          {/* 無料体験でやること */}
          <section className={`${s.expectSec} ${s.gridW}`} style={{ paddingTop: 0 }}>
            <p className={s.eyebrow} data-rv>
              {t.expect.eyebrow}
            </p>
            <h2 className={s.secTitle} data-rv>
              {t.expect.title}
            </h2>
            <div className={s.window} data-rv>
              <div className={s.noteHead}>
                <span className={s.noteTitle}>{t.expect.noteTitle}</span>
                <span className={s.noteNo}>1 hour</span>
              </div>
              <div className={s.windowBody} style={{ minHeight: 0 }}>
                <div className={s.expectList}>
                  {t.expect.items.map((item) => (
                    <p key={item} className={`${s.expectItem} ${s.checkItem}`} style={{ height: "auto" }}>
                      <span className={s.checkBox}>
                        <i>✓</i>
                      </span>
                      {item}
                    </p>
                  ))}
                </div>
                <p className={s.expectNote}>{t.expect.note}</p>
              </div>
            </div>
          </section>
        </main>

        <LpFooter links={lp.footer.links} copyright={lp.footer.copyright} />
      </div>
    </div>
  );
}
