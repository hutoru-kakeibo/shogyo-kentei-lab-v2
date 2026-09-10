import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * リクエストごとにログインセッション（Cookie）を更新する。
 * Supabase Auth の推奨パターン：セッションの有効期限が切れそうなときに
 * 自動で延長し、期限切れのまま管理画面を操作してしまうのを防ぐ。
 * src/proxy.ts から呼び出す。
 */
export async function refreshAuthSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase 未設定の環境では何もしない（他の Supabase クライアントと同じ方針）
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // セッションを読むこと自体が、必要なら Cookie を更新するトリガーになる
  await supabase.auth.getUser();

  return response;
}
