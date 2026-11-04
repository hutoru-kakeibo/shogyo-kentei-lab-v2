import type { Metadata } from "next";
import Image from "next/image";
import { ScrollEffects } from "@/components/lp/LpClient";
import { CtaBig, Logo, Marquee, Parts } from "@/components/lp/LpParts";
import s from "@/components/lp/lp.module.css";
import { teachers } from "@/lib/content";
import { lp } from "@/lib/lp-content";

/**
 * 無料体験の申し込みが終わったあとのページ（試作）。
 * 申し込みの記録（GA4 の generate_lead）は、移ってくる前にフォーム側で送っている
 */
export const metadata: Metadata = {
  title: "お申し込みありがとうございます",
  robots: { index: false, follow: false },
};

const faces = teachers.items.slice(0, 4).filter((t) => t.photo);

export default function LpThanksPage() {
  const t = lp.thanks;

  const instagramCta = (
    <CtaBig href={t.instagram} main={t.ctaLabel} external />
  );

  return (
    <>
      <ScrollEffects />
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

          {/* Instagram の無料授業へ */}
          <section className={`${s.darkCta} ${s.gridD}`}>
            <p className={s.darkLead}>{t.ctaLead}</p>
            <p className={s.darkKey}>{t.ctaKey}</p>
            {instagramCta}
            <p className={s.ctaNote}>{t.ctaNote}</p>
          </section>

          <Marquee
            items={Array(10).fill(t.band)}
            itemClass={s.bandItem}
            dur="24s"
            className={`${s.band} ${s.bandOrange} ${s.thanksBand}`}
          />

          {/* MESSAGE */}
          <section className={`${s.msgSec} ${s.gridD}`}>
            <p className={s.eyebrow} data-rv>
              {t.eyebrow}
            </p>
            <div className={s.msgBoxes} data-rv>
              {t.message.map((line) => (
                <span key={line} className={s.msgBox}>
                  {line}
                </span>
              ))}
            </div>
            <p className={s.msgText} data-rv>
              {t.contact.map((line) => (
                <span key={line} style={{ display: "block" }}>
                  {line}
                </span>
              ))}
            </p>
            <p className={s.msgText} data-rv>
              {t.body.map((parts, i) => (
                <span key={i} style={{ display: "block" }}>
                  {i === 0 && <Logo />}
                  <Parts parts={parts} />
                </span>
              ))}
            </p>
            <p className={s.msgText} data-rv>
              {t.body2.map((parts, i) => (
                <span key={i} style={{ display: "block" }}>
                  <Parts parts={parts} />
                </span>
              ))}
            </p>
            <div className={s.teamCard} data-rv>
              <div className={s.teamFaces} aria-hidden>
                {faces.map((f) => (
                  <div key={f.name} className={s.teamFace}>
                    <Image src={f.photo!} alt="" fill sizes="68px" />
                  </div>
                ))}
              </div>
              <p className={s.teamNote}>
                <Parts parts={t.teamNote} />
              </p>
            </div>
          </section>

          {/* もう一度ボタン */}
          <section className={`${s.finalSec} ${s.gridW}`}>
            <div className={s.finalCard} data-rv>
              <p className={s.darkLead}>{t.ctaLead}</p>
              <p className={s.darkKey}>{t.ctaKey}</p>
              {instagramCta}
            </div>
          </section>
        </main>

    </>
  );
}
