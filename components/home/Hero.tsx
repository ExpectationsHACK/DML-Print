import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ProductMockup } from "@/components/shop/ProductMockup";
import { getProductBySlug } from "@/lib/data/products";

const showcaseSlugs = ["custom-t-shirts", "custom-mugs", "premium-business-cards", "pvc-banners"];

export async function Hero() {
  const showcase = (await Promise.all(showcaseSlugs.map((s) => getProductBySlug(s)))).filter(
    (p) => p !== undefined
  );

  return (
    <section className="bg-paper">
      <Container className="grid gap-12 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <h1 className="font-display text-[38px] font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl">
            We Print Stories.
            <br />
            We Build Impressions.
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">
            From corporate printing and brand materials to personalized
            products and apparel, DML Prints transforms your ideas into
            tangible experiences that people can see, feel and remember.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <LinkButton href="/quote">Start a Project</LinkButton>
            <LinkButton href="#our-work" variant="secondary">
              View Our Work
            </LinkButton>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {showcase.map((product, i) => (
            <div key={product.id} className={i === 0 ? "col-span-2" : ""}>
              <ProductMockup product={product} />
              <p className="mt-2 text-sm font-bold">{product.name}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
