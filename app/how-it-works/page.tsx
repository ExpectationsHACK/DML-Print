import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { HowItWorks } from "@/components/home/HowItWorks";

export const metadata: Metadata = { title: "How it works" };

const faqs = [
  {
    q: "What file formats do you accept?",
    a: "PNG, JPG, WebP and PDF for most products. Vector files (SVG, AI, PDF) print cleanest for cut-to-shape stickers and signage.",
  },
  {
    q: "What if my design is low resolution?",
    a: "We check every upload before production and flag anything that may print blurry, so you can swap the file before we go ahead.",
  },
  {
    q: "Can I pick up my order instead of getting it delivered?",
    a: "Yes — choose \"Pick up in Lagos\" at checkout and we'll notify you when it's ready.",
  },
  {
    q: "Do you print outside Lagos?",
    a: "Yes, we deliver nationwide. Delivery fees and timelines vary by state.",
  },
  {
    q: "I don't have a design yet — can you help?",
    a: "Yes. Add your notes at checkout or message us on WhatsApp and we'll typeset or design it for a small fee.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Container className="py-12">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          How it works
        </h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          From upload to delivery, here&apos;s what happens to your order.
        </p>
      </Container>
      <HowItWorks />
      <Container className="py-16">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">Common questions</h2>
        <dl className="mt-8 divide-y divide-line border-t border-line">
          {faqs.map((faq) => (
            <div key={faq.q} className="py-5">
              <dt className="font-semibold">{faq.q}</dt>
              <dd className="mt-1.5 text-sm text-ink-soft">{faq.a}</dd>
            </div>
          ))}
        </dl>
        <LinkButton href="/products" className="mt-10">
          Start an order
        </LinkButton>
      </Container>
    </>
  );
}
