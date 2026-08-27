import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Container className="max-w-2xl py-12">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">Contact us</h1>
      <p className="mt-3 text-ink-soft">
        Questions about an order, a bulk job, or becoming a partner — reach us
        any of these ways.
      </p>

      <dl className="mt-10 space-y-6">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            WhatsApp
          </dt>
          <dd className="mt-1">
            <a
              href={buildWhatsAppLink("Hello DML Print, I have a question.")}
              className="text-lg font-semibold text-ink hover:underline"
            >
              Chat with us
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Email
          </dt>
          <dd className="mt-1">
            <a href="mailto:hello@dmlprint.ng" className="text-lg hover:text-ink">
              hello@dmlprint.ng
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Studio
          </dt>
          <dd className="mt-1 text-lg">Lagos, Nigeria</dd>
        </div>
      </dl>
    </Container>
  );
}
