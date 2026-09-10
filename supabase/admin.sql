-- 管理者認証の基盤。
-- Supabase の管理画面 → SQL Editor に貼り付けて実行してください。
--
-- 管理者アカウント自体（メール・パスワード）は、この SQL では作成しません。
-- Supabase の管理画面 → Authentication → Users → Add user から、
-- 手動で作成してください（後述の手順を参照）。

-- 管理者として許可するメールアドレスの一覧。
-- ここに載っているメールアドレスで Supabase Auth にログインした人だけが、
-- 管理画面からデータを読み書きできるようになる。
create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- admins テーブル自体は誰も直接読めないようにする（is_admin() 関数経由でのみ判定に使う）

-- いまログインしている人が管理者かどうかを判定する関数。
-- SECURITY DEFINER にすることで、admins テーブルに読み取りポリシーが無くても判定できる
-- （＝ admins テーブルの中身そのものは、この関数を経由しない限り誰にも見えない）。
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins where email = auth.email()
  );
$$;

-- 最初の管理者を登録する。他のスタッフを管理者にしたい場合は、
-- Supabase の管理画面 → Table Editor → admins から行を追加すればよい。
insert into public.admins (email) values ('morita.tomonobu15@gmail.com')
on conflict (email) do nothing;

-- ============================================================
-- news テーブル：管理者はすべての記事を読み書きできるようにする
-- （公開済みの記事を誰でも読めるポリシーは news.sql ですでに設定済み）
-- ============================================================
drop policy if exists "管理者は新着情報をすべて操作できる" on public.news;
create policy "管理者は新着情報をすべて操作できる"
  on public.news
  for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- ============================================================
-- trial_applications テーブル：管理者は申し込みの閲覧・対応状況の更新ができる
-- （申し込みの insert は誰でもできるポリシーが trial_applications.sql ですでに設定済み。
-- 　閲覧・更新ポリシーはこれまで存在しなかった＝誰も読めなかったので、ここで追加する）
-- ============================================================
drop policy if exists "管理者は申し込みを閲覧できる" on public.trial_applications;
create policy "管理者は申し込みを閲覧できる"
  on public.trial_applications
  for select
  to authenticated
  using (is_admin());

drop policy if exists "管理者は申し込みの対応状況を更新できる" on public.trial_applications;
create policy "管理者は申し込みの対応状況を更新できる"
  on public.trial_applications
  for update
  to authenticated
  using (is_admin())
  with check (is_admin());
