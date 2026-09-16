import { siteMeta } from "@/lib/content";
import { notifyTo, sendMail } from "@/lib/mailer";
import type { TrialApplicationInput } from "@/lib/trial-actions";

/**
 * 無料体験・授業の申し込みに関するメール本文。
 * 文面を直すときはこのファイルを編集する。
 */

const weekdayNames = ["日", "月", "火", "水", "木", "金", "土"];

/** 2026-09-12 → 2026年9月12日（土） */
function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const weekday = weekdayNames[new Date(year, month - 1, day).getDay()];
  return `${year}年${month}月${day}日（${weekday}）`;
}

function isLesson(input: TrialApplicationInput) {
  return input.kind === "lesson";
}

/** 申し込み内容の一覧（両方のメールで使う） */
function summary(input: TrialApplicationInput) {
  const lesson = isLesson(input);
  return [
    `${lesson ? "受講する検定" : "受けたい検定"} : ${input.subject}`,
    `受験予定の級 : ${input.targetGrade}`,
    `希望日時     : ${formatDate(input.preferredDate)} ${input.preferredTime}`,
    `お名前       : ${input.name}${input.kana ? `（${input.kana}）` : ""}`,
    `学年         : ${input.gradeYear}`,
    `学校名       : ${input.school}`,
    `メール       : ${input.email}`,
    `電話番号     : ${input.tel || "（未記入）"}`,
    lesson ? "先生に伝えたいこと:" : "相談したいこと:",
    input.message ? input.message : "（未記入）",
  ].join("\n");
}

/** 申込者へ送る自動返信 */
async function sendApplicantMail(input: TrialApplicationInput) {
  const lesson = isLesson(input);
  const opening = lesson
    ? `${siteMeta.name}の授業にお申し込みいただき、ありがとうございます。`
    : `このたびは${siteMeta.name}の無料体験にお申し込みいただき、ありがとうございます。`;
  const nextStep = lesson
    ? "担当者が内容を確認のうえ、このメールアドレスへ授業の日時確定をご連絡します。"
    : "担当者が内容を確認のうえ、3日以内にこのメールアドレスへご連絡します。\n日程の調整もそのときに行いますので、少しお待ちください。";

  const text = `${input.name} 様

${opening}
以下の内容でお申し込みを受け付けました。

------------------------------------
${summary(input)}
------------------------------------

${nextStep}

ご不明な点があれば、このメールにそのままご返信ください。

※ このメールにお心当たりがない場合は、破棄してくださいますようお願いします。

--
${siteMeta.name}（${siteMeta.tagline}）
${siteMeta.url}
`;

  return sendMail({
    to: input.email,
    subject: lesson
      ? `【${siteMeta.name}】授業のお申し込みを受け付けました`
      : `【${siteMeta.name}】無料体験のお申し込みを受け付けました`,
    text,
  });
}

/** 塾側へ送る通知 */
async function sendOwnerMail(input: TrialApplicationInput) {
  const lesson = isLesson(input);
  const text = `${lesson ? "授業の申し込み（既存生徒）" : "無料体験の申し込み"}が入りました。

------------------------------------
${summary(input)}
------------------------------------

申し込み一覧は、管理画面の「申し込み（無料体験・授業）」で確認できます。
このメールに返信すると、申込者に直接返信できます。
`;

  return sendMail({
    to: notifyTo,
    subject: `【${lesson ? "授業申込" : "体験申込"}】${input.name}さん / ${input.subject} ${input.targetGrade} / ${formatDate(input.preferredDate)} ${input.preferredTime}`,
    text,
    // 通知メールにそのまま返信すれば申込者へ届くようにする
    replyTo: input.email,
  });
}

/**
 * 申込者への自動返信と、塾への通知をまとめて送る。
 * どちらかが失敗しても申し込み自体は成立しているため、例外は投げない。
 */
export async function sendTrialMails(input: TrialApplicationInput) {
  const [applicant, owner] = await Promise.all([
    sendApplicantMail(input),
    sendOwnerMail(input),
  ]);

  if (!applicant) console.error("[trial] 申込者への自動返信を送れませんでした:", input.email);
  if (!owner) console.error("[trial] 塾への通知メールを送れませんでした");

  return { applicant, owner };
}
