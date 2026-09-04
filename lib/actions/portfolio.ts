"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { z } from "zod";
import { auth } from "@/auth";
import { portfolioCollection, isDbConfigured, newId } from "@/lib/db";
import { slugify } from "@/lib/data/catalog";

const portfolioCategories = ["corporate", "branding", "apparel", "events", "personalized"] as const;

const portfolioSchema = z.object({
  title: z.string().min(2, "Enter a title."),
  category: z.enum(portfolioCategories),
  clientName: z.string().optional(),
  productionDetails: z.string().optional(),
  description: z.string().min(10, "Enter a fuller description."),
  published: z.enum(["on"]).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type PortfolioFormResult = { ok: boolean; error?: string; fieldErrors?: Record<string, string> };

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
  const name = String(formData.get("title") || "portfolio item");

  if (file instanceof File && file.size > 0) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return { error: "Image uploads aren't connected yet — paste an image URL instead." };
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      return { error: "Portfolio images must be PNG, JPG or WebP." };
    }
    try {
      const blob = await put(`portfolio/${slugify(name)}`, file, {
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

function parseForm(formData: FormData) {
  return portfolioSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    clientName: formData.get("clientName") ?? "",
    productionDetails: formData.get("productionDetails") ?? "",
    description: formData.get("description"),
    published: formData.get("published") ?? undefined,
    imageUrl: formData.get("imageUrl") ?? "",
  });
}

export async function createPortfolioItem(
  _prevState: PortfolioFormResult | null,
  formData: FormData
): Promise<PortfolioFormResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Admins only." };
  if (!isDbConfigured()) return { ok: false, error: "Portfolio isn't connected yet." };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const image = await resolveImage(
    formData,
    "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=800&auto=format&fit=crop"
  );
  if ("error" in image) return { ok: false, error: image.error };

  const portfolio = await portfolioCollection();
  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug;
  let suffix = 2;
  while (await portfolio.findOne({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const now = new Date();
  try {
    await portfolio.insertOne({
      _id: newId(),
      slug,
      title: parsed.data.title,
      category: parsed.data.category,
      clientName: parsed.data.clientName || null,
      productionDetails: parsed.data.productionDetails || null,
      description: parsed.data.description,
      image: image.image,
      imageAlt: image.imageAlt,
      published: parsed.data.published === "on",
      createdAt: now,
      updatedAt: now,
    });
  } catch {
    return { ok: false, error: "Could not save this item. Please try again." };
  }

  revalidatePath("/admin/portfolio");
  revalidatePath("/");
  redirect("/admin/portfolio");
}

export async function updatePortfolioItem(
  portfolioId: string,
  _prevState: PortfolioFormResult | null,
  formData: FormData
): Promise<PortfolioFormResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Admins only." };
  if (!isDbConfigured()) return { ok: false, error: "Portfolio isn't connected yet." };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const portfolio = await portfolioCollection();
  const existing = await portfolio.findOne({ _id: portfolioId });
  if (!existing) return { ok: false, error: "Portfolio item not found." };

  const image = await resolveImage(formData, existing.image);
  if ("error" in image) return { ok: false, error: image.error };

  try {
    await portfolio.updateOne(
      { _id: portfolioId },
      {
        $set: {
          title: parsed.data.title,
          category: parsed.data.category,
          clientName: parsed.data.clientName || null,
          productionDetails: parsed.data.productionDetails || null,
          description: parsed.data.description,
          image: image.image,
          imageAlt: image.imageAlt,
          published: parsed.data.published === "on",
          updatedAt: new Date(),
        },
      }
    );
  } catch {
    return { ok: false, error: "Could not save this item. Please try again." };
  }

  revalidatePath("/admin/portfolio");
  revalidatePath("/");
  redirect("/admin/portfolio");
}

export async function deletePortfolioItem(portfolioId: string): Promise<void> {
  if (!(await requireAdmin())) return;
  if (!isDbConfigured()) return;

  const portfolio = await portfolioCollection();
  await portfolio.deleteOne({ _id: portfolioId });
  revalidatePath("/admin/portfolio");
  revalidatePath("/");
}
