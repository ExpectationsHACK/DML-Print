import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/Icons";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { auth } from "@/auth";
import { signOut } from "@/lib/actions/auth";
import { ADMIN_NAV_LINKS } from "@/lib/admin-nav";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await auth();

  if (!session?.user) redirect("/login?next=/admin");
  if (session.user.role !== "admin") redirect("/account");

  return (
    <div className="min-h-screen bg-surface-sunken">
      <header className="relative bg-forest text-cream">
        <Container className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-display text-base font-extrabold tracking-tight">
            <LogoMark className="h-7 w-7 shrink-0 ring-1 ring-cream/20" />
            DML Prints Admin
          </div>
          <div className="flex items-center gap-4">
            <form action={signOut} className="hidden sm:block">
              <button className="text-xs font-semibold text-cream/70 hover:text-cream">
                Sign out
              </button>
            </form>
            <AdminMobileNav />
          </div>
        </Container>
      </header>
      <Container className="grid gap-10 py-10 sm:grid-cols-[180px_1fr]">
        <nav className="hidden flex-col gap-1 sm:flex">
          {ADMIN_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-1.5 text-sm font-semibold text-ink-soft hover:bg-surface hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div>
          <form action={signOut} className="mb-6 sm:hidden">
            <button className="text-xs font-semibold text-ink-soft hover:text-ink">
              Sign out
            </button>
          </form>
          {children}
        </div>
      </Container>
    </div>
  );
}
