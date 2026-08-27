import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/actions/products";

export const metadata: Metadata = { title: "Add product" };

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Add product</h1>
      <div className="mt-6">
        <ProductForm action={createProduct} />
      </div>
    </div>
  );
}
