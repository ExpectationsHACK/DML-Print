import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { QuoteCta } from "@/components/home/QuoteCta";

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
