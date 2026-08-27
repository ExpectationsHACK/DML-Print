import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/Icons";
import { CATEGORIES } from "@/lib/data/catalog";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-sunken">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-7 w-7 text-base" />
            <span className="font-display text-lg font-extrabold tracking-tight">
              DML Print
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            Design it, we print it, we deliver it — custom print for
            businesses and individuals across Nigeria.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-ink-soft">
            Shop
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/products?category=${c.slug}`} className="hover:text-ink">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-ink-soft">
            Company
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/how-it-works" className="hover:text-ink">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/quote" className="hover:text-ink">
                Bulk & corporate orders
              </Link>
            </li>
            <li>
              <Link href="/track-order" className="hover:text-ink">
                Track an order
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-ink">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-ink-soft">
            Talk to us
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={buildWhatsAppLink("Hello DML Print, I have a question.")}
                className="hover:text-ink"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a href="mailto:hello@dmlprint.ng" className="hover:text-ink">
                hello@dmlprint.ng
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-5 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} DML Print. All rights reserved.</p>
          <p>Lagos, Nigeria</p>
        </Container>
      </div>
    </footer>
  );
}
