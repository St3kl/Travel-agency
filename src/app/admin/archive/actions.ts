"use server";

import { type ArchiveExportFilters, buildArchiveExportFilename, buildArchivedReservationsCsv, filterArchivedReservations } from "@/lib/archive-export";
import { requireAdminUser } from "@/lib/admin-session";
import { sendArchivedReservationsExportEmail } from "@/lib/mailer";
import { readReservations } from "@/lib/reservations";

export type ArchiveExportActionState = {
  success: boolean;
  message: string;
};

export const initialArchiveExportActionState: ArchiveExportActionState = {
  success: false,
  message: "",
};

function normalizeStatus(value: FormDataEntryValue | null): ArchiveExportFilters["status"] {
  if (
    value === "pending" ||
    value === "invoiced" ||
    value === "paid" ||
    value === "rejected"
  ) {
    return value;
  }

  return "all";
}

export async function sendArchiveExportEmailAction(
  _prevState: ArchiveExportActionState,
  formData: FormData,
): Promise<ArchiveExportActionState> {
  const currentUser = await requireAdminUser();
  const search = typeof formData.get("search") === "string"
    ? String(formData.get("search"))
    : "";
  const status = normalizeStatus(formData.get("status"));

  const reservations = await readReservations();
  const filteredReservations = filterArchivedReservations(reservations, {
    search,
    status,
  });

  if (filteredReservations.length === 0) {
    return {
      success: false,
      message: "No archived reservations match the current filters.",
    };
  }

  const filename = buildArchiveExportFilename({ search, status });
  const csvContent = buildArchivedReservationsCsv(filteredReservations);
  const emailResult = await sendArchivedReservationsExportEmail({
    csvContent,
    filename,
    totalRecords: filteredReservations.length,
    requestedByName: currentUser.name,
    requestedByEmail: currentUser.email,
    search,
    status,
  });

  return {
    success: true,
    message:
      emailResult.mode === "smtp"
        ? `CSV export sent to the company inbox with ${filteredReservations.length} archived reservation(s).`
        : `SMTP is not configured. A preview export was saved locally instead for ${filteredReservations.length} archived reservation(s).`,
  };
}
