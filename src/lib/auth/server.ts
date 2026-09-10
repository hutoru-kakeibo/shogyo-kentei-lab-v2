import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * 管理画面（Server Components / Server Actions）用の、Cookie経由でログイン状態を
 * 保持する Supabase クライアント。
 *
 * src/lib/supabase.ts のクライアント（匿名・ログイン状態を持たない）とは別物。
 * こちらはログイン中の管理者として振る舞うため、admins テーブルに登録された
 * メールアドレスでログインしていれば、RLS 側で管理者専用の読み書きが許可される。
 *
 * 環境変数が未設定の場合は null を返す（他の Supabase クライアントと同じ方針）。
 */
export async function createAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component からは Cookie を書き換えられない（読み取り専用のため例外になる）。
          // セッションの更新自体は proxy.ts 側で毎リクエスト行っているので、ここは無視してよい。
        }
      },
    },
  });
}

/** いまログインしているユーザーが管理者かどうかを判定する（未ログイン・未設定なら false） */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createAuthClient();
  if (!supabase) return false;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;

  const { data, error } = await supabase.rpc("is_admin");
  if (error) {
    console.error("[auth] is_admin の判定に失敗しました:", error.message);
    return false;
  }

  return Boolean(data);
}
