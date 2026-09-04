import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function QuoteCta() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 rounded-[var(--radius-card)] bg-forest px-8 py-10 text-cream sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
              Your Next Big Idea Deserves a Great Print.
            </h2>
            <p className="mt-2 max-w-md text-sm text-cream/70">
              Tell us what you&apos;re trying to create. We&apos;ll help you
              bring it to life.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <LinkButton href="/quote">Start a Project</LinkButton>
            <LinkButton
              href={buildWhatsAppLink("Hello DML Prints, I'd like to start a project.")}
              variant="secondary"
              className="!border-cream !text-cream hover:!border-cream/70"
            >
              WhatsApp DML Prints
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
