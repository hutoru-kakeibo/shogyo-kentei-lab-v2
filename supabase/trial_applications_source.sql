-- 申し込みに「知ったきっかけ」と「どこから来たか（流入元）」を追加する。
-- Supabase の管理画面 → SQL Editor に貼り付けて実行してください。何度実行しても問題ありません。
--
-- heard_from  … フォームで選んでもらう「商業検定ラボを知ったきっかけ」（任意。選択肢は content.ts の trialForm.heardFrom）
-- first_touch … そのブラウザで初めてサイトに来たときの流入元
-- last_touch  … 申し込んだときにいちばん最近、外から来たときの流入元
--   どちらも { source, medium, campaign, referrer, landing, at } の形（utm の値・参照元のドメイン・最初に開いたページのパス・日時）。
--   氏名などの個人情報は含まない。
--
-- 実行する前でも申し込みは止まらない（保存できないときは、これらを外して保存し直す。src/lib/trial-actions.ts）。

alter table public.trial_applications
  add column if not exists heard_from text,
  add column if not exists first_touch jsonb,
  add column if not exists last_touch jsonb;
