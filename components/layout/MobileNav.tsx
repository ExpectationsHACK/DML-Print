"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

const links = [
  { href: "/products", label: "Shop" },
  { href: "/quote", label: "Request a quote" },
  { href: "/track-order", label: "Track order" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/learn", label: "Learn" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        aria-expanded={open}
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={cn(
            "block h-0.5 w-6 bg-ink transition-transform",
            open && "translate-y-2 rotate-45"
          )}
        />
        <span className={cn("block h-0.5 w-6 bg-ink transition-opacity", open && "opacity-0")} />
        <span
          className={cn(
            "block h-0.5 w-6 bg-ink transition-transform",
            open && "-translate-y-2 -rotate-45"
          )}
        />
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-full border-t border-line bg-paper px-4 py-4">
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-1 text-base font-semibold text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
