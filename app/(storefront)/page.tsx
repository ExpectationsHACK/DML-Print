import { Hero } from "@/components/home/Hero";
import { BrandPhilosophy } from "@/components/home/BrandPhilosophy";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Portfolio } from "@/components/home/Portfolio";
import { CorporateTeaser } from "@/components/home/CorporateTeaser";
import { DmlExperience } from "@/components/home/DmlExperience";
import { WhyDml } from "@/components/home/WhyDml";
import { QuoteCta } from "@/components/home/QuoteCta";

// Hero, CategoryGrid and Portfolio read live, admin-editable products and
// portfolio items from MongoDB — this must render per-request, not get
// baked into static HTML at build time (which would need a DB connection
// during the build itself, and would otherwise go stale until the next
// deploy).
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandPhilosophy />
      <CategoryGrid />
      <Portfolio />
      <CorporateTeaser />
      <DmlExperience />
      <WhyDml />
      <QuoteCta />
    </>
  );
}
