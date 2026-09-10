import nodemailer, { type Transporter } from "nodemailer";

/**
 * Gmail 経由のメール送信。
 *
 * 環境変数が未設定のときは送信を行わず false を返すため、
 * メールを設定していない環境でもフォームはそのまま動く。
 *
 * 必要な環境変数（npm run setup:gmail で設定できる）:
 *   GMAIL_USER          … 送信元のGmailアドレス
 *   GMAIL_APP_PASSWORD  … Googleアカウントで発行したアプリパスワード（16桁）
 *   NOTIFY_EMAIL        … 申し込み通知の宛先（未設定なら GMAIL_USER と同じ）
 */
const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;

export const isMailConfigured = Boolean(user && pass);
export const notifyTo = process.env.NOTIFY_EMAIL || user || "";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!user || !pass) return null;

  transporter ??= nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return transporter;
}

type MailInput = {
  to: string;
  subject: string;
  text: string;
  /** 差出人に表示する名前 */
  fromName?: string;
  /** 受信者が返信したときの宛先 */
  replyTo?: string;
};

/**
 * メールを送る。送信できたかどうかを boolean で返す。
 * 例外は投げないので、呼び出し側の処理を止めることはない。
 */
export async function sendMail({
  to,
  subject,
  text,
  fromName = "商業検定ラボ",
  replyTo,
}: MailInput): Promise<boolean> {
  const client = getTransporter();

  if (!client) {
    console.warn("[mail] 送信設定が無いため、メールを送信しませんでした:", subject);
    return false;
  }

  try {
    await client.sendMail({
      from: `${fromName} <${user}>`,
      to,
      subject,
      text,
      replyTo,
    });
    return true;
  } catch (error) {
    console.error("[mail] 送信に失敗しました:", error instanceof Error ? error.message : error);
    return false;
  }
}
