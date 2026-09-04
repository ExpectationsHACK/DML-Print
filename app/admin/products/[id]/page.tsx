import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productsCollection, isDbConfigured } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/lib/actions/products";
import { getAllCategories } from "@/lib/data/categories";
import type { CategorySlug, Product } from "@/lib/types";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]">) {
  const { id } = await params;

  if (!isDbConfigured()) notFound();

  const doc = await (await productsCollection()).findOne({ _id: id });
  if (!doc) notFound();

  const categories = await getAllCategories();

  const product: Product = {
    id: doc._id,
    slug: doc.slug,
    name: doc.name,
    category: doc.category as CategorySlug,
    shortDescription: doc.shortDescription,
    description: doc.description,
    image: doc.image,
    imageAlt: doc.imageAlt,
    variantGroups: doc.variantGroups,
    quantityTiers: doc.quantityTiers,
    minQuantity: doc.minQuantity,
    quantityStep: doc.quantityStep,
    allowsArtworkUpload: doc.allowsArtworkUpload,
    customQuoteOnly: doc.customQuoteOnly,
    turnaroundDays: doc.turnaroundDays,
    productionNote: doc.productionNote,
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Edit product</h1>
      {product.variantGroups.length > 0 && (
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          This product has {product.variantGroups.length} variant option
          {product.variantGroups.length > 1 ? "s" : ""} and{" "}
          {product.quantityTiers.length} quantity price tier
          {product.quantityTiers.length > 1 ? "s" : ""} set up beyond what this
          form edits. Saving here only changes the fields below and the base
          price — your variants and quantity discounts are left as they are.
        </p>
      )}
      <div className="mt-6">
        <ProductForm action={updateProduct.bind(null, product.id)} product={product} categories={categories} />
      </div>
    </div>
  );
}
