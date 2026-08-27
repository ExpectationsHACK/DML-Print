"use client";

import { useTransition } from "react";
import { deleteCourse } from "@/lib/actions/courses";

export function DeleteCourseButton({ courseId, title }: { courseId: string; title: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Delete "${title}"? This can't be undone.`)) {
          startTransition(() => deleteCourse(courseId));
        }
      }}
      className="text-xs font-bold uppercase tracking-wide text-ink-soft hover:text-danger disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
