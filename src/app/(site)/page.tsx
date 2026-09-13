import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { StrongPoint } from "@/components/sections/StrongPoint";
import { CourseSearch } from "@/components/sections/CourseSearch";
import { Flow } from "@/components/sections/Flow";
import { Teachers } from "@/components/sections/Teachers";
import { Voice } from "@/components/sections/Voice";
import { FreeMaterials } from "@/components/sections/FreeMaterials";
import { Columns } from "@/components/sections/Columns";
import { Faq } from "@/components/sections/Faq";
import { News } from "@/components/sections/News";
import { FaqJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";

/**
 * 新着情報・コラムを Supabase から取得するため、5分ごとにページを作り直す。
 * （静的配信のまま、記事の追加が最大5分で反映される）
 */
export const revalidate = 300;

export default function Home() {
  return (
    <main>
      <OrganizationJsonLd />
      <FaqJsonLd />
      <Hero />
      <About />
      <StrongPoint />
      <CourseSearch />
      <Flow />
      <Teachers />
      <Voice />
      <FreeMaterials />
      <Columns />
      <Faq />
      <News />
    </main>
  );
}
