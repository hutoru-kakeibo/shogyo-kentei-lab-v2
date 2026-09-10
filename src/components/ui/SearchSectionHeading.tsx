import { Search } from "lucide-react";

type Props = {
  title: string;
  englishTitle: string;
  /** 見出しブロックの背景グラデーション */
  gradient: string;
};

/**
 * 「検定を探す」「受講エリア」で共通の見出し。
 * 参考サイトと同じく、白い丸の虫めがねアイコン → 大きな見出し → 英字サブタイトルの順。
 */
export function SearchSectionHeading({ title, englishTitle, gradient }: Props) {
  return (
    <div className={`px-6 pb-16 pt-12 text-center ${gradient}`}>
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-white shadow-md shadow-sakura-600/15">
        <Search className="size-8 text-sakura-500" strokeWidth={2.5} />
      </span>
      <h2 className="mt-4 font-round text-3xl font-bold tracking-tight text-ink">{title}</h2>
      <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
        {englishTitle}
      </p>
    </div>
  );
}
