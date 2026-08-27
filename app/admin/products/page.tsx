import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/data/products";
import { priceFrom } from "@/lib/data/catalog";
import { formatNaira } from "@/lib/format";
import { LinkButton } from "@/components/ui/Button";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Products</h1>
        <LinkButton href="/admin/products/new" className="!px-5 !py-2.5 text-sm">
          Add product
        </LinkButton>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <th className="py-3 pr-4">Product</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4">From</th>
              <th className="py-3 pr-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-surface-sunken">
                      <Image
                        src={product.image}
                        alt={product.imageAlt}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <Link href={`/admin/products/${product.id}`} className="font-semibold hover:underline">
                      {product.name}
                    </Link>
                  </div>
                </td>
                <td className="py-3 pr-4 text-ink-soft">{product.category}</td>
                <td className="py-3 pr-4">
                  {product.customQuoteOnly ? "Quote only" : formatNaira(priceFrom(product))}
                </td>
                <td className="py-3 pr-4 text-right">
                  <div className="flex justify-end gap-4">
                    <Link href={`/admin/products/${product.id}`} className="text-xs font-bold uppercase tracking-wide text-ink-soft hover:text-ink">
                      Edit
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="py-10 text-center text-ink-soft">No products yet — add the first one.</p>
        )}
      </div>
    </div>
  );
}
