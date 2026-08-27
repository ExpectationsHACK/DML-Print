"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { coursesCollection, isDbConfigured, newId } from "@/lib/db";
import { slugify } from "@/lib/data/catalog";

const courseSchema = z.object({
  title: z.string().min(2, "Enter a title."),
  type: z.enum(["video", "written"]),
  summary: z.string().min(2, "Enter a short summary."),
  content: z.string().min(2, "Enter the video URL or article content."),
  coverImage: z.string().url("Enter a valid image URL."),
  published: z.enum(["on"]).optional(),
});

export type CourseFormResult = { ok: boolean; error?: string; fieldErrors?: Record<string, string> };

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "admin";
}

function parseForm(formData: FormData) {
  return courseSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    summary: formData.get("summary"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage"),
    published: formData.get("published") ?? undefined,
  });
}

export async function createCourse(
  _prevState: CourseFormResult | null,
  formData: FormData
): Promise<CourseFormResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Admins only." };
  if (!isDbConfigured()) return { ok: false, error: "Learn isn't connected yet." };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const courses = await coursesCollection();
  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug;
  let suffix = 2;
  while (await courses.findOne({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const now = new Date();
  await courses.insertOne({
    _id: newId(),
    slug,
    title: parsed.data.title,
    type: parsed.data.type,
    summary: parsed.data.summary,
    content: parsed.data.content,
    coverImage: parsed.data.coverImage,
    published: parsed.data.published === "on",
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin/learn");
  revalidatePath("/learn");
  redirect("/admin/learn");
}

export async function updateCourse(
  courseId: string,
  _prevState: CourseFormResult | null,
  formData: FormData
): Promise<CourseFormResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Admins only." };
  if (!isDbConfigured()) return { ok: false, error: "Learn isn't connected yet." };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const courses = await coursesCollection();
  const existing = await courses.findOne({ _id: courseId });
  if (!existing) return { ok: false, error: "Course not found." };

  await courses.updateOne(
    { _id: courseId },
    {
      $set: {
        title: parsed.data.title,
        type: parsed.data.type,
        summary: parsed.data.summary,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage,
        published: parsed.data.published === "on",
        updatedAt: new Date(),
      },
    }
  );

  revalidatePath("/admin/learn");
  revalidatePath("/learn");
  revalidatePath(`/learn/${existing.slug}`);
  redirect("/admin/learn");
}

export async function deleteCourse(courseId: string): Promise<void> {
  if (!(await requireAdmin())) return;
  if (!isDbConfigured()) return;

  const courses = await coursesCollection();
  await courses.deleteOne({ _id: courseId });
  revalidatePath("/admin/learn");
  revalidatePath("/learn");
}
