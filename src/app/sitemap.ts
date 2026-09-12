import type { MetadataRoute } from "next";
import { siteMeta } from "@/lib/content";
import { subjects } from "@/lib/subjects";

/**
 * 検索エンジンに知らせるURL一覧（/sitemap.xml）。
 * 管理画面とログインは noindex なのでここには載せない。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: siteMeta.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteMeta.url}/trial`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteMeta.url}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...subjects.map((subject) => ({
      url: `${siteMeta.url}/subjects/${subject.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
