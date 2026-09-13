-- 検定ページ3科目（日商簿記検定・商業経済検定・財務諸表分析検定）の仕上げ修正。
-- Supabase の管理画面 → SQL Editor に貼り付けて実行してください。
-- 試験情報は以下の公式情報で確認済みの内容だけを反映している（2026年9月時点）。
--   日商簿記：kentei.ne.jp（統一試験 2・3級は6月・11月・2月の年3回、1級は6月・11月の年2回、2・3級はネット試験あり）
--   商業経済検定：zensho.or.jp スケジュール（年1回・2月）
--   財務諸表分析検定：zensho.or.jp スケジュール（年1回・12月）。合格基準は公式の記載を確認できなかったため行ごと削除

-- 日商簿記検定：【要確認】を外し、料金の単位に「円」を戻す
update public.subjects
set
  basics = replace(basics::text, '【要確認】', '')::jsonb,
  pricing_plans = (
    select jsonb_agg(plan || jsonb_build_object('unit', '円 / 1時間') order by ord)
    from jsonb_array_elements(pricing_plans) with ordinality as t(plan, ord)
  ),
  updated_at = now()
where slug = 'nissho-boki';

-- 商業経済検定：説明文の作業メモを削除、実施回数を確定、料金の単位に「円」を戻す
update public.subjects
set
  overview = replace(overview, '【要確認】級ごとの出題科目を最新の実施要項に合わせて追記してください。', ''),
  basics = (
    select jsonb_agg(
      case when item->>'label' = '実施回数'
        then jsonb_build_object('label', '実施回数', 'value', '年1回（2月）')
        else item
      end
      order by ord
    )
    from jsonb_array_elements(basics) with ordinality as t(item, ord)
  ),
  pricing_plans = (
    select jsonb_agg(plan || jsonb_build_object('unit', '円 / 1時間') order by ord)
    from jsonb_array_elements(pricing_plans) with ordinality as t(plan, ord)
  ),
  updated_at = now()
where slug = 'shogyo-keizai';

-- 財務諸表分析検定：実施回数を確定し、確認できなかった合格基準の行を削除
update public.subjects
set
  basics = (
    select jsonb_agg(
      case when item->>'label' = '実施回数'
        then jsonb_build_object('label', '実施回数', 'value', '年1回（12月）')
        else item
      end
      order by ord
    )
    from jsonb_array_elements(basics) with ordinality as t(item, ord)
    where item->>'label' <> '合格基準'
  ),
  updated_at = now()
where slug = 'zaimu-shohyo-bunseki';

-- 確認用：3科目に仮テキストが残っていなければ、remaining_placeholders がすべて false になる
select
  slug,
  (overview || basics::text || pricing_plans::text || training::text || struggles::text) ~ '要確認|要入力' as remaining_placeholders,
  basics,
  pricing_plans
from public.subjects
where slug in ('nissho-boki', 'shogyo-keizai', 'zaimu-shohyo-bunseki')
order by slug;
