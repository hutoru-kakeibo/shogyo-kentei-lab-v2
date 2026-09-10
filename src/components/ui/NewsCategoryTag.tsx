/** カテゴリタグの色分け。未知のカテゴリはグレー系で表示する */
const categoryClass: Record<string, string> = {
  お知らせ: "bg-sakura-100 text-sakura-600",
  講座情報: "bg-lemon-200 text-ink",
  合格実績: "bg-mint-100 text-mint-500",
};

const defaultCategoryClass = "bg-sky-100 text-sky-600";

export function NewsCategoryTag({ category }: { category: string }) {
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
