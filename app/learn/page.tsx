import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getPublishedCourses } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Learn",
  description: "Free guides and videos on preparing artwork and getting the most from print.",
};

// Reads live, admin-editable courses from MongoDB — render per-request,
// not at build time. See app/page.tsx for the same reasoning.
export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const courses = await getPublishedCourses();

  return (
    <Container className="py-12">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Learn</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Short guides and videos on preparing artwork, choosing materials, and
        getting the most out of print — written by the DML Print team.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Link key={course.id} href={`/learn/${course.slug}`} className="group block">
            <div
              className="relative aspect-[16/10] w-full overflow-hidden bg-surface-sunken"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <span className="absolute left-3 top-3 z-10 rounded-md bg-sky px-2.5 py-1 text-xs font-bold capitalize text-ink">
                {course.type}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element -- cover images are arbitrary admin-pasted URLs, not allowlisted domains */}
              <img
                src={course.coverImage}
                alt={course.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <h2 className="mt-3 font-display text-lg font-bold leading-snug tracking-tight">
              {course.title}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">{course.summary}</p>
          </Link>
        ))}
      </div>

      {courses.length === 0 && (
        <p className="mt-12 text-center text-ink-soft">
          Nothing published yet — check back soon.
        </p>
      )}
    </Container>
  );
}
