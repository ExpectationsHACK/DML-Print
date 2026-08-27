import Link from "next/link";
import { ProductMockup } from "@/components/shop/ProductMockup";
import { priceFrom, variantSummary } from "@/lib/data/catalog";
import { formatNaira } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const from = priceFrom(product);

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <ProductMockup
        product={product}
        badge={product.customQuoteOnly ? "Quote only" : undefined}
        className="transition-transform duration-200 group-hover:-translate-y-1"
      />
      <div className="pt-4">
        <h3 className="font-display text-base font-bold leading-snug tracking-tight">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-ink-soft">{variantSummary(product)}</p>
        <p className="mt-2 text-base font-bold">
          {product.customQuoteOnly ? (
            <span>Request a quote</span>
          ) : (
            <>From {formatNaira(from)}</>
          )}
        </p>
      </div>
    </Link>
  );
}
