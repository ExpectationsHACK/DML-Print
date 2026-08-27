import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { auth } from "@/auth";
import { signOut } from "@/lib/actions/auth";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/quotes", label: "Quote requests" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/learn", label: "Learn" },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await auth();

  if (!session?.user) redirect("/login?next=/admin");
  if (session.user.role !== "admin") redirect("/account");

  return (
    <div className="min-h-screen bg-surface-sunken">
      <header className="bg-[#2F2E0C] text-[#FBFBF3]">
        <Container className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-display text-base font-extrabold tracking-tight">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md bg-lime text-xs font-extrabold text-[#2F2E0C]"
              aria-hidden="true"
            >
              D
            </span>
            DML Print Admin
          </div>
          <form action={signOut}>
            <button className="text-xs font-semibold text-[#FBFBF3]/70 hover:text-[#FBFBF3]">
              Sign out
            </button>
          </form>
        </Container>
      </header>
      <Container className="grid gap-10 py-10 sm:grid-cols-[180px_1fr]">
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-1.5 text-sm font-semibold text-ink-soft hover:bg-surface hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div>{children}</div>
      </Container>
    </div>
  );
}
