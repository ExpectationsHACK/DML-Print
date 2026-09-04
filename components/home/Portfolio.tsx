import { Container } from "@/components/ui/Container";
import { PortfolioFilter } from "@/components/home/PortfolioFilter";
import { getPublishedPortfolio } from "@/lib/data/portfolio";

export async function Portfolio() {
  const items = await getPublishedPortfolio();
  if (items.length === 0) return null;

  return (
    <section id="our-work" className="scroll-mt-20 py-16 sm:py-20">
      <Container>
        <h2 className="mb-8 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
          What We&apos;ve Put Into Print
        </h2>
        <PortfolioFilter items={items} />
      </Container>
    </section>
  );
}
