import type { MetadataRoute } from "next";
import { siteMeta } from "@/lib/content";

/** /robots.txt。管理画面とログインはクロール対象から外す */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login"],
    },
    sitemap: `${siteMeta.url}/sitemap.xml`,
  };
}
