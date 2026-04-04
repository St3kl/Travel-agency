import Link from "next/link";

import { logoutAdminAction } from "@/app/admin/actions";
import MonthlyVisitsBadge from "@/components/MonthlyVisitsBadge";
import type { AdminSessionUser } from "@/lib/admin-users";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/reservations", label: "Reservations" },
  { href: "/admin/archive", label: "Archive" },
];

export function AdminHeader({
  currentUser,
  currentPath,
}: {
  currentUser: AdminSessionUser;
  currentPath: string;
}) {
  return (
    <div className="mb-8 rounded-[2rem] border border-white/10 bg-navy px-6 py-5 text-white shadow-lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
            Admin Session
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Welcome back, {currentUser.name}
          </h2>
          <p className="mt-1 text-sm text-white/70">{currentUser.email}</p>
          <div className="mt-4">
            <MonthlyVisitsBadge />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <nav className="flex flex-wrap gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  currentPath === link.href
                    ? "bg-gold text-navy"
                    : "bg-white/10 text-white hover:bg-white/20",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
