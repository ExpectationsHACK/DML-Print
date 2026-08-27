import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-control)] text-[15px] font-bold px-6 py-3.5 transition-colors disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-lime text-ink hover:bg-lime-strong",
  dark: "bg-ink text-cream hover:bg-ink/90",
  secondary: "border-2 border-line text-ink hover:border-ink bg-transparent",
  ghost: "text-ink hover:text-ink/70 underline underline-offset-4 decoration-1 px-0 py-0",
};

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}

export function LinkButton({
  variant = "primary",
  className,
  href,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...props} />
  );
}
