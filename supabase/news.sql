-- 新着情報テーブル
-- Supabase の管理画面 → SQL Editor に貼り付けて実行してください。

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  published_at date not null default current_date,
  category text not null,
  title text not null,
  -- 下書きを非公開にしておくためのフラグ
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 公開日の新しい順に取り出すので、その順序で索引を張っておく
create index if not exists news_published_at_idx
  on public.news (published_at desc);

-- 行単位のアクセス制御を有効化
alter table public.news enable row level security;

-- 公開済みの記事だけ、誰でも読み取れるようにする（書き込みは管理画面から行う）
drop policy if exists "公開済みの新着情報は誰でも閲覧できる" on public.news;
create policy "公開済みの新着情報は誰でも閲覧できる"
  on public.news
  for select
  using (is_published = true);

-- 動作確認用のサンプルデータ
insert into public.news (published_at, category, title) values
  ('2026-09-05', '講座情報', '第100回 全商簿記実務検定1級 直前対策講座の受付を開始しました'),
  ('2026-08-28', '合格実績', '2026年度 第1回検定の合格実績を公開しました'),
  ('2026-08-20', 'お知らせ', '夏季休講期間（8/11〜8/16）の質問対応について');
