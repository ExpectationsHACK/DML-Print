import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getCourseBySlug } from "@/lib/data/courses";

export async function generateMetadata({
  params,
}: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return { title: course.title, description: course.summary };
}

export default async function CoursePage({ params }: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <Container className="max-w-2xl py-12">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
        {course.type === "video" ? "Video course" : "Written course"}
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">{course.title}</h1>
      <p className="mt-3 text-ink-soft">{course.summary}</p>

      {course.type === "video" ? (
        <div
          className="relative mt-8 aspect-video w-full overflow-hidden bg-surface-sunken"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <iframe
            src={course.content}
            title={course.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="mt-8 space-y-4 text-ink">
          {course.content.split(/\n{2,}/).map((paragraph, i) => (
            <p key={i} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </Container>
  );
}
