import { categoriesCollection, isDbConfigured, type CategoryDoc } from "@/lib/db";
import { CATEGORIES } from "@/lib/data/catalog";
import type { Category } from "@/lib/types";

function toCategory(doc: CategoryDoc): Category {
  return {
    slug: doc.slug,
    name: doc.name,
    tagline: doc.tagline,
    description: doc.description,
  };
}

/** Built-in categories plus any admins have added from the product form. */
export async function getAllCategories(): Promise<Category[]> {
  if (!isDbConfigured()) return CATEGORIES;
  const categories = await categoriesCollection();
  const docs = await categories.find({}).sort({ createdAt: 1 }).toArray();
  return [...CATEGORIES, ...docs.map(toCategory)];
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const builtIn = CATEGORIES.find((c) => c.slug === slug);
  if (builtIn) return builtIn;
  if (!isDbConfigured()) return undefined;
  const categories = await categoriesCollection();
  const doc = await categories.findOne({ slug });
  return doc ? toCategory(doc) : undefined;
}
