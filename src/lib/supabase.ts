import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase クライアント。
 *
 * 環境変数（.env.local）が設定されていないときは null を返し、
 * 呼び出し側がモックデータにフォールバックできるようにしている。
 * これにより、Supabase を用意していない環境でもサイトはそのまま動く。
 *
 * 必要な環境変数（.env.local.example を参照）:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;

  client ??= createClient(url, anonKey, {
    auth: { persistSession: false },
  });

  return client;
}
