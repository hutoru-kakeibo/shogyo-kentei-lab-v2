-- コラム（勉強法などの記事）テーブル
-- Supabase の管理画面 → SQL Editor に貼り付けて実行してください。
-- ※ admin.sql（is_admin 関数）を実行済みであることが前提です。

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  -- URL（/columns/xxx）に使う文字列。検索エンジンに登録された後は変えない前提
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  -- 検索結果の説明文（meta description）と、一覧の抜粋に使う
  description text not null,
  category text not null,
  -- 記号（## 見出し など）で書いた本文。表示時に src/lib/article-body.ts で変換する
  body text not null,
  published_at date not null default current_date,
  -- 長い記事を書きかけで保存できるよう、既定は下書き
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_published_at_idx
  on public.articles (published_at desc);

alter table public.articles enable row level security;

-- 公開済みのコラムだけ、誰でも読み取れるようにする
drop policy if exists "公開済みのコラムは誰でも閲覧できる" on public.articles;
create policy "公開済みのコラムは誰でも閲覧できる"
  on public.articles
  for select
  using (is_published = true);

-- 管理者は下書きを含むすべてのコラムを読み書きできる
drop policy if exists "管理者はコラムをすべて操作できる" on public.articles;
create policy "管理者はコラムをすべて操作できる"
  on public.articles
  for all
  to authenticated
  using (is_admin())
  with check (is_admin());
