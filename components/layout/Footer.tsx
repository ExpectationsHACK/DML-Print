import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/Icons";
import { LinkButton } from "@/components/ui/Button";
import { getAllCategories } from "@/lib/data/categories";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export async function Footer() {
  const categories = await getAllCategories();

  return (
    <footer className="border-t border-line bg-surface-sunken">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-7 w-7 text-base" />
            <span className="font-display text-lg font-extrabold tracking-tight">
              DML Prints
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            We Print Stories. We Build Impressions.
          </p>
          <div className="mt-5">
            <LinkButton href="/quote" className="!px-5 !py-2.5 text-sm">
              Request a Quote
            </LinkButton>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-ink-soft">
            Shop
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.slice(0, 5).map((c) => (
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
              <Link href="/about" className="hover:text-ink">
                About
              </Link>
            </li>
            <li>
              <Link href="/#our-work" className="hover:text-ink">
                Our Work
              </Link>
            </li>
            <li>
              <Link href="/corporate" className="hover:text-ink">
                Corporate
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-ink">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-ink">
                FAQ
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
                href={buildWhatsAppLink("Hello DML Prints, I have a question.")}
                className="hover:text-ink"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a href="mailto:dmlprint001@gmail.com" className="hover:text-ink">
                dmlprint001@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/dmlprintsonwears"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@dmlprintsonwears"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink"
              >
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-5 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} DML Prints. All rights reserved.</p>
          <p>Lagos, Nigeria</p>
        </Container>
      </div>
    </footer>
  );
}
