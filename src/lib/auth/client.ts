import { createBrowserClient } from "@supabase/ssr";

/**
 * ログインフォーム（クライアントコンポーネント）用の Supabase クライアント。
 * ログイン処理自体はブラウザ側で行い、成功すると Cookie にセッションが保存される。
 */
export function createAuthBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase の接続情報が設定されていません（.env.local を確認してください）");
  }

  return createBrowserClient(url, anonKey);
}
