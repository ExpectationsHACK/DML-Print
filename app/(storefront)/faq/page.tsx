import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  {
    q: "What is your minimum order quantity?",
    a: "It depends on the product — most items have no strict minimum, while bulk/corporate runs are quoted per project. Tell us the quantity you need on the quote form and we'll confirm.",
  },
  {
    q: "Do you offer design services?",
    a: "Yes. If you don't have a design yet, add your notes to your order or quote request and our team will typeset or design it for you.",
  },
  {
    q: "Can I send my own design?",
    a: "Yes — upload your artwork directly on the product page or the quote form. We check every file before production and flag anything that may print poorly.",
  },
  {
    q: "How long does production take?",
    a: "Turnaround varies by product, typically a few business days. Each product page lists its specific turnaround, and we'll confirm a timeline on any quoted project.",
  },
  {
    q: "Do you deliver outside Lagos?",
    a: "Yes, we deliver nationwide. Delivery fees and timelines vary by state.",
  },
  {
    q: "Can you handle bulk corporate orders?",
    a: "Yes — bulk orders, recurring print support and branded merchandise for businesses are a core part of what we do. Start with our Corporate page or the quote form.",
  },
  {
    q: "What file formats do you accept?",
    a: "PNG, JPG, WebP and PDF for most products. Vector files (SVG, AI, PDF) print cleanest for cut-to-shape stickers and signage.",
  },
  {
    q: "Can I request a sample before placing a bulk order?",
    a: "For larger corporate or recurring orders, yes — mention it on your quote request and we'll discuss options.",
  },
  {
    q: "How do I get a quotation?",
    a: "Fill out the \"Start a Project\" form with your product, quantity and details, or message us on WhatsApp — we'll follow up with pricing and a timeline.",
  },
  {
    q: "Do you offer urgent printing?",
    a: "Let us know your deadline on the quote form or by WhatsApp and we'll confirm whether we can prioritize your job.",
  },
];

export default function FaqPage() {
  return (
    <Container className="py-12">
      <h1 className="font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Answers to the questions we hear most. Can&apos;t find yours? Reach
        out and we&apos;ll help directly.
      </p>

      <dl className="mt-10 divide-y divide-line border-t border-line">
        {faqs.map((faq) => (
          <div key={faq.q} className="py-5">
            <dt className="font-semibold">{faq.q}</dt>
            <dd className="mt-1.5 text-sm text-ink-soft">{faq.a}</dd>
          </div>
        ))}
      </dl>

      <LinkButton href="/quote" className="mt-10">
        Submit Project Request
      </LinkButton>
    </Container>
  );
}
