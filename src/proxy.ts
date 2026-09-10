import type { NextRequest } from "next/server";
import { refreshAuthSession } from "@/lib/auth/proxy-session";

/**
 * 管理画面（/admin 以下）に入る前にログインセッションを更新する。
 * Next.js 16 では middleware.ts は proxy.ts に名称変更されている
 * （エクスポート名も middleware → proxy）。
 */
export async function proxy(request: NextRequest) {
  return refreshAuthSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
