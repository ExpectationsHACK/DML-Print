import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProductMockup } from "@/components/shop/ProductMockup";
import { ProductCustomizer } from "@/components/shop/ProductCustomizer";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProductBySlug } from "@/lib/data/products";

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = await getCategoryBySlug(product.category);

  return (
    <Container className="py-12">
      <nav className="mb-6 text-sm text-ink-soft">
        {category && (
          <>
            <a href={`/products?category=${category.slug}`} className="hover:text-ink">
              {category.name}
            </a>
            <span className="mx-2">/</span>
          </>
        )}
        <span>{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <ProductMockup product={product} className="aspect-square" />
          <p className="mt-4 text-sm text-ink-soft">{product.productionNote}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-wide text-ink-soft">
            Typical turnaround: {product.turnaroundDays} working day
            {product.turnaroundDays > 1 ? "s" : ""}
          </p>
        </div>

        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">{product.name}</h1>
          <p className="mt-3 text-ink-soft">{product.description}</p>

          <div className="mt-8">
            <ProductCustomizer product={product} />
          </div>
        </div>
      </div>
    </Container>
  );
}
