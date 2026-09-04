import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/shop/ProductCard";
import { getAllCategories } from "@/lib/data/categories";
import { getAllProducts, getProductsByCategory } from "@/lib/data/products";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse business cards, flyers, banners, apparel, mugs and more.",
};

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const { category } = await searchParams;
  const activeCategory = typeof category === "string" ? category : undefined;

  const [products, categories] = await Promise.all([
    activeCategory ? getProductsByCategory(activeCategory) : getAllProducts(),
    getAllCategories(),
  ]);

  return (
    <Container className="py-12">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Shop</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Every product is customisable — pick your options on the product page
        and upload your artwork, or send us your details and we&apos;ll design it.
      </p>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-8">
        <Link
          href="/products"
          className={cn(
            "rounded-full px-4 py-2 text-sm font-bold",
            !activeCategory ? "bg-ink text-cream" : "bg-surface-sunken text-ink-soft hover:text-ink"
          )}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-bold",
              activeCategory === c.slug ? "bg-ink text-cream" : "bg-surface-sunken text-ink-soft hover:text-ink"
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-12 text-center text-ink-soft">No products in this category yet.</p>
      )}
    </Container>
  );
}
