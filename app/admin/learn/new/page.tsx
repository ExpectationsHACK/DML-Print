import type { Metadata } from "next";
import { CourseForm } from "@/components/admin/CourseForm";
import { createCourse } from "@/lib/actions/courses";

export const metadata: Metadata = { title: "Add course" };

export default function NewCoursePage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Add course</h1>
      <div className="mt-6">
        <CourseForm action={createCourse} />
      </div>
    </div>
  );
}
