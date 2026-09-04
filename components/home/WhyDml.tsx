import { Container } from "@/components/ui/Container";

const reasons = [
  { title: "Quality That Shows", body: "Your brand should look as good in print as it does on screen." },
  { title: "Detail That Matters", body: "We pay attention to the little things that make the final product feel premium." },
  { title: "Built Around Your Brand", body: "We don't believe in one-size-fits-all printing." },
  { title: "Reliable Execution", body: "Your specifications, quantities and deadlines matter." },
];

export function WhyDml() {
  return (
    <section className="bg-surface-sunken py-16 sm:py-20">
      <Container>
        <h2 className="mb-10 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
          Why DML Prints
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.title}>
              <h3 className="font-display text-lg font-bold tracking-tight">{reason.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{reason.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
