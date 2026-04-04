import { redirect } from "next/navigation";

import { getCurrentAdminUser } from "@/lib/admin-session";

export default async function AdminIndexPage() {
  const currentUser = await getCurrentAdminUser();

  if (!currentUser) {
    redirect("/admin/login");
  }

  redirect("/admin/reservations");
}
