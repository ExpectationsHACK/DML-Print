import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { QuoteCta } from "@/components/home/QuoteCta";

// Hero and CategoryGrid read live, admin-editable products from MongoDB —
// this must render per-request, not get baked into static HTML at build
// time (which would need a DB connection during the build itself, and
// would otherwise go stale until the next deploy).
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <HowItWorks />
      <QuoteCta />
    </>
  );
}
