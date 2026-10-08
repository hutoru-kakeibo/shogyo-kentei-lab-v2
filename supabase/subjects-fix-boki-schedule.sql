-- 簿記実務検定の基本情報「実施回数」を、令和8年度の公式要項に合わせて直す。
-- 旧：年2回（1月・6月）
-- 新：1・2級 年2回（6月・1月）／3級 年4回（CBT）
-- 出典：全国商業高等学校協会「令和8年度 簿記実務検定試験要項」
--
-- Supabase の管理画面 → SQL Editor に貼り付けて実行してください。
-- 「実施回数」の行だけを書き換え、ほかの基本情報と並び順はそのまま残します。

update public.subjects
set basics = (
  select jsonb_agg(
    case
      when item ->> 'label' = '実施回数'
        then jsonb_build_object('label', '実施回数', 'value', '1・2級 年2回（6月・1月）／3級 年4回（CBT）')
      else item
    end
    order by position
  )
  from jsonb_array_elements(basics) with ordinality as rows(item, position)
)
where slug = 'zensho-boki'
returning slug, basics;
