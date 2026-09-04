"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { ADMIN_NAV_LINKS } from "@/lib/admin-nav";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        aria-expanded={open}
        aria-label="Toggle admin menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={cn(
            "block h-0.5 w-6 bg-cream transition-transform",
            open && "translate-y-2 rotate-45"
          )}
        />
        <span className={cn("block h-0.5 w-6 bg-cream transition-opacity", open && "opacity-0")} />
        <span
          className={cn(
            "block h-0.5 w-6 bg-cream transition-transform",
            open && "-translate-y-2 -rotate-45"
          )}
        />
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-full z-20 border-t border-line bg-surface px-4 py-4 shadow-lg">
          <ul className="flex flex-col gap-3">
            {ADMIN_NAV_LINKS.map((link) => (
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
