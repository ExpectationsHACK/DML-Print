import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CheckIcon, StarIcon } from "@/components/ui/Icons";
import { ProductMockup } from "@/components/shop/ProductMockup";
import { getProductBySlug } from "@/lib/data/products";

const showcaseSlugs = ["custom-t-shirts", "custom-mugs", "premium-business-cards", "pvc-banners"];

const trustBullets = ["7 product categories", "Nationwide delivery", "Pay with Paystack"];

export async function Hero() {
  const showcase = (await Promise.all(showcaseSlugs.map((s) => getProductBySlug(s)))).filter(
    (p) => p !== undefined
  );

  return (
    <section className="bg-paper">
      <Container className="grid gap-12 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <h1 className="font-display text-[42px] font-extrabold uppercase leading-[1.05] tracking-tight sm:text-6xl">
            Design it.
            <br />
            We print it.
          </h1>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {trustBullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                <CheckIcon className="h-4 w-4 text-lime-strong" />
                {bullet}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-4">
            <LinkButton href="/products">Start designing</LinkButton>
            <LinkButton href="/quote" variant="secondary">
              Request a bulk quote
            </LinkButton>
          </div>

          <div className="mt-8 flex items-center gap-2">
            <div className="flex text-ink">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-4 w-4" />
              ))}
            </div>
            <span className="text-sm font-semibold text-ink-soft">
              Trusted by businesses across Lagos
            </span>
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
