-- 合格体験記（合格者の声）テーブル。
-- Supabase の管理画面 → SQL Editor に貼り付けて実行してください。

create table if not exists public.voices (
  id uuid primary key default gen_random_uuid(),
  grade_label text not null,
  bio text not null,
  name text not null,
  -- カード全体の色（トップページの sakura/lemon/sky/mint のパステル4色と対応）
  tone text not null default 'sakura',
  -- public/images 配下の相対パス、または Supabase Storage の公開URL。未設定なら null
  photo text,
  total_hours text not null,
  mock_best_score text not null,
  total_days text not null,
  mock_count text not null,
  recommend_point text not null,
  created_at timestamptz not null default now()
);

create index if not exists voices_created_at_idx on public.voices (created_at desc);

alter table public.voices enable row level security;

-- 合格者の声はサイトの公開コンテンツなので、誰でも閲覧できる
drop policy if exists "誰でも合格体験記を閲覧できる" on public.voices;
create policy "誰でも合格体験記を閲覧できる"
  on public.voices
  for select
  to anon, authenticated
  using (true);

-- 追加・削除は管理者だけ（Step 3 の要件は追加・削除のみのため、更新ポリシーは設けていない）
drop policy if exists "管理者は合格体験記を追加できる" on public.voices;
create policy "管理者は合格体験記を追加できる"
  on public.voices
  for insert
  to authenticated
  with check (is_admin());

drop policy if exists "管理者は合格体験記を削除できる" on public.voices;
create policy "管理者は合格体験記を削除できる"
  on public.voices
  for delete
  to authenticated
  using (is_admin());

-- これまで content.ts に仮データとして置いていた1件をDBへ移行する
-- （既にDBに同名データが入っている可能性があるため、まだ1件も無いときだけ挿入する）
insert into public.voices
  (grade_label, bio, name, tone, photo, total_hours, mock_best_score, total_days, mock_count, recommend_point)
select
  '日商簿記2級合格！', '生徒会副会長をやりながら', 'Mさん', 'sakura', '/images/voice-m.jpg',
  '90h', '64点', '70日', '15回',
  'なんど同じ問題で間違えてもわかるまで何度も教えてくれるところが良かった'
where not exists (select 1 from public.voices);

-- ============================================================
-- 写真アップロード用のストレージバケット。
-- 管理画面から新しい合格体験記を追加するときに、写真をここへアップロードする。
-- ============================================================
insert into storage.buckets (id, name, public)
values ('voice-photos', 'voice-photos', true)
on conflict (id) do nothing;

drop policy if exists "誰でも合格体験記の写真を閲覧できる" on storage.objects;
create policy "誰でも合格体験記の写真を閲覧できる"
  on storage.objects
  for select
  using (bucket_id = 'voice-photos');

drop policy if exists "管理者は合格体験記の写真をアップロードできる" on storage.objects;
create policy "管理者は合格体験記の写真をアップロードできる"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'voice-photos' and is_admin());

drop policy if exists "管理者は合格体験記の写真を削除できる" on storage.objects;
create policy "管理者は合格体験記の写真を削除できる"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'voice-photos' and is_admin());
