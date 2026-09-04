import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { HowItWorks } from "@/components/home/HowItWorks";

export const metadata: Metadata = { title: "How it works" };

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
      <Container className="flex flex-wrap items-center gap-4 py-16">
        <LinkButton href="/products">Start an order</LinkButton>
        <LinkButton href="/faq" variant="secondary">
          Read our FAQ
        </LinkButton>
      </Container>
    </>
  );
}
