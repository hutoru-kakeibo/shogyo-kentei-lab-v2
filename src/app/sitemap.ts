import type { MetadataRoute } from "next";
import { siteMeta } from "@/lib/content";
import { subjects } from "@/lib/subjects";
import { getArticleSummaries } from "@/lib/articles";

// 管理画面で保存したときにも即時更新されるが、念のため1時間ごとにも作り直す
export const revalidate = 3600;

/**
 * 検索エンジンに知らせるURL一覧（/sitemap.xml）。
 * 管理画面とログインは noindex なのでここには載せない。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const articles = await getArticleSummaries(1000);
  const latestArticleUpdate = articles.reduce<Date | null>((latest, article) => {
    const updated = new Date(article.updatedAt);
    return !latest || updated > latest ? updated : latest;
  }, null);

  return [
    { url: siteMeta.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteMeta.url}/trial`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${siteMeta.url}/columns`,
      lastModified: latestArticleUpdate ?? now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${siteMeta.url}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...subjects.map((subject) => ({
      url: `${siteMeta.url}/subjects/${subject.slug}`,
      lastModified: now,
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
