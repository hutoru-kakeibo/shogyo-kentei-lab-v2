-- 申し込みに「種別」（無料体験 / 授業）を追加する。
-- Supabase の管理画面 → SQL Editor に貼り付けて実行してください。何度実行しても問題ありません。
--
-- 既存の申し込みはすべて無料体験（trial）として扱われる。
-- 同じ日時への重複予約を防ぐ一意制約（trial_applications_active_slot_idx）は種別を区別しないため、
-- 無料体験と授業は同じ受付枠を共有する（先に入った方がその枠を使う）。

alter table public.trial_applications
  add column if not exists kind text not null default 'trial';

alter table public.trial_applications
  drop constraint if exists trial_applications_kind_check;

alter table public.trial_applications
  add constraint trial_applications_kind_check check (kind in ('trial', 'lesson'));
