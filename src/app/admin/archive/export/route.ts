import { NextResponse } from "next/server";

import {
  type ArchiveExportStatus,
  buildArchiveExportFilename,
  buildArchivedReservationsCsv,
  filterArchivedReservations,
} from "@/lib/archive-export";
import { getCurrentAdminUser } from "@/lib/admin-session";
import { readReservations } from "@/lib/reservations";

export const dynamic = "force-dynamic";

function normalizeStatus(value: string | null): ArchiveExportStatus {
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

export async function GET(request: Request) {
  const currentUser = await getCurrentAdminUser();

  if (!currentUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? "";
  const status = normalizeStatus(url.searchParams.get("status"));
  const reservations = await readReservations();
  const filteredReservations = filterArchivedReservations(reservations, {
    search,
    status,
  });

  const filename = buildArchiveExportFilename({ search, status });
  const csvContent = `\uFEFF${buildArchivedReservationsCsv(filteredReservations)}`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
