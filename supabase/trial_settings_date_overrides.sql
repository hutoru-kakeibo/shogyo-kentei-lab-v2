-- 無料体験の受付設定に「日ごとの受付時間」を追加する。
-- Supabase の管理画面 → SQL Editor に貼り付けて実行してください。
-- ※ trial_settings.sql を実行済みであることが前提です。何度実行しても問題ありません。

-- その日だけの受付時間。{"2026-09-20": ["10:00", "11:00"], ...}
-- ここに載っている日は、曜日ごとの受付時間より優先される（休講日はさらに優先）。
-- 空配列の日は、その日だけ受付なし。
alter table public.trial_settings
  add column if not exists date_overrides jsonb not null default '{}'::jsonb;
