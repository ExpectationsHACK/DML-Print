import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";

export const metadata: Metadata = { title: "Corporate" };

const target = [
  "Corporate organizations",
  "SMEs and startups",
  "NGOs, schools and institutions",
  "Agencies and event companies",
  "Personal brands",
];

const included = [
  "Bulk orders",
  "Recurring print support",
  "Branded merchandise",
  "Corporate stationery",
  "Marketing materials",
  "Packaging",
  "Custom projects",
];

export default function CorporatePage() {
  return (
    <Container className="max-w-3xl py-12">
      <h1 className="font-display text-4xl font-extrabold uppercase leading-tight tracking-tight sm:text-5xl">
        Printing Solutions for Brands That Mean Business.
      </h1>
      <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft">
        We work with organizations that need reliable, repeatable print
        quality — not just a one-off job.
      </p>

      <div className="mt-12 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide text-ink-soft">Who this is for</h2>
          <ul className="mt-4 space-y-2 text-[15px] text-ink">
            {target.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide text-ink-soft">What&apos;s included</h2>
          <ul className="mt-4 space-y-2">
            {included.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[15px] text-ink">
                <CheckIcon className="h-4 w-4 shrink-0 text-forest" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12">
        <LinkButton href="/quote?product=Corporate">
          Discuss Your Corporate Project
        </LinkButton>
      </div>
    </Container>
  );
}
