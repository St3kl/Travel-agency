import type { ReservationRecord, ReservationStatus } from "@/lib/reservations";

export type ArchiveExportStatus = "all" | ReservationStatus;

export type ArchiveExportFilters = {
  search?: string;
  status?: ArchiveExportStatus;
};

function escapeCsvValue(value: string | number) {
  const normalized = String(value ?? "");
  const escaped = normalized.replaceAll("\"", "\"\"");
  return `"${escaped}"`;
}

export function filterArchivedReservations(
  reservations: ReservationRecord[],
  filters: ArchiveExportFilters,
) {
  const normalizedSearch = filters.search?.trim().toLowerCase() ?? "";
  const normalizedStatus = filters.status ?? "all";

  return reservations
    .filter((reservation) => Boolean(reservation.archivedAt))
    .filter((reservation) => {
      const archivedBy = reservation.archivedByName
        ? `${reservation.archivedByName} (${reservation.archivedByEmail ?? ""})`
        : "Unknown";

      const matchesSearch =
        normalizedSearch.length === 0 ||
        reservation.id.toLowerCase().includes(normalizedSearch) ||
        reservation.fullName.toLowerCase().includes(normalizedSearch) ||
        reservation.email.toLowerCase().includes(normalizedSearch) ||
        archivedBy.toLowerCase().includes(normalizedSearch) ||
        reservation.destination.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        normalizedStatus === "all" || reservation.status === normalizedStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) =>
      (b.archivedAt ?? b.updatedAt).localeCompare(a.archivedAt ?? a.updatedAt),
    );
}

export function buildArchivedReservationsCsv(
  reservations: ReservationRecord[],
) {
  const headers = [
    "reservation_id",
    "status",
    "submitted_at",
    "updated_at",
    "archived_at",
    "archived_by_name",
    "archived_by_email",
    "processed_by_name",
    "processed_by_email",
    "traveler_name",
    "email",
    "whatsapp",
    "country",
    "destination",
    "experience",
    "travel_date",
    "flexible_dates",
    "duration",
    "guest_count",
    "budget",
    "accommodation",
    "special_occasion",
    "preferred_contact",
    "invoice_currency",
    "invoice_total",
    "invoice_due_date",
    "payment_confirmed_at",
    "notes",
    "status_note",
    "invoice_note",
  ];

  const rows = reservations.map((reservation) => [
    reservation.id,
    reservation.status,
    reservation.submittedAt,
    reservation.updatedAt,
    reservation.archivedAt ?? "",
    reservation.archivedByName ?? "",
    reservation.archivedByEmail ?? "",
    reservation.processedByName ?? "",
    reservation.processedByEmail ?? "",
    reservation.fullName,
    reservation.email,
    reservation.whatsapp,
    reservation.country,
    reservation.destination,
    reservation.experience,
    reservation.travelDate,
    reservation.flexibleDates,
    reservation.duration,
    reservation.guestCount,
    reservation.budget,
    reservation.accommodation,
    reservation.specialOccasion,
    reservation.preferredContact,
    reservation.invoiceCurrency ?? "",
    reservation.invoiceTotal ?? "",
    reservation.invoiceDueDate ?? "",
    reservation.paymentConfirmedAt ?? "",
    reservation.notes,
    reservation.statusNote ?? "",
    reservation.invoiceNote ?? "",
  ]);

  return [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ].join("\n");
}

export function buildArchiveExportFilename(filters: ArchiveExportFilters) {
  const date = new Date().toISOString().slice(0, 10);
  const statusSegment = filters.status && filters.status !== "all"
    ? filters.status
    : "all";

  return `ekeon-archived-reservations-${statusSegment}-${date}.csv`;
}
