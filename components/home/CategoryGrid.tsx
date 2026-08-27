import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductMockup } from "@/components/shop/ProductMockup";
import { CATEGORIES } from "@/lib/data/catalog";
import { getProductBySlug } from "@/lib/data/products";
import type { CategorySlug } from "@/lib/types";

const representative: Record<CategorySlug, string> = {
  "business-cards-stationery": "premium-business-cards",
  "flyers-posters": "flyers",
  "banners-signage": "pvc-banners",
  apparel: "custom-t-shirts",
  "mugs-gifts": "custom-mugs",
  "stickers-labels": "cut-stickers",
  "logo-branding": "logo-design",
};

export async function CategoryGrid() {
  const products = await Promise.all(
    CATEGORIES.map((c) => getProductBySlug(representative[c.slug]))
  );

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            What are you printing today?
          </h2>
          <Link
            href="/products"
            className="hidden text-sm font-bold text-ink hover:underline sm:block"
          >
            View all products
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((category, i) => {
            const product = products[i];
            if (!product) return null;
            return (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group block"
              >
                <ProductMockup
                  product={product}
                  className="transition-transform duration-200 group-hover:-translate-y-1"
                />
                <p className="mt-3 font-display text-base font-bold leading-snug tracking-tight">
                  {category.name}
                </p>
                <p className="text-sm text-ink-soft">{category.tagline}</p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
