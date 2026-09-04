import { Container } from "@/components/ui/Container";

export function BrandPhilosophy() {
  return (
    <section className="bg-surface-sunken py-16 sm:py-20">
      <Container className="max-w-2xl">
        <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
          Print Is More Than Ink on Paper.
        </h2>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
          It is how your customer experiences your brand in their hands. It
          is the first impression on a business card, the excitement of
          opening a branded package, the identity carried on a T-shirt, and
          the story told through every detail.
        </p>
        <p className="mt-3 font-display text-lg font-bold tracking-tight">
          That&apos;s where DML Prints comes in.
        </p>
      </Container>
    </section>
  );
}
