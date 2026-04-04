import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export type ReservationStatus =
  | "pending"
  | "invoiced"
  | "paid"
  | "rejected";

export type ReservationInvoiceItem = {
  description: string;
  amount: number;
};

export type ReservationInput = {
  destination: string;
  experience: string;
  travelDate: string;
  flexibleDates: string;
  duration: string;
  guestCount: number;
  fullName: string;
  email: string;
  whatsapp: string;
  country: string;
  budget: string;
  accommodation: string;
  specialOccasion: string;
  notes: string;
  preferredContact: string;
};

export type ReservationRecord = ReservationInput & {
  id: string;
  status: ReservationStatus;
  submittedAt: string;
  updatedAt: string;
  archivedAt?: string;
  archivedByName?: string;
  archivedByEmail?: string;
  statusNote?: string;
  processedByName?: string;
  processedByEmail?: string;
  statusEmailSentAt?: string;
  statusEmailMode?: "smtp" | "preview";
  invoiceCurrency?: string;
  invoiceTotal?: number;
  invoiceIssuedAt?: string;
  invoiceDueDate?: string;
  invoiceItems?: ReservationInvoiceItem[];
  invoiceNote?: string;
  paymentConfirmedAt?: string;
  paymentConfirmedByName?: string;
  paymentConfirmedByEmail?: string;
  paymentEmailSentAt?: string;
  paymentEmailMode?: "smtp" | "preview";
};

const DATA_DIR = path.join(process.cwd(), "data");
const RESERVATIONS_PATH = path.join(DATA_DIR, "reservations.json");

async function ensureReservationsFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(RESERVATIONS_PATH);
  } catch {
    await fs.writeFile(RESERVATIONS_PATH, "[]\n", "utf8");
  }
}

export async function readReservations(): Promise<ReservationRecord[]> {
  await ensureReservationsFile();

  const raw = await fs.readFile(RESERVATIONS_PATH, "utf8");
  const parsed = JSON.parse(raw) as Array<
    Omit<ReservationRecord, "status"> & {
      status?: ReservationStatus | "approved" | string;
    }
  >;

  const normalized = parsed.map((reservation) => ({
    ...reservation,
    status:
      reservation.status === "approved"
        ? "invoiced"
        : (reservation.status ?? "pending"),
    invoiceItems: reservation.invoiceItems ?? [],
  })) as ReservationRecord[];

  return normalized.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

async function writeReservations(reservations: ReservationRecord[]) {
  await ensureReservationsFile();
  await fs.writeFile(
    RESERVATIONS_PATH,
    `${JSON.stringify(reservations, null, 2)}\n`,
    "utf8",
  );
}

function buildReservationId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const shortId = randomUUID().slice(0, 8).toUpperCase();
  return `EKR-${date}-${shortId}`;
}

export async function createReservation(
  input: ReservationInput,
): Promise<ReservationRecord> {
  const now = new Date().toISOString();
  const reservation: ReservationRecord = {
    ...input,
    id: buildReservationId(),
    status: "pending",
    submittedAt: now,
    updatedAt: now,
  };

  const reservations = await readReservations();
  reservations.unshift(reservation);
  await writeReservations(reservations);

  return reservation;
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
  meta?: {
    statusNote?: string;
    processedByName?: string;
    processedByEmail?: string;
    statusEmailSentAt?: string;
    statusEmailMode?: "smtp" | "preview";
  },
) {
  const reservations = await readReservations();
  const nextReservations = reservations.map((reservation) =>
    reservation.id === id
      ? {
          ...reservation,
          status,
          updatedAt: new Date().toISOString(),
          statusNote: meta?.statusNote?.trim() || "",
          processedByName: meta?.processedByName ?? reservation.processedByName,
          processedByEmail: meta?.processedByEmail ?? reservation.processedByEmail,
          statusEmailSentAt:
            meta?.statusEmailSentAt ?? reservation.statusEmailSentAt,
          statusEmailMode: meta?.statusEmailMode ?? reservation.statusEmailMode,
        }
      : reservation,
  );

  await writeReservations(nextReservations);

  return nextReservations.find((reservation) => reservation.id === id) ?? null;
}

export async function saveReservationInvoice(
  id: string,
  invoice: {
    currency: string;
    total: number;
    dueDate: string;
    items: ReservationInvoiceItem[];
    note?: string;
    processedByName?: string;
    processedByEmail?: string;
    statusEmailMode?: "smtp" | "preview";
  },
) {
  const reservations = await readReservations();
  const nextReservations = reservations.map((reservation) =>
    reservation.id === id
      ? {
          ...reservation,
          status: "invoiced" as ReservationStatus,
          updatedAt: new Date().toISOString(),
          invoiceCurrency: invoice.currency,
          invoiceTotal: invoice.total,
          invoiceDueDate: invoice.dueDate,
          invoiceItems: invoice.items,
          invoiceNote: invoice.note?.trim() || "",
          invoiceIssuedAt: new Date().toISOString(),
          processedByName: invoice.processedByName ?? reservation.processedByName,
          processedByEmail:
            invoice.processedByEmail ?? reservation.processedByEmail,
          statusEmailSentAt: new Date().toISOString(),
          statusEmailMode: invoice.statusEmailMode,
        }
      : reservation,
  );

  await writeReservations(nextReservations);

  return nextReservations.find((reservation) => reservation.id === id) ?? null;
}

export async function confirmReservationPayment(
  id: string,
  meta: {
    paymentConfirmedByName?: string;
    paymentConfirmedByEmail?: string;
    paymentEmailMode?: "smtp" | "preview";
  },
) {
  const reservations = await readReservations();
  const nextReservations = reservations.map((reservation) =>
    reservation.id === id
      ? {
          ...reservation,
          status: "paid" as ReservationStatus,
          updatedAt: new Date().toISOString(),
          paymentConfirmedAt:
            reservation.paymentConfirmedAt ?? new Date().toISOString(),
          paymentConfirmedByName:
            meta.paymentConfirmedByName ?? reservation.paymentConfirmedByName,
          paymentConfirmedByEmail:
            meta.paymentConfirmedByEmail ?? reservation.paymentConfirmedByEmail,
          paymentEmailSentAt: new Date().toISOString(),
          paymentEmailMode: meta.paymentEmailMode,
        }
      : reservation,
  );

  await writeReservations(nextReservations);

  return nextReservations.find((reservation) => reservation.id === id) ?? null;
}

export async function setReservationArchived(
  id: string,
  archived: boolean,
  meta?: {
    archivedByName?: string;
    archivedByEmail?: string;
  },
) {
  const reservations = await readReservations();
  const nextReservations = reservations.map((reservation) =>
    reservation.id === id
      ? {
          ...reservation,
          updatedAt: new Date().toISOString(),
          archivedAt: archived ? new Date().toISOString() : undefined,
          archivedByName: archived
            ? meta?.archivedByName ?? reservation.archivedByName
            : undefined,
          archivedByEmail: archived
            ? meta?.archivedByEmail ?? reservation.archivedByEmail
            : undefined,
        }
      : reservation,
  );

  await writeReservations(nextReservations);

  return nextReservations.find((reservation) => reservation.id === id) ?? null;
}

export async function deleteArchivedReservation(id: string) {
  const reservations = await readReservations();
  const reservationToDelete = reservations.find((reservation) => reservation.id === id);

  if (!reservationToDelete) {
    return null;
  }

  if (!reservationToDelete.archivedAt) {
    throw new Error("Only archived reservations can be deleted permanently.");
  }

  const nextReservations = reservations.filter((reservation) => reservation.id !== id);
  await writeReservations(nextReservations);

  return reservationToDelete;
}
