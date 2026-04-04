import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/app/admin/login/AdminLoginForm";
import { getCurrentAdminUser } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Admin Login | Ekeon Group",
  description: "Private access for the Ekeon Group operations team.",
};

export default async function AdminLoginPage() {
  const currentUser = await getCurrentAdminUser();

  if (currentUser) {
    redirect("/admin/reservations");
  }

  return (
    <div className="min-h-screen bg-off-white px-6 py-28">
      <div className="mx-auto max-w-md">
        <div className="rounded-[2rem] border border-navy/10 bg-white p-8 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Private Workspace
          </p>
          <h1 className="mb-3 text-4xl font-bold text-navy">
            Admin access
          </h1>
          <p className="mb-8 text-sm leading-6 text-navy/60">
            Sign in to manage reservation requests from the Ekeon Group admin
            board.
          </p>

          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
