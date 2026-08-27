"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import type { CourseFormResult } from "@/lib/actions/courses";
import type { Course } from "@/lib/types";

const initialState: CourseFormResult | null = null;

export function CourseForm({
  action,
  course,
}: {
  action: (prevState: CourseFormResult | null, formData: FormData) => Promise<CourseFormResult>;
  course?: Course;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [type, setType] = useState(course?.type ?? "written");
  const fieldErrors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <Field label="Title" htmlFor="title" required>
        <Input id="title" name="title" required defaultValue={course?.title} />
        {fieldErrors.title && <p className="mt-1 text-xs text-danger">{fieldErrors.title}</p>}
      </Field>

      <Field label="Type" htmlFor="type" required>
        <Select
          id="type"
          name="type"
          required
          value={type}
          onChange={(e) => setType(e.target.value as "video" | "written")}
        >
          <option value="written">Written course</option>
          <option value="video">Video course</option>
        </Select>
      </Field>

      <Field label="Summary" htmlFor="summary" required hint="Shown on the Learn listing page.">
        <Input id="summary" name="summary" required defaultValue={course?.summary} />
        {fieldErrors.summary && <p className="mt-1 text-xs text-danger">{fieldErrors.summary}</p>}
      </Field>

      <Field
        label={type === "video" ? "Video URL" : "Article content"}
        htmlFor="content"
        required
        hint={
          type === "video"
            ? "A YouTube or Vimeo embed URL, e.g. https://www.youtube.com/embed/VIDEO_ID"
            : "Plain text or simple paragraphs — one blank line between paragraphs."
        }
      >
        {type === "video" ? (
          <Input id="content" name="content" required defaultValue={course?.content} placeholder="https://www.youtube.com/embed/..." />
        ) : (
          <Textarea id="content" name="content" required defaultValue={course?.content} className="min-h-56" />
        )}
        {fieldErrors.content && <p className="mt-1 text-xs text-danger">{fieldErrors.content}</p>}
      </Field>

      <Field label="Cover image URL" htmlFor="coverImage" required>
        <Input
          id="coverImage"
          name="coverImage"
          type="url"
          required
          defaultValue={course?.coverImage}
          placeholder="https://..."
        />
        {fieldErrors.coverImage && <p className="mt-1 text-xs text-danger">{fieldErrors.coverImage}</p>}
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={course?.published ?? true} />
        Published (visible on the public Learn page)
      </label>

      {state && !state.ok && state.error && <p className="text-sm text-danger">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : course ? "Save changes" : "Create course"}
      </Button>
    </form>
  );
}
