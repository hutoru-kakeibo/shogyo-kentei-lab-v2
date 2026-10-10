-- 実用英検の検定ページに料金を入れる（1時間あたり）。
-- 準2級 3,400円／準2級プラス 3,400円／2級 3,900円
-- Supabase の管理画面 → SQL Editor に貼り付けて実行してください。

update public.subjects
set pricing_plans = '[
  {"grade": "準2級", "price": "3,400", "unit": "円 / 1時間"},
  {"grade": "準2級プラス", "price": "3,400", "unit": "円 / 1時間"},
  {"grade": "2級", "price": "3,900", "unit": "円 / 1時間"}
]'::jsonb
where slug = 'eiken'
returning slug, pricing_plans;
