"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { categoriesCollection, isDbConfigured, newId } from "@/lib/db";
import { slugify } from "@/lib/data/catalog";
import { getAllCategories } from "@/lib/data/categories";
import type { Category } from "@/lib/types";

export type CreateCategoryResult =
  | { ok: true; category: Category }
  | { ok: false; error: string };

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function createCategory(name: string): Promise<CreateCategoryResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Admins only." };
  if (!isDbConfigured()) return { ok: false, error: "Categories aren't connected yet." };

  const trimmed = name.trim();
  if (trimmed.length < 2) return { ok: false, error: "Enter a category name." };

  const slug = slugify(trimmed);
  const existing = await getAllCategories();
  if (existing.some((c) => c.slug === slug)) {
    return { ok: false, error: "A category with that name already exists." };
  }

  const category: Category = { slug, name: trimmed, tagline: "", description: "" };
  const categories = await categoriesCollection();
  await categories.insertOne({
    _id: newId(),
    slug,
    name: trimmed,
    tagline: "",
    description: "",
    createdAt: new Date(),
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");

  return { ok: true, category };
}
