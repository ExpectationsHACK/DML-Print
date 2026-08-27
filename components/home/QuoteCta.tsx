import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function QuoteCta() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div
          className="flex flex-col items-start justify-between gap-6 rounded-[var(--radius-card)] px-8 py-10 sm:flex-row sm:items-center"
          style={{ background: "#2F2E0C", color: "#FBFBF3" }}
        >
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Got a bulk or corporate order?
            </h2>
            <p className="mt-2 max-w-md text-sm text-[#FBFBF3]/70">
              Staff uniforms, event materials, packaging runs — tell us what
              you need and we&apos;ll send a quote and timeline.
            </p>
          </div>
          <LinkButton href="/quote" className="shrink-0">
            Request a quote
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
