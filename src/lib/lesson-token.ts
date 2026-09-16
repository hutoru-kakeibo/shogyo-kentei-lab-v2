import { timingSafeEqual } from "node:crypto";

/**
 * 既存生徒用「授業のお申し込み」ページ（/lesson/<token>）の秘密のトークンが正しいか。
 * トークンは公開リポジトリに置かないよう、環境変数 LESSON_FORM_TOKEN にだけ保存している。
 * サーバー側（ページ・申し込み処理）でだけ使う。
 */
export function isValidLessonToken(token: string) {
  const expected = process.env.LESSON_FORM_TOKEN;
  if (!expected || !token) return false;

  const given = Buffer.from(token);
  const secret = Buffer.from(expected);
  return given.length === secret.length && timingSafeEqual(given, secret);
}
