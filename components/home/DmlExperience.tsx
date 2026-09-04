import { Container } from "@/components/ui/Container";

const steps = [
  { n: "01", title: "Brief", body: "Tell us what you're looking to create." },
  { n: "02", title: "Consultation", body: "We help determine the right materials, specifications and finishing." },
  { n: "03", title: "Production", body: "Your project moves into production with attention to detail." },
  { n: "04", title: "Quality Check", body: "We inspect the finished product before it leaves us." },
  { n: "05", title: "Delivery", body: "Your completed project gets to you ready to make an impression." },
];

export function DmlExperience() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h2 className="mb-10 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
          The DML Experience
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => (
            <div
              key={step.n}
              className="rounded-[var(--radius-card)] border border-line bg-surface p-6"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime font-display text-sm font-extrabold text-ink">
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
