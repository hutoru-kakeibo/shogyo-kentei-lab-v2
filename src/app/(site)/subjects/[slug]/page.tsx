import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronLeft, CircleHelp, Lightbulb } from "lucide-react";
import { subjects, type Subject, type SubjectTone } from "@/lib/subjects";
import { getSubjectData } from "@/lib/subjects-data";
import { relatedSubjectSlugs, subjectFaqs } from "@/lib/subject-faq";
import { flow, siteMeta, subjectIndex } from "@/lib/content";
import { BreadcrumbJsonLd, CourseJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { isSubjectPublished, subjectSearchName, withDefaultOpenGraph } from "@/lib/seo";

// 管理画面から編集した内容を、再ビルドなしで反映するため5分ごとに作り直す
export const revalidate = 300;

/** 検定ごとのアクセント色 */
const heroTone: Record<SubjectTone, string> = {
  sakura: "from-sakura-100 to-canvas",
  lemon: "from-lemon-100 to-canvas",
  sky: "from-sky-100 to-canvas",
  mint: "from-mint-100 to-canvas",
};

const badgeTone: Record<SubjectTone, string> = {
  sakura: "bg-sakura-500 text-white",
  lemon: "bg-lemon-400 text-ink",
  sky: "bg-sky-500 text-white",
  mint: "bg-mint-500 text-white",
};

const accentTone: Record<SubjectTone, string> = {
  sakura: "text-sakura-600",
  lemon: "text-lemon-600",
  sky: "text-sky-600",
  mint: "text-mint-500",
};

export function generateStaticParams() {
  return subjects.map((subject) => ({ slug: subject.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/subjects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubjectData(slug);

  if (!subject) return {};

  // 検索では「◯◯検定とは」「級」「合格基準」「勉強法」と一緒に調べられることが多いので、
  // タイトルにもその言葉を入れて、検索結果で何が書いてあるページか伝わるようにしている
  const searchName = subjectSearchName(subject);
  const title = `${searchName}とは？級・合格基準と勉強法`;
  const description = `${searchName}の級構成・実施時期・合格基準から、つまずきやすいポイントと勉強法まで解説。商業高校生専門のオンライン個別指導による対策内容と料金もまとめています。`;

  return {
    title,
    description,
    alternates: { canonical: `/subjects/${slug}` },
    // 準備中（「検定を探す」からリンクしていない）の間は検索結果に載せない。
    // 公開済みのページでは robots を指定せず、ルートレイアウトの index, follow を引き継ぐ
    ...(isSubjectPublished(slug) ? {} : { robots: { index: false, follow: false } }),
    openGraph: withDefaultOpenGraph({
      title: `${title}｜${siteMeta.name}`,
      description,
      url: `${siteMeta.url}/subjects/${slug}`,
    }),
  };
}

/** セクション見出し */
function SectionTitle({ tone, children }: { tone: SubjectTone; children: ReactNode }) {
  return (
    <h2
      className={`flex items-center font-round text-xl font-bold before:mr-2 before:h-5 before:w-1.5 before:rounded-full before:bg-current before:content-[''] ${accentTone[tone]}`}
    >
      <span className="text-ink">{children}</span>
    </h2>
  );
}

export default async function SubjectPage({ params }: PageProps<"/subjects/[slug]">) {
  const { slug } = await params;
  const subject = await getSubjectData(slug);

  if (!subject) notFound();

  const faqItems = subjectFaqs[slug] ?? [];
  // 一緒に受ける人が多い検定。ページを持っていて、公開中のものだけ出す
  const related = (relatedSubjectSlugs[slug] ?? [])
    .map((relatedSlug) => subjects.find((item) => item.slug === relatedSlug))
    .filter((item): item is Subject => item !== undefined && isSubjectPublished(item.slug));

  return (
    <main>
      <CourseJsonLd
        name={`${subjectSearchName(subject)}の対策講座`}
        description={`${subject.fullName}の対策を1対1のオンライン個別指導で行います。${subject.catchCopy}`}
        url={`${siteMeta.url}/subjects/${slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", path: "" },
          { name: subjectIndex.title, path: "/subjects" },
          { name: subject.name, path: `/subjects/${slug}` },
        ]}
      />
      {/* この検定のよくある質問を、検索エンジンにもQ&Aとして渡す */}
      {faqItems.length > 0 ? <FaqJsonLd items={faqItems} /> : null}

      {/* ヒーロー */}
      <section className={`bg-gradient-to-b px-5 pb-10 pt-6 ${heroTone[subject.tone]}`}>
        {/* 構造化データのパンくずと同じ階層を画面にも出す */}
        <nav
          aria-label="パンくず"
          className="flex items-center gap-1 text-xs font-bold text-ink-muted"
        >
          <ChevronLeft className="size-4" strokeWidth={3} />
          <Link href="/">ホーム</Link>
          <span aria-hidden="true">›</span>
          <Link href="/subjects">{subjectIndex.title}</Link>
        </nav>

        <p className="mt-5">
          <span
            className={`rounded-full px-3 py-1 font-round text-[11px] font-bold ${badgeTone[subject.tone]}`}
          >
            {subject.category}
          </span>
        </p>
        <h1 className="mt-3 font-round text-3xl font-bold leading-tight text-ink">
          {subject.name}
        </h1>
        <p className="mt-2 text-[11px] font-bold text-ink-muted">{subject.fullName}</p>
        <p className="mt-5 font-round text-lg font-bold leading-relaxed text-ink">
          {subject.catchCopy}
        </p>
      </section>

      {/* どんな検定？ */}
      <section className="bg-white px-5 py-10">
        <SectionTitle tone={subject.tone}>どんな検定？</SectionTitle>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{subject.overview}</p>

        <dl className="mt-6 overflow-hidden rounded-2xl ring-1 ring-sakura-100">
          {subject.basics.map((item) => (
            <div
              key={item.label}
              className="flex gap-3 border-b border-sakura-100 bg-canvas px-4 py-3 last:border-b-0"
            >
              <dt className="w-20 shrink-0 text-[12px] font-bold text-ink-muted">{item.label}</dt>
              <dd className="flex-1 text-[13px] font-bold leading-relaxed text-ink">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[11px] text-ink-muted">
          ※ 最新の日程・実施要項は{subject.organizer}の発表をご確認ください。
        </p>
      </section>

      {/* 商業検定ラボの対策 */}
      <section className="bg-white px-5 py-10">
        <SectionTitle tone={subject.tone}>{siteMeta.name}の対策</SectionTitle>
        <ul className="mt-5 space-y-3">
          {subject.training.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-2xl bg-canvas p-4 ring-1 ring-sakura-100"
            >
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full ${badgeTone[subject.tone]}`}
              >
                <Check className="size-4" strokeWidth={3.5} />
              </span>
              <span className="flex-1 text-[13px] font-bold leading-relaxed text-ink">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 料金プラン */}
      <section className="bg-canvas px-5 py-10">
        <SectionTitle tone={subject.tone}>料金プラン</SectionTitle>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{subject.pricing.lead}</p>

        <ul className="mt-5 space-y-3">
          {subject.pricing.plans.map((plan) => (
            <li
              key={plan.grade}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100"
            >
              <span
                className={`rounded-xl px-3 py-1.5 font-round text-base font-bold ${badgeTone[subject.tone]}`}
              >
                {plan.grade}
              </span>
              <span className="flex items-baseline gap-1">
                <span className="font-round text-3xl font-bold text-ink">{plan.price}</span>
                <span className="text-[12px] font-bold text-ink-muted">{plan.unit}</span>
              </span>
            </li>
          ))}
        </ul>

        {subject.pricing.options.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {subject.pricing.options.map((option) => (
              <li key={option.name} className="rounded-2xl bg-lemon-100 p-4 ring-1 ring-lemon-300">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-round text-[15px] font-bold text-ink">{option.name}</span>
                  <span className="whitespace-nowrap font-round text-base font-bold text-ink">
                    {option.price}
                  </span>
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
                  {option.description}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mt-4 text-[11px] leading-relaxed text-ink-muted">{subject.pricing.note}</p>
      </section>

      {/* つまずきポイント */}
      <section className="bg-gradient-to-b from-lemon-50 to-sakura-50 px-5 py-10">
        <SectionTitle tone={subject.tone}>つまずきやすいポイント</SectionTitle>
        <ul className="mt-5 space-y-4">
          {subject.struggles.map((struggle) => (
            <li
              key={struggle.problem}
              className="overflow-hidden rounded-2xl bg-white shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100"
            >
              <div className="flex gap-3 p-4">
                <CircleHelp className="size-6 shrink-0 text-sakura-400" strokeWidth={2.5} />
                <p className="flex-1 font-round text-[15px] font-bold leading-snug text-ink">
                  {struggle.problem}
                </p>
              </div>
              <div className="flex gap-3 border-t border-sakura-100 bg-lemon-50 p-4">
                <Lightbulb className="size-6 shrink-0 text-lemon-600" strokeWidth={2.5} />
                <p className="flex-1 text-[13px] leading-relaxed text-ink-muted">
                  {struggle.solution}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* よくある質問。検索から来た人が最初に知りたいことに、ページ内で答える。
          開閉式にせず全文を出したままにして、検索エンジンにも確実に読ませる */}
      {faqItems.length > 0 ? (
        <section className="bg-white px-5 py-10">
          <SectionTitle tone={subject.tone}>よくある質問</SectionTitle>
          <dl className="mt-5 space-y-3">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="overflow-hidden rounded-2xl ring-1 ring-sakura-100"
              >
                <dt className="flex gap-2 bg-canvas p-4 font-round text-[14px] font-bold leading-snug text-ink">
                  <span className={`shrink-0 font-round ${accentTone[subject.tone]}`}>Q.</span>
                  {item.question}
                </dt>
                <dd className="flex gap-2 border-t border-sakura-100 bg-white p-4 text-[13px] leading-relaxed text-ink-muted">
                  <span className={`shrink-0 font-round font-bold ${accentTone[subject.tone]}`}>
                    A.
                  </span>
                  <span className="flex-1">{item.answer}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {/* 関連する検定。一緒に受ける人が多い検定へ行き来できるようにする */}
      {related.length > 0 ? (
        <section className="bg-canvas px-5 py-10">
          <SectionTitle tone={subject.tone}>一緒に受ける人が多い検定</SectionTitle>
          <ul className="mt-5 space-y-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/subjects/${item.slug}`}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100 transition active:translate-y-0.5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-round text-[15px] font-bold leading-snug text-ink">
                      {subjectSearchName(item)}
                    </span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-ink-muted">
                      {item.catchCopy}
                    </span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-sakura-400" strokeWidth={2.5} />
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-center">
            <Link
              href="/subjects"
              className="inline-flex items-center gap-1 text-[13px] font-bold text-ink-muted"
            >
              {subjectIndex.title}をすべて見る
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
          </p>
        </section>
      ) : null}

      {/* CTA */}
      <section className="bg-white px-5 py-12 text-center">
        <p className="font-round text-lg font-bold leading-relaxed text-ink">
          {subject.name}の対策、
          <br />
          まずは1時間の無料体験から。
        </p>
        <Link
          href={flow.ctaHref}
          className="mt-6 inline-flex items-center gap-6 rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-8 py-4 font-round text-base font-bold text-white shadow-lg shadow-sakura-600/30 transition active:translate-y-0.5"
        >
          {flow.ctaLabel}
          <ArrowRight className="size-5" strokeWidth={2.5} />
        </Link>
      </section>
    </main>
  );
}
