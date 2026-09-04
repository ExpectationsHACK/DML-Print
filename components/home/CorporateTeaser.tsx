import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CheckIcon } from "@/components/ui/Icons";

const bullets = [
  "Bulk Orders",
  "Corporate Branding",
  "Marketing Materials",
  "Promotional Products",
  "Branded Merchandise",
  "Custom Projects",
];

export function CorporateTeaser() {
  return (
    <section className="bg-surface-sunken py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            For Brands That Mean Business.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
            Your brand deserves a print partner who understands that every
            detail represents your business.
          </p>
          <div className="mt-8">
            <LinkButton href="/corporate">
              Let&apos;s Handle Your Next Corporate Project
            </LinkButton>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-2 text-sm font-semibold text-ink">
              <CheckIcon className="h-4 w-4 shrink-0 text-forest" />
              {bullet}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
