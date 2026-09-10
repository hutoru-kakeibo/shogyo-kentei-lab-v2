#!/usr/bin/env node
/**
 * Gmail の送信設定が正しいかを、実際にテストメールを送って確認する。
 *
 *   npm run check:mail
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import nodemailer from "nodemailer";

const envPath = resolve(process.cwd(), ".env.local");

if (!existsSync(envPath)) {
  console.error("\n❌ .env.local が見つかりません。");
  console.error("   npm run setup:gmail -- <アドレス> <アプリパスワード> を先に実行してください。\n");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
);

const user = env.GMAIL_USER;
const pass = env.GMAIL_APP_PASSWORD;
const to = env.NOTIFY_EMAIL || user;

if (!user || !pass) {
  console.error("\n❌ .env.local にメール設定が入っていません。");
  console.error("   npm run setup:gmail -- <アドレス> <アプリパスワード> を実行してください。\n");
  process.exit(1);
}

const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });

try {
  await transporter.verify();
  console.log("\n✅ Gmail に接続できました。テストメールを送ります…");

  await transporter.sendMail({
    from: `商業検定ラボ <${user}>`,
    to,
    subject: "【テスト】商業検定ラボ メール送信の確認",
    text: `このメールが届いていれば、無料体験フォームの自動返信・通知メールが正しく送れる状態です。

送信元: ${user}
通知先: ${to}
`,
  });

  console.log(`✅ ${to} にテストメールを送信しました。受信箱を確認してください。\n`);
} catch (error) {
  console.error("\n❌ 送信できませんでした。");
  console.error(`   ${error.message}`);
  console.error(
    "\n   よくある原因:\n" +
      "   ・通常のログインパスワードを設定している（アプリパスワードが必要です）\n" +
      "   ・2段階認証プロセスが有効になっていない\n" +
      "   ・アプリパスワードの桁数が足りない\n",
  );
  process.exit(1);
}
