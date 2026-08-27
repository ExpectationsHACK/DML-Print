import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/Icons";
import { LinkButton } from "@/components/ui/Button";
import { CartLink } from "@/components/layout/CartLink";
import { MobileNav } from "@/components/layout/MobileNav";

const links = [
  { href: "/products", label: "Shop" },
  { href: "/quote", label: "Bulk quote" },
  { href: "/track-order", label: "Track order" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/learn", label: "Learn" },
];

export function Header() {
  return (
    <header className="relative border-b border-line bg-paper">
      <Container className="flex h-18 items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark className="h-8 w-8 text-lg" />
          <span className="font-display text-xl font-extrabold tracking-tight">
            DML Print
          </span>
        </Link>

        <nav className="hidden items-center gap-7 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-semibold text-ink-soft hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/account"
            className="hidden text-[15px] font-semibold text-ink-soft hover:text-ink sm:block"
          >
            Account
          </Link>
          <CartLink />
          <div className="hidden sm:block">
            <LinkButton href="/products" className="!px-5 !py-2.5 text-sm">
              Start an order
            </LinkButton>
          </div>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
