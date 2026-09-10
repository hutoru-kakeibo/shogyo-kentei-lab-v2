#!/usr/bin/env node
/**
 * Supabase の接続情報を .env.local に書き込む。
 *
 *   npm run setup:supabase -- <SUPABASE_URL> <ANON_KEY>
 *
 * 手で .env.local を作らなくて済むように、値の形式チェックと書き込みをまとめて行う。
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const [url, anonKey] = process.argv.slice(2);
const envPath = resolve(process.cwd(), ".env.local");

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  console.error("使い方:");
  console.error("  npm run setup:supabase -- https://xxxx.supabase.co eyJhbGciOi...\n");
  process.exit(1);
}

if (!url || !anonKey) {
  fail("SupabaseのURLとanon keyを指定してください。");
}

if (!/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/i.test(url)) {
  fail(`URLの形式が正しくありません: ${url}\n   例: https://abcdefghijklmnop.supabase.co`);
}

if (anonKey.length < 30) {
  fail("anon key が短すぎます。値をすべて貼り付けているか確認してください。");
}

// 既存の .env.local があれば、Supabase以外の設定は残したまま書き換える
const others = existsSync(envPath)
  ? readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.startsWith("NEXT_PUBLIC_SUPABASE_"))
  : [];

const contents = [
  "# Supabase の接続情報（npm run setup:supabase で生成）",
  `NEXT_PUBLIC_SUPABASE_URL=${url}`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`,
  ...others,
  "",
].join("\n");

writeFileSync(envPath, contents, "utf8");

console.log("\n✅ .env.local に接続情報を保存しました。\n");
console.log("次の手順:");
console.log("  1. Supabase の SQL Editor で supabase/news.sql を実行（まだの場合）");
console.log("  2. npm run check:supabase  … 接続できているか確認");
console.log("  3. 開発サーバーを再起動\n");
