import { Container } from "@/components/ui/Container";

const steps = [
  {
    n: "1",
    title: "Choose & customise",
    body: "Pick a product, choose your size, colour or material, and upload your artwork.",
  },
  {
    n: "2",
    title: "We check the file",
    body: "We review resolution and print area before production, and flag anything that won't print well.",
  },
  {
    n: "3",
    title: "It goes into production",
    body: "Your order is printed at our Lagos facility and quality-checked before it ships.",
  },
  {
    n: "4",
    title: "Delivered to you",
    body: "Track your order from production to your door, or pick up in person.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-surface-sunken py-16 sm:py-20">
      <Container>
        <h2 className="mb-10 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          How it works
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.n}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime font-display text-base font-extrabold text-ink">
                {step.n}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{step.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
