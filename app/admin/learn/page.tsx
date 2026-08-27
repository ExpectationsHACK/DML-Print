import Link from "next/link";
import type { Metadata } from "next";
import { getAllCoursesForAdmin } from "@/lib/data/courses";
import { LinkButton } from "@/components/ui/Button";
import { DeleteCourseButton } from "@/components/admin/DeleteCourseButton";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Learn" };

export default async function AdminLearnPage() {
  const courses = await getAllCoursesForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Learn</h1>
        <LinkButton href="/admin/learn/new" className="!px-5 !py-2.5 text-sm">
          Add course
        </LinkButton>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <th className="py-3 pr-4">Title</th>
              <th className="py-3 pr-4">Type</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Created</th>
              <th className="py-3 pr-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="py-3 pr-4">
                  <Link href={`/admin/learn/${course.id}`} className="font-semibold hover:underline">
                    {course.title}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-ink-soft capitalize">{course.type}</td>
                <td className="py-3 pr-4">
                  {course.published ? (
                    <span className="rounded-md bg-lime/40 px-2 py-0.5 text-xs font-bold text-ink">
                      Published
                    </span>
                  ) : (
                    <span className="text-ink-soft">Draft</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-ink-soft">{formatDate(course.createdAt)}</td>
                <td className="py-3 pr-4 text-right">
                  <div className="flex justify-end gap-4">
                    <Link href={`/admin/learn/${course.id}`} className="text-xs font-bold uppercase tracking-wide text-ink-soft hover:text-ink">
                      Edit
                    </Link>
                    <DeleteCourseButton courseId={course.id} title={course.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && (
          <p className="py-10 text-center text-ink-soft">No courses yet — add the first one.</p>
        )}
      </div>
    </div>
  );
}
