import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Container className="max-w-2xl py-12">
      <h1 className="font-display text-4xl font-extrabold uppercase leading-tight tracking-tight sm:text-5xl">
        We Don&apos;t Just Print. We Give Your Ideas a Physical Presence.
      </h1>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink-soft">
        <p>
          DML Prints exists to turn ideas, brands and stories into things
          people can hold, wear and remember. Every business card, banner,
          T-shirt and package we produce is a physical touchpoint of
          someone&apos;s brand — and we treat it with the attention that
          deserves.
        </p>
        <p>
          We hold ourselves to a standard of quality that shows in the
          details: the weight of the paper, the sharpness of a cut, the
          consistency of a colour across a whole run. Print you can be proud
          to hand someone.
        </p>
        <p>
          Our approach to customer service is simple — understand what
          you&apos;re trying to achieve before we quote it, keep you updated
          while it&apos;s in production, and stand behind the finished work.
        </p>
        <p>
          Our ambition is to be the print partner Nigerian businesses and
          individuals trust with the work that represents them — from a
          single custom mug to a full corporate branding rollout.
        </p>
      </div>

      <div className="mt-10">
        <LinkButton href="/quote">Start a Project</LinkButton>
      </div>
    </Container>
  );
}
