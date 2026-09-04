"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { z } from "zod";
import { auth } from "@/auth";
import { productsCollection, isDbConfigured, newId } from "@/lib/db";
import { slugify } from "@/lib/data/catalog";
import { getCategoryBySlug } from "@/lib/data/categories";

const productSchema = z.object({
  name: z.string().min(2, "Enter a product name."),
  category: z.string().min(1, "Select a category."),
  shortDescription: z.string().min(2, "Enter a short description."),
  description: z.string().min(10, "Enter a fuller description."),
  price: z.coerce.number().positive("Enter a price greater than 0."),
  turnaroundDays: z.coerce.number().int().positive("Enter a turnaround in days."),
  allowsArtworkUpload: z.enum(["on"]).optional(),
  customQuoteOnly: z.enum(["on"]).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type ProductFormResult = { ok: boolean; error?: string; fieldErrors?: Record<string, string> };

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "admin";
}

async function resolveImage(
  formData: FormData,
  fallback: string
): Promise<{ image: string; imageAlt: string } | { error: string }> {
  const file = formData.get("imageFile");
  const urlInput = String(formData.get("imageUrl") || "").trim();
  const name = String(formData.get("name") || "product");

  if (file instanceof File && file.size > 0) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return { error: "Image uploads aren't connected yet — paste an image URL instead." };
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      return { error: "Product images must be PNG, JPG or WebP." };
    }
    try {
      const blob = await put(`products/${slugify(name)}`, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      });
      return { image: blob.url, imageAlt: name };
    } catch {
      return { error: "Image upload failed — please try again." };
    }
  }

  if (urlInput) {
    return { image: urlInput, imageAlt: name };
  }

  return { image: fallback, imageAlt: name };
}

async function isKnownCategory(slug: string): Promise<boolean> {
  return (await getCategoryBySlug(slug)) !== undefined;
}

function parseForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    price: formData.get("price"),
    turnaroundDays: formData.get("turnaroundDays"),
    allowsArtworkUpload: formData.get("allowsArtworkUpload") ?? undefined,
    customQuoteOnly: formData.get("customQuoteOnly") ?? undefined,
    imageUrl: formData.get("imageUrl") ?? "",
  });
}

export async function createProduct(
  _prevState: ProductFormResult | null,
  formData: FormData
): Promise<ProductFormResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Admins only." };
  if (!isDbConfigured()) return { ok: false, error: "Products aren't connected yet." };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }
  if (!(await isKnownCategory(parsed.data.category))) {
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors: { category: "Select a valid category." } };
  }

  const image = await resolveImage(
    formData,
    "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=800&auto=format&fit=crop"
  );
  if ("error" in image) return { ok: false, error: image.error };

  const products = await productsCollection();
  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let suffix = 2;
  while (await products.findOne({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const now = new Date();
  await products.insertOne({
    _id: newId(),
    slug,
    name: parsed.data.name,
    category: parsed.data.category,
    shortDescription: parsed.data.shortDescription,
    description: parsed.data.description,
    image: image.image,
    imageAlt: image.imageAlt,
    variantGroups: [],
    quantityTiers: [{ minQty: 1, unitPrice: parsed.data.price }],
    minQuantity: 1,
    quantityStep: 1,
    allowsArtworkUpload: parsed.data.allowsArtworkUpload === "on",
    customQuoteOnly: parsed.data.customQuoteOnly === "on",
    turnaroundDays: parsed.data.turnaroundDays,
    productionNote: parsed.data.shortDescription,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(
  productId: string,
  _prevState: ProductFormResult | null,
  formData: FormData
): Promise<ProductFormResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Admins only." };
  if (!isDbConfigured()) return { ok: false, error: "Products aren't connected yet." };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }
  if (!(await isKnownCategory(parsed.data.category))) {
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors: { category: "Select a valid category." } };
  }

  const products = await productsCollection();
  const existing = await products.findOne({ _id: productId });
  if (!existing) return { ok: false, error: "Product not found." };

  const image = await resolveImage(formData, existing.image);
  if ("error" in image) return { ok: false, error: image.error };

  // Only the base (first) quantity tier is touched here — any additional
  // tiers or variant groups set up outside this simple form are preserved,
  // not wiped out by a price edit.
  const quantityTiers = existing.quantityTiers.length
    ? existing.quantityTiers.map((tier, i) =>
        i === 0 ? { ...tier, unitPrice: parsed.data.price } : tier
      )
    : [{ minQty: existing.minQuantity, unitPrice: parsed.data.price }];

  await products.updateOne(
    { _id: productId },
    {
      $set: {
        name: parsed.data.name,
        category: parsed.data.category,
        shortDescription: parsed.data.shortDescription,
        description: parsed.data.description,
        image: image.image,
        imageAlt: image.imageAlt,
        quantityTiers,
        allowsArtworkUpload: parsed.data.allowsArtworkUpload === "on",
        customQuoteOnly: parsed.data.customQuoteOnly === "on",
        turnaroundDays: parsed.data.turnaroundDays,
        updatedAt: new Date(),
      },
    }
  );

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${existing.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(productId: string): Promise<void> {
  if (!(await requireAdmin())) return;
  if (!isDbConfigured()) return;

  const products = await productsCollection();
  await products.deleteOne({ _id: productId });
  revalidatePath("/admin/products");
  revalidatePath("/products");
}
