import type { Metadata } from "next";

import { ArchivedRequestsBoard } from "@/app/admin/archive/ArchivedRequestsBoard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { requireAdminUser } from "@/lib/admin-session";
import { readReservations } from "@/lib/reservations";

export const metadata: Metadata = {
  title: "Archive | Ekeon Group",
  description: "Archived reservation requests for the admin team.",
};

export default async function AdminArchivePage() {
  const currentUser = await requireAdminUser();
  const reservations = await readReservations();

  const archivedItems = [
    ...reservations
      .filter((reservation) => reservation.archivedAt)
      .map((reservation) => ({
        id: reservation.id,
        type: "reservation" as const,
        title: reservation.fullName,
        subtitle: `${reservation.destination} - ${reservation.email}`,
        status: reservation.status,
        archivedAt: reservation.archivedAt ?? reservation.updatedAt,
        archivedBy: reservation.archivedByName
          ? `${reservation.archivedByName} (${reservation.archivedByEmail})`
          : "Unknown",
      })),
  ].sort((a, b) => b.archivedAt.localeCompare(a.archivedAt));

  return (
    <div className="min-h-screen bg-off-white pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <AdminHeader currentUser={currentUser} currentPath="/admin/archive" />

        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Internal Workspace
          </p>
          <h1 className="mb-4 text-4xl font-bold text-navy md:text-5xl">
            Archive
          </h1>
          <p className="max-w-3xl text-navy/60">
            Archived reservation requests live here only. Use search and filters
            to locate older bookings by ID, traveler, status, or archived date.
          </p>
        </div>

        <ArchivedRequestsBoard items={archivedItems} />
      </div>
    </div>
  );
}
