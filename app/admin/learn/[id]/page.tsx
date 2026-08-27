import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { coursesCollection, isDbConfigured } from "@/lib/db";
import { CourseForm } from "@/components/admin/CourseForm";
import { updateCourse } from "@/lib/actions/courses";
import type { Course } from "@/lib/types";

export const metadata: Metadata = { title: "Edit course" };

export default async function EditCoursePage({
  params,
}: PageProps<"/admin/learn/[id]">) {
  const { id } = await params;

  if (!isDbConfigured()) notFound();

  const doc = await (await coursesCollection()).findOne({ _id: id });
  if (!doc) notFound();

  const course: Course = {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    type: doc.type,
    summary: doc.summary,
    content: doc.content,
    coverImage: doc.coverImage,
    published: doc.published,
    createdAt: doc.createdAt.toISOString(),
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Edit course</h1>
      <div className="mt-6">
        <CourseForm action={updateCourse.bind(null, course.id)} course={course} />
      </div>
    </div>
  );
}
