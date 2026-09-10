#!/usr/bin/env node
/**
 * Gmail の送信設定を .env.local に書き込む。
 *
 *   npm run setup:gmail -- <Gmailアドレス> <アプリパスワード> [通知先アドレス]
 *
 * アプリパスワードは Google アカウント → セキュリティ → 2段階認証プロセス →
 * アプリ パスワード から発行できる16桁の文字列（通常のログインパスワードではない）。
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const [address, rawPassword, notify] = process.argv.slice(2);
const envPath = resolve(process.cwd(), ".env.local");

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  console.error("使い方:");
  console.error("  npm run setup:gmail -- you@gmail.com abcdefghijklmnop [通知先アドレス]\n");
  process.exit(1);
}

if (!address || !rawPassword) {
  fail("Gmailアドレスとアプリパスワードを指定してください。");
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
  fail(`メールアドレスの形式が正しくありません: ${address}`);
}

// 表示上スペースが入ることがあるので取り除く
const password = rawPassword.replaceAll(/\s/g, "");

if (password.length !== 16) {
  fail(
    `アプリパスワードは16桁です（入力は${password.length}桁）。\n` +
      "   Googleアカウントのログインパスワードではなく、アプリパスワードを指定してください。",
  );
}

if (notify && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notify)) {
  fail(`通知先アドレスの形式が正しくありません: ${notify}`);
}

// 既存の .env.local から、Gmail以外の設定（Supabaseなど）を残す
const others = existsSync(envPath)
  ? readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .filter(
        (line) =>
          line.trim() &&
          !line.startsWith("GMAIL_") &&
          !line.startsWith("NOTIFY_EMAIL") &&
          !line.startsWith("# Gmail"),
      )
  : [];

const contents = [
  ...others,
  "",
  "# Gmail の送信設定（npm run setup:gmail で生成）",
  `GMAIL_USER=${address}`,
  `GMAIL_APP_PASSWORD=${password}`,
  `NOTIFY_EMAIL=${notify || address}`,
  "",
].join("\n");

writeFileSync(envPath, contents, "utf8");

console.log("\n✅ .env.local にメール設定を保存しました。\n");
console.log("次の手順:");
console.log("  1. npm run check:mail  … テストメールを送って確認");
console.log("  2. 開発サーバーを再起動\n");
