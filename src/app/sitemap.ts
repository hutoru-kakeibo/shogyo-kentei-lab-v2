import type { MetadataRoute } from "next";
import { siteMeta } from "@/lib/content";
import { subjects } from "@/lib/subjects";
import { getArticleSummaries } from "@/lib/articles";
import { isSubjectPublished } from "@/lib/seo";

// アクセスのたびにその場で作る。
// 以前は revalidate = 3600（1時間ごとに作り直す）にしていたが、実際にはデプロイ時にしか
// 作り直されず、SQLや管理画面で追加したコラムが何日も載らなかった。
// 中身は小さく、読みに来るのも検索エンジンくらいなので、毎回作っても負担はない
export const dynamic = "force-dynamic";

/**
 * 検索エンジンに知らせるURL一覧（/sitemap.xml）。
 * 管理画面とログイン、準備中の検定ページは載せない。
 *
 * 更新日（lastModified）は、本当に分かるもの（コラムの更新日時）にだけ付ける。
 * 固定ページに毎回「今」を入れると、日付があてにならないと判断されて無視されるため
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticleSummaries(1000);
  const latestArticleUpdate = articles.reduce<Date | null>((latest, article) => {
    const updated = new Date(article.updatedAt);
    return !latest || updated > latest ? updated : latest;
  }, null);

  return [
    { url: siteMeta.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteMeta.url}/trial`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteMeta.url}/subjects`, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${siteMeta.url}/columns`,
      ...(latestArticleUpdate ? { lastModified: latestArticleUpdate } : {}),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${siteMeta.url}/news`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteMeta.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    ...subjects
      .filter((subject) => isSubjectPublished(subject.slug))
      .map((subject) => ({
        url: `${siteMeta.url}/subjects/${subject.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ...articles.map((article) => ({
      url: `${siteMeta.url}/columns/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
