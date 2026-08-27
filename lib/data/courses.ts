import { coursesCollection, isDbConfigured, type CourseDoc } from "@/lib/db";
import type { Course } from "@/lib/types";

function toCourse(doc: CourseDoc): Course {
  return {
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
}

export async function getPublishedCourses(): Promise<Course[]> {
  if (!isDbConfigured()) return [];
  const courses = await coursesCollection();
  const docs = await courses.find({ published: true }).sort({ createdAt: -1 }).toArray();
  return docs.map(toCourse);
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  if (!isDbConfigured()) return undefined;
  const courses = await coursesCollection();
  const doc = await courses.findOne({ slug, published: true });
  return doc ? toCourse(doc) : undefined;
}

export async function getAllCoursesForAdmin(): Promise<Course[]> {
  if (!isDbConfigured()) return [];
  const courses = await coursesCollection();
  const docs = await courses.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(toCourse);
}
