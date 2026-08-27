import { productsCollection, isDbConfigured, type ProductDoc } from "@/lib/db";
import type { CategorySlug, Product } from "@/lib/types";

function toProduct(doc: ProductDoc): Product {
  return {
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
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isDbConfigured()) return [];
  const products = await productsCollection();
  const docs = await products.find({}).sort({ createdAt: 1 }).toArray();
  return docs.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isDbConfigured()) return undefined;
  const products = await productsCollection();
  const doc = await products.findOne({ slug });
  return doc ? toProduct(doc) : undefined;
}

export async function getProductsByCategory(category: CategorySlug): Promise<Product[]> {
  if (!isDbConfigured()) return [];
  const products = await productsCollection();
  const docs = await products.find({ category }).sort({ createdAt: 1 }).toArray();
  return docs.map(toProduct);
}
