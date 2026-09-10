-- 無料体験の申し込みテーブル
-- Supabase の管理画面 → SQL Editor に貼り付けて実行してください。

create table if not exists public.trial_applications (
  id uuid primary key default gen_random_uuid(),
  -- 申し込み内容
  subject text not null,
  target_grade text not null,
  name text not null,
  kana text,
  grade_year text not null,
  school text not null,
  email text not null,
  tel text,
  preferred_date date not null,
  preferred_time text not null,
  message text,
  consent boolean not null,
  -- 対応状況の管理用（new: 未対応 / contacted: 連絡済み / done: 完了 / canceled: 取消）
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- 新しい申し込みから順に見るので、その順序で索引を張っておく
create index if not exists trial_applications_created_at_idx
  on public.trial_applications (created_at desc);

-- 行単位のアクセス制御を有効化
alter table public.trial_applications enable row level security;

-- 申し込みの「書き込み」だけを誰にでも許可する。
-- 読み取りポリシーは作らないため、匿名キーでは他人の申し込みを一切閲覧できない
-- （管理者は Supabase の管理画面から確認する）。
drop policy if exists "誰でも無料体験を申し込める" on public.trial_applications;
create policy "誰でも無料体験を申し込める"
  on public.trial_applications
  for insert
  to anon, authenticated
  with check (consent = true);

-- 同じ日時への重複予約を防ぐ一意制約。
-- status が 'canceled' の申し込みは枠を占有しないので対象外にする
-- （キャンセルされた枠は、同じ日時で別の人が申し込めるようにするため）。
-- アプリ側（サーバーアクション）の事前チェックだけでは、ほぼ同時に２人が送信した場合に
-- 両方通ってしまう可能性があるため、最終的な防波堤としてDB側にも制約をかけている。
create unique index if not exists trial_applications_active_slot_idx
  on public.trial_applications (preferred_date, preferred_time)
  where status <> 'canceled';

-- 埋まっている日時だけを、氏名・連絡先などの個人情報を含めずに返す関数。
-- trial_applications テーブル自体には読み取りポリシーを設けていないため、
-- カレンダー表示のために個人情報ごと読み取り可能にしてしまうことを避け、
-- この関数（SECURITY DEFINER）経由でだけ「空いているかどうか」を公開する。
create or replace function public.trial_taken_slots(p_from date, p_to date)
returns table (preferred_date date, preferred_time text)
language sql
security definer
set search_path = public
stable
as $$
  select preferred_date, preferred_time
  from public.trial_applications
  where status <> 'canceled'
    and preferred_date between p_from and p_to;
$$;

grant execute on function public.trial_taken_slots(date, date) to anon, authenticated;
