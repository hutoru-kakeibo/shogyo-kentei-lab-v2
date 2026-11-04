import Image from "next/image";
import Link from "next/link";
import { courseSearch, faq, flow, teachers, voice as voiceCopy } from "@/lib/content";
import { lp } from "@/lib/lp-content";
import { getVoiceItems } from "@/lib/voice";
import { LpFaq, ScrollEffects, SnapCarousel, StickyCta, Typewriter } from "@/components/lp/LpClient";
import { BarBrand, CtaBig, Logo, Marquee, Parts } from "@/components/lp/LpParts";
import { LpColumnsSection, LpNewsSection } from "@/components/lp/LpPosts";
import { FaqJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import s from "@/components/lp/lp.module.css";

/** 合格者の声を Supabase から読むため、5分ごとに作り直す（今のトップページと同じ） */
export const revalidate = 300;

/** 講師カルーセルに出す講師（塾長・英語顧問・講師・インターン生2人） */
const homeTeachers = teachers.items.slice(0, 5);
const subjectOptions = courseSearch.categories.flatMap((c) =>
  c.items.filter((i) => i.ready).map((i) => ({ name: i.name, slug: i.href.replace("/subjects/", "") })),
);
/** 対応検定のボタン。公開中の検定はその検定のページへ、準備中のものは検定一覧へ移る */
const svcItems = courseSearch.categories.flatMap((c) =>
  c.items.map((i) => ({ name: i.name, href: i.ready ? i.href : "/subjects" })),
);

/** 約束ごとのイラスト。ノート（授業プリント）に書いたような見た目にしている */
function PromiseWindow({ kind, no }: { kind: (typeof lp.promises)[number]["window"]; no: number }) {
  const titles = {
    weak: "つまずきやすいところ",
    subjects: "対策できる検定",
    chat: "実際のやり取り",
    schedule: "今週の予定",
    roadmap: "3年間のロードマップ",
  };
  let body: React.ReactNode;
  if (kind === "weak") {
    body = (
      <>
        <div className={s.checklist}>
          {["仕訳のルール", "決算整理", "関数の組み合わせ", "長文の読み方"].map((t, i) => (
            <p key={t} className={s.checkItem}>
              <span className={s.checkBox}>{i < 3 ? <i>✓</i> : null}</span>
              {t}
            </p>
          ))}
        </div>
        <div className={s.windowPhoto}>
          <Image src="/images/teacher-nagamine.jpg" alt="" fill sizes="92px" />
        </div>
      </>
    );
  } else if (kind === "subjects") {
    const names = ["簿記実務", "情報処理", "英語", "ビジネス文書", "商業経済", "珠算・電卓", "財務諸表分析", "日商簿記"];
    body = (
      <>
        <div className={s.chipCloud}>
          {names.map((n) => (
            <span key={n} className={s.chip}>
              {n}
            </span>
          ))}
        </div>
        <p className={s.oneLab}>
          ぜんぶ <Logo /> ひとつで
        </p>
      </>
    );
  } else if (kind === "chat") {
    body = (
      <div className={s.chat}>
        <p className={`${s.bubble} ${s.bubbleMe}`}>減価償却の問題、どこから手をつければいいかわからない…</p>
        <p className={`${s.bubble} ${s.bubbleTeacher}`}>
          <span className={s.bubbleWho}>講師</span>
          大丈夫！まず問題文から「取得日」と「決算日」に印をつけてみよう
        </p>
        <p className={`${s.bubble} ${s.bubbleMe}`}>できた！わかった気がする！</p>
      </div>
    );
  } else if (kind === "schedule") {
    const days = ["月", "火", "水", "木", "金", "土", "日"];
    const times = ["17:00", "19:00", "21:00"];
    // 部活・テスト週間の日をよけて、空いている時間に授業を入れるイメージ
    const on = new Set(["19:00-火", "21:00-木", "17:00-土"]);
    const club = new Set(["17:00-月", "17:00-火", "17:00-水", "17:00-木", "17:00-金"]);
    body = (
      <>
        <div className={s.week}>
          <span />
          {days.map((d) => (
            <span key={d} className={s.weekHead}>
              {d}
            </span>
          ))}
          {times.map((t) => (
            <div key={t} style={{ display: "contents" }}>
              <span className={s.weekTime}>{t}</span>
              {days.map((d) => {
                const key = `${t}-${d}`;
                return (
                  <span
                    key={key}
                    className={`${s.slot} ${on.has(key) ? s.slotOn : ""} ${club.has(key) ? s.slotClub : ""}`}
                  >
                    {on.has(key) ? "授業" : club.has(key) ? "部活" : ""}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        <span className={s.note}>※イメージです</span>
      </>
    );
  } else {
    body = (
      <>
        <div className={s.road}>
          {[
            ["1年", "検定勉強", "40%"],
            ["2年", "課外活動", "65%"],
            ["3年", "推薦入試対策", "90%"],
          ].map(([y, t, w]) => (
            <div key={y} className={s.roadRow}>
              <span className={s.roadYear}>{y}</span>
              <span className={s.roadBar} style={{ "--w": w } as React.CSSProperties}>
                {t}
              </span>
            </div>
          ))}
        </div>
        <p className={s.roadGoal}>→ 推薦・進学・就職へ！</p>
        <span className={s.note}>※イメージです</span>
      </>
    );
  }
  return (
    <div className={s.window} data-rv>
      <div className={s.noteHead}>
        <span className={s.noteTitle}>{titles[kind]}</span>
        <span className={s.noteNo}>No.{String(no).padStart(2, "0")}</span>
      </div>
      <div className={s.windowBody}>{body}</div>
    </div>
  );
}

export default async function Home() {
  const voices = await getVoiceItems();

  return (
    <>
      <OrganizationJsonLd />
      <FaqJsonLd />
      <ScrollEffects />
      <Marquee items={lp.tags} itemClass={s.tag} dur="40s" className={s.tags} />

        <main>
          {/* ファーストビュー */}
          <section className={s.fv}>
            <div className={s.fvCard}>
              <div className={s.fvBody}>
                <p className={s.kicker}>{lp.fv.kicker}</p>
                <h1 className={s.fvTitle}>
                  {/* 開いたときに、1行ずつ下からせり上がる */}
                  <span className={s.fvL1}>
                    <span className={s.rise}>{lp.fv.line1}</span>
                  </span>
                  <span className={s.fvL2}>
                    <span className={s.rise}>
                      <span className={`${s.fvKey} ${s.sheen}`}>{lp.fv.keyword}</span>
                      {lp.fv.keywordAfter}
                    </span>
                  </span>
                  <span className={s.fvL3}>
                    <span className={s.rise}>{lp.fv.line3}</span>
                  </span>
                </h1>
                <div className={s.fvVisual}>
                  <div className={s.tablet}>
                    <div className={s.tabletScreen}>
                      <Image src={lp.fv.tablet.image} alt={lp.fv.tablet.alt} fill sizes="(max-width: 480px) 80vw, 360px" priority />
                    </div>
                    <span className={s.live}>
                      <i />
                      {lp.fv.tablet.live}
                    </span>
                  </div>
                  <div className={s.orbit} aria-hidden />
                  <div className={s.fvPhoto}>
                    <Image src={lp.fv.photo} alt={lp.fv.photoAlt} fill sizes="186px" priority />
                  </div>
                  <div className={s.fvLabels}>
                    {lp.fv.labels.map((parts, i) => (
                      <span key={i} className={s.blackLabel}>
                        <Parts parts={parts} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={s.fvBar}>
                <BarBrand />
                <span className={s.barSub}>
                  {lp.fv.barSub.map((t) => (
                    <span key={t} style={{ display: "block" }}>
                      {t}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </section>

          <div className={s.ctaWrap} data-cta="home_hero">
            <CtaBig href={lp.cta.href} small={lp.cta.small} main={lp.cta.big} />
          </div>

          <Marquee items={Array(8).fill(lp.band)} itemClass={s.bandItem} dur="22s" className={s.band} />

          {/* 商業検定ラボとは */}
          <section id="about" className={`${s.sec} ${s.gridW}`}>
            <p className={s.eyebrow} data-rv>
              {lp.about.eyebrow}
            </p>
            <h2 className={s.secLogoTitle} data-rv>
              <Logo />
              <span>{lp.about.titleAfter}</span>
            </h2>
            <Typewriter lines={lp.about.typeLines} />
            <SnapCarousel label="講師紹介" autoplayMs={2000}>
              {homeTeachers.map((t) => {
                const card = lp.about.teacherCards[t.id] ?? { tag: "#講師", en: "Teacher", color: "#fb4a19" };
                const name = t.name.replace(/（.*）/, "");
                return (
                  // タップすると講師一覧のその講師の場所へ移る
                  <Link
                    key={t.id}
                    href={`/teachers#${t.id}`}
                    className={s.teamCard}
                    style={{ "--card-color": card.color, display: "block" } as React.CSSProperties}
                  >
                    <div
                      className={`${s.teamTop} ${s.gridW}`}
                      style={{ backgroundColor: card.color }}
                    >
                      <p className={s.teamTag}>{card.tag}</p>
                      {t.photo && (
                        <div className={s.teamPhoto}>
                          <Image src={t.photo} alt={t.name} fill sizes="260px" />
                        </div>
                      )}
                    </div>
                    <div className={s.teamBottom}>
                      <p className={s.teamEn}>{card.en}</p>
                      <p className={s.teamName} style={{ color: card.color }}>
                        {name}
                      </p>
                      <p className={s.teamSchool}>{t.school}</p>
                    </div>
                  </Link>
                );
              })}
            </SnapCarousel>
          </section>

          <Marquee
            items={Array(8).fill(lp.band)}
            itemClass={s.bandItem}
            dur="22s"
            className={`${s.band} ${s.bandOrange}`}
          />

          {/* なぜ商ラボだと合格に近づくのか */}
          <section id="promise" className={`${s.whyHead} ${s.gridD}`}>
            <p className={s.eyebrow} data-rv>
              {lp.why.eyebrow}
            </p>
            <h2 className={s.whyTitle} data-rv>
              {lp.why.titleBefore}
              <span className={s.hl}>{lp.why.titleKeyword}</span>
              {lp.why.titleAfter}
              <br />
              {lp.why.title2}
            </h2>
            <div className={s.whyCard} data-rv>
              <p className={s.whyCardLogo}>
                <Logo />
                {lp.why.cardLogoAfter}
              </p>
              <p className={s.whyCardText}>
                <span className={s.limeMark}>
                  {lp.why.cardBefore}
                  <span className={`${s.whyNum} ${s.gradText}`}>{lp.why.cardNumber}</span>
                  {lp.why.cardAfter}
                </span>
              </p>
              {/* 5つの約束を読み進めると、通過した番号が黒くなる */}
              <div className={s.fiveList} aria-hidden>
                {lp.promises.map((_, i) => (
                  <span key={i} data-promise-dot>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <div className={`${s.promises} ${s.gridW}`}>
            {lp.promises.map((p, i) => (
              <section key={i} className={s.promise} data-promise>
                <div className={s.promiseHead} data-rv>
                  <span className={s.promiseLabel}>PROMISE</span>
                  <span className={`${s.promiseNum} ${s.gradText}`}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className={s.habit} data-rv>
                  <span className={s.habitLabel}>LAB&apos;S HABIT</span>
                  {/* habit は1行ずつの配列。1行だけの約束もある */}
                  {p.habit.map((line) => (
                    <span key={line} style={{ display: "block" }}>
                      {line}
                    </span>
                  ))}
                </p>
                <div className={s.arrowDown} aria-hidden />
                <span className={s.dakara}>だから</span>
                {/* 黒い帯が1本ずつ左から右へ伸びる */}
                <h3 className={s.result} data-rv="bars">
                  {p.result.map((parts, j) => (
                    <span key={j} className={s.resultLine}>
                      <Parts parts={parts} />
                    </span>
                  ))}
                </h3>
                <PromiseWindow kind={p.window} no={i + 1} />
                <p className={s.promiseBody} data-rv>
                  {p.body}
                </p>
              </section>
            ))}
          </div>

          {/* 商ラボが必須 */}
          <section className={`${s.must} ${s.gridD}`}>
            <p className={s.mustSmall} data-rv>
              {lp.must.small}
            </p>
            {/* 1文字ずつ大きく飛び出す */}
            <p
              className={s.mustBig}
              data-rv="chars"
              aria-label={lp.must.bigBefore + lp.must.bigKeyword + lp.must.bigAfter}
            >
              {[
                ...[...lp.must.bigBefore].map((c) => ({ c, hl: false })),
                ...[...lp.must.bigKeyword].map((c) => ({ c, hl: true })),
                ...[...lp.must.bigAfter].map((c) => ({ c, hl: false })),
              ].map((ch, i) => (
                <span
                  key={i}
                  aria-hidden
                  className={`${s.ch} ${ch.hl ? s.hl : ""}`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  {ch.c}
                </span>
              ))}
            </p>
            <div className={s.mustImage}>
              <Image src={lp.must.image} alt={lp.must.imageAlt} fill sizes="360px" />
            </div>
            <Logo />
            <CtaBig href={lp.cta.href} small={lp.cta.small} main={lp.cta.big} />
          </section>

          {/* 合格者の声 */}
          <section id="voice" className={`${s.sec} ${s.gridW}`}>
            <p className={s.eyebrow} data-rv>
              {lp.voice.eyebrow}
            </p>
            <div className={s.voiceLogo} data-rv>
              <Logo />
            </div>
            <h2 className={`${s.secTitle} ${s.voiceTitle}`} data-rv>
              {lp.voice.title}
            </h2>
            {voices.length > 0 ? (
              <SnapCarousel label="合格者の声" arrows wide>
                {voices.map((v) => (
                  <article key={v.id} className={s.voiceCard}>
                    {/* 名前は Supabase の voices から読む（リポジトリには書かない） */}
                    <p className={s.voiceNo}>{v.name}</p>
                    {v.photo && (
                      <div className={s.voiceImg}>
                        <Image src={v.photo} alt={`${v.name}の写真`} fill sizes="400px" />
                      </div>
                    )}
                    {v.bio && <p className={s.voiceWho}>{v.bio}</p>}
                    <h3 className={s.voiceHead}>
                      <span>{v.gradeLabel}</span>
                    </h3>
                    <div className={s.voiceStats}>
                      {(
                        [
                          ["totalHours", v.totalHours],
                          ["totalDays", v.totalDays],
                          ["mockBestScore", v.mockBestScore],
                          ["mockCount", v.mockCount],
                        ] as const
                      )
                        .filter(([, val]) => val)
                        .map(([key, val]) => (
                          <p key={key} className={s.voiceStat}>
                            {voiceCopy.labels[key]}
                            <b>{val}</b>
                          </p>
                        ))}
                    </div>
                    {v.recommendPoint && <p className={s.voiceBody}>{v.recommendPoint}</p>}
                  </article>
                ))}
              </SnapCarousel>
            ) : (
              <p className={s.empty}>{voiceCopy.emptyMessage}</p>
            )}
          </section>

          {/* 対応検定 */}
          <section id="service" className={`${s.svc} ${s.gridD}`}>
            <p className={s.eyebrow} data-rv>
              {lp.service.eyebrow}
            </p>
            <h2 className={s.secTitle} data-rv>
              {lp.service.title}
            </h2>
            <p className={s.svcLead} data-rv>
              {lp.service.lead}
            </p>
            {/* ボタンが1つずつぽんぽんと出てくる */}
            <div className={s.svcChips} data-rv="pop">
              {svcItems.map((item, i) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={s.svcChip}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href={lp.service.moreHref}
                className={s.svcMore}
                style={{ "--i": svcItems.length } as React.CSSProperties}
              >
                {lp.service.moreLabel}
              </Link>
            </div>
          </section>

          {/* 受講の流れ */}
          <section id="flow" className={`${s.sec} ${s.gridW}`}>
            <p className={s.eyebrow} data-rv>
              {lp.flow.eyebrow}
            </p>
            <h2 className={s.secTitle} data-rv>
              <span className={s.hl}>{lp.flow.titleKeyword}</span>
              {lp.flow.titleAfter}
              <br />
              {lp.flow.title2}
            </h2>
            {/* スクロールに合わせて左の線が伸び、通過した番号が塗られる */}
            <ol className={s.flowList} data-flow>
              <span className={s.flowRail} aria-hidden>
                <i data-rail />
              </span>
              {flow.steps.map((step, i) => (
                <li
                  key={step.no}
                  className={`${s.flowItem} ${i === flow.steps.length - 1 ? s.flowGoal : ""}`}
                  data-rv
                  data-step
                >
                  <span className={s.flowNo}>{step.no}</span>
                  <div className={s.flowCard}>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 申し込み */}
          <section id="apply" className={`${s.close} ${s.gridW}`}>
            <div className={s.closeCard}>
              <h2 className={s.closeTitle} data-rv>
                {lp.close.titleLine1}
                <br />
                <span className={`${s.closeKey} ${s.hl}`}>{lp.close.titleKeyword}</span>
                {lp.close.titleAfter}
              </h2>
              <div className={s.closeVisual} aria-hidden>
                <div className={s.orbit} />
                {[
                  { src: homeTeachers[0].photo, l: 100, t: 20, size: 104 },
                  { src: homeTeachers[1].photo, l: 22, t: 92, size: 76 },
                  { src: homeTeachers[2].photo, l: 196, t: 78, size: 76 },
                  { src: homeTeachers[3].photo, l: 128, t: 128, size: 62 },
                ].map((f, i) =>
                  f.src ? (
                    <div key={i} className={s.closeFace} style={{ left: f.l, top: f.t, width: f.size, height: f.size }}>
                      <Image src={f.src} alt="" fill sizes={`${f.size}px`} />
                    </div>
                  ) : null,
                )}
              </div>
              <div className={s.closeBar}>
                <BarBrand />
                <span className={s.barSub}>
                  {lp.fv.barSub.map((t) => (
                    <span key={t} style={{ display: "block" }}>
                      {t}
                    </span>
                  ))}
                </span>
              </div>
              {/* 検定を選んで申し込みページへ。申し込みページではその検定を選んだ状態から始まる */}
              <form action={lp.cta.href} method="get" className={s.form} data-cta="home_apply">
                <label className={s.formLabel} htmlFor="lp-subject">
                  {lp.close.selectLabel}
                  <span className={s.required}>{lp.close.required}</span>
                </label>
                <select id="lp-subject" name="subject" required defaultValue="" className={s.select}>
                  <option value="" disabled>
                    {lp.close.selectPlaceholder}
                  </option>
                  {subjectOptions.map((o) => (
                    <option key={o.slug} value={o.slug}>
                      {o.name}
                    </option>
                  ))}
                  <option value="consult">{lp.close.undecided}</option>
                </select>
                <p className={s.formNote}>{lp.close.note}</p>
                <button type="submit" className={s.ctaBig}>
                  <span className={s.ctaMain}>{lp.close.submitLabel}</span>
                  <span className={s.ctaArrow} aria-hidden>
                    ›
                  </span>
                </button>
              </form>
            </div>
          </section>

          {/* よくある質問（今のサイトから引き継ぎ。検索結果に出す構造化データも FaqJsonLd で出している） */}
          <section id="faq" className={`${s.sec} ${s.gridW}`}>
            <p className={s.eyebrow} data-rv>
              {faq.englishTitle}
            </p>
            <h2 className={s.secTitle} data-rv>
              {faq.title}
            </h2>
            <LpFaq items={faq.items} />
          </section>

          {/* コラム・新着情報 */}
          <LpColumnsSection />
          <LpNewsSection />

        </main>

      <StickyCta label={lp.stickyCta} href={lp.cta.href} />
    </>
  );
}
