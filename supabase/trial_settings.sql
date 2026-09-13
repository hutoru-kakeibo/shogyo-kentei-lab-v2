-- 無料体験の受付設定（受付開始・受付期間・曜日ごとの受付時間・休講日）
-- Supabase の管理画面 → SQL Editor に貼り付けて実行してください。
-- ※ admin.sql（is_admin 関数）を実行済みであることが前提です。

create table if not exists public.trial_settings (
  -- 設定は常に1行だけ持つ
  id smallint primary key default 1 check (id = 1),
  -- 何日後から受け付けるか（0 = 当日から）
  lead_days integer not null check (lead_days between 0 and 60),
  -- 今日から何日先まで受け付けるか
  range_days integer not null check (range_days between 1 and 365),
  -- 曜日ごとの受付時間。{"0": ["10:00", ...], ..., "6": [...]}（0=日曜 … 6=土曜）
  slots_by_weekday jsonb not null,
  -- 受付を止める日。["2026-12-31", ...]
  closed_dates jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint trial_settings_lead_within_range check (lead_days <= range_days)
);

alter table public.trial_settings enable row level security;

-- 申し込みフォームのカレンダーに使うため、誰でも読み取れる（個人情報は含まない）
drop policy if exists "誰でも受付設定を閲覧できる" on public.trial_settings;
create policy "誰でも受付設定を閲覧できる"
  on public.trial_settings
  for select
  to anon, authenticated
  using (true);

-- 変更できるのは管理者だけ
drop policy if exists "管理者は受付設定を更新できる" on public.trial_settings;
create policy "管理者は受付設定を更新できる"
  on public.trial_settings
  for update
  to authenticated
  using (is_admin())
  with check (is_admin());

-- これまでコードに書いていた設定を初期値として登録する（すでに行があれば何もしない）
insert into public.trial_settings (id, lead_days, range_days, slots_by_weekday, closed_dates)
values (
  1,
  2,
  45,
  '{
    "0": ["10:00", "11:00", "13:00", "14:00", "15:00"],
    "1": ["17:00", "18:00", "19:00", "20:00", "21:00"],
    "2": ["17:00", "18:00", "19:00", "20:00", "21:00"],
    "3": ["17:00", "18:00", "19:00", "20:00", "21:00"],
    "4": ["17:00", "18:00", "19:00", "20:00", "21:00"],
    "5": ["17:00", "18:00", "19:00", "20:00", "21:00"],
    "6": ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
  }'::jsonb,
  '[]'::jsonb
)
on conflict (id) do nothing;
