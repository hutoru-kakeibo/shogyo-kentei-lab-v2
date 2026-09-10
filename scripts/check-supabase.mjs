#!/usr/bin/env node
/**
 * Supabase につながっているか、news テーブルが読めるかを確認する。
 *
 *   npm run check:supabase
 *
 * 設定漏れやテーブル未作成を、開発サーバーを立ち上げる前に切り分けられるようにするためのもの。
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");

if (!existsSync(envPath)) {
  console.error("\n❌ .env.local が見つかりません。");
  console.error("   npm run setup:supabase -- <URL> <ANON_KEY> を先に実行してください。\n");
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

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error("\n❌ .env.local に接続情報が入っていません。");
  console.error("   npm run setup:supabase -- <URL> <ANON_KEY> を実行してください。\n");
  process.exit(1);
}

const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}` };
const endpoint = `${url}/rest/v1/news?select=id,published_at,category,title&is_published=eq.true&order=published_at.desc&limit=3`;

/** テーブルが存在するかだけ確認する（RLSで読めなくても、404でなければ存在する） */
async function checkTableExists(table) {
  const response = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, { headers });
  return response.status !== 404;
}

try {
  const response = await fetch(endpoint, { headers });

  if (response.status === 401 || response.status === 403) {
    console.error("\n❌ 認証に失敗しました。anon key が正しいか確認してください。\n");
    process.exit(1);
  }

  if (response.status === 404) {
    console.error("\n❌ news テーブルが見つかりません。");
    console.error("   Supabase の SQL Editor で supabase/news.sql を実行してください。\n");
    process.exit(1);
  }

  if (!response.ok) {
    console.error(`\n❌ 取得に失敗しました（HTTP ${response.status}）`);
    console.error(`   ${await response.text()}\n`);
    process.exit(1);
  }

  const rows = await response.json();
  console.log(`\n✅ 接続できました。公開中の新着情報は ${rows.length} 件です。\n`);
  for (const row of rows) {
    console.log(`   ${row.published_at}  [${row.category}]  ${row.title}`);
  }

  const hasTrialTable = await checkTableExists("trial_applications");
  console.log(
    hasTrialTable
      ? "\n✅ trial_applications テーブルもあります（無料体験の申し込みを保存できます）\n"
      : "\n⚠️  trial_applications テーブルがありません。" +
          "\n   Supabase の SQL Editor で supabase/trial_applications.sql を実行してください。\n",
  );
} catch (error) {
  console.error("\n❌ 接続できませんでした。URL が正しいか、ネットワークを確認してください。");
  console.error(`   ${error.message}\n`);
  process.exit(1);
}
