/** コラムのカテゴリタグ。未知のカテゴリはイエローで表示する */
const categoryClass: Record<string, string> = {
  勉強法: "bg-sakura-100 text-sakura-600",
  検定情報: "bg-sky-100 text-sky-600",
  "進路・就職": "bg-mint-100 text-mint-500",
};

const defaultCategoryClass = "bg-lemon-200 text-ink";

export function ArticleCategoryTag({ category }: { category: string }) {
  return (
    <span
      className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${
        categoryClass[category] ?? defaultCategoryClass
      }`}
    >
      {category}
    </span>
  );
}
