import { randomUUID } from "crypto";

import { getSupabaseServerClient } from "@/lib/supabase";

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

type ReservationRow = {
  id: string;
  destination: string;
  experience: string;
  travel_date: string;
  flexible_dates: string;
  duration: string;
  guest_count: number;
  full_name: string;
  email: string;
  whatsapp: string;
  country: string;
  budget: string;
  accommodation: string;
  special_occasion: string;
  notes: string;
  preferred_contact: string;
  status: ReservationStatus | "approved" | string | null;
  submitted_at: string;
  updated_at: string;
  archived_at: string | null;
  archived_by_name: string | null;
  archived_by_email: string | null;
  status_note: string | null;
  processed_by_name: string | null;
  processed_by_email: string | null;
  status_email_sent_at: string | null;
  status_email_mode: "smtp" | "preview" | null;
  invoice_currency: string | null;
  invoice_total: number | null;
  invoice_issued_at: string | null;
  invoice_due_date: string | null;
  invoice_items: ReservationInvoiceItem[] | null;
  invoice_note: string | null;
  payment_confirmed_at: string | null;
  payment_confirmed_by_name: string | null;
  payment_confirmed_by_email: string | null;
  payment_email_sent_at: string | null;
  payment_email_mode: "smtp" | "preview" | null;
};

function normalizeReservationStatus(
  status: ReservationRow["status"],
): ReservationStatus {
  if (status === "approved") {
    return "invoiced";
  }

  if (status === "pending" || status === "invoiced" || status === "paid" || status === "rejected") {
    return status;
  }

  return "pending";
}

function normalizeInvoiceItems(
  value: ReservationRow["invoice_items"],
): ReservationInvoiceItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => ({
      description:
        item && typeof item.description === "string" ? item.description : "",
      amount:
        item && typeof item.amount === "number"
          ? item.amount
          : Number(item?.amount ?? 0),
    }))
    .filter((item) => item.description && !Number.isNaN(item.amount));
}

function mapReservation(row: ReservationRow): ReservationRecord {
  return {
    id: row.id,
    destination: row.destination,
    experience: row.experience,
    travelDate: row.travel_date,
    flexibleDates: row.flexible_dates,
    duration: row.duration,
    guestCount: row.guest_count,
    fullName: row.full_name,
    email: row.email,
    whatsapp: row.whatsapp,
    country: row.country,
    budget: row.budget,
    accommodation: row.accommodation,
    specialOccasion: row.special_occasion,
    notes: row.notes,
    preferredContact: row.preferred_contact,
    status: normalizeReservationStatus(row.status),
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at ?? undefined,
    archivedByName: row.archived_by_name ?? undefined,
    archivedByEmail: row.archived_by_email ?? undefined,
    statusNote: row.status_note ?? undefined,
    processedByName: row.processed_by_name ?? undefined,
    processedByEmail: row.processed_by_email ?? undefined,
    statusEmailSentAt: row.status_email_sent_at ?? undefined,
    statusEmailMode: row.status_email_mode ?? undefined,
    invoiceCurrency: row.invoice_currency ?? undefined,
    invoiceTotal: row.invoice_total ?? undefined,
    invoiceIssuedAt: row.invoice_issued_at ?? undefined,
    invoiceDueDate: row.invoice_due_date ?? undefined,
    invoiceItems: normalizeInvoiceItems(row.invoice_items),
    invoiceNote: row.invoice_note ?? undefined,
    paymentConfirmedAt: row.payment_confirmed_at ?? undefined,
    paymentConfirmedByName: row.payment_confirmed_by_name ?? undefined,
    paymentConfirmedByEmail: row.payment_confirmed_by_email ?? undefined,
    paymentEmailSentAt: row.payment_email_sent_at ?? undefined,
    paymentEmailMode: row.payment_email_mode ?? undefined,
  };
}

function mapReservationInsert(input: ReservationInput & { id: string; now: string }) {
  return {
    id: input.id,
    destination: input.destination,
    experience: input.experience,
    travel_date: input.travelDate,
    flexible_dates: input.flexibleDates,
    duration: input.duration,
    guest_count: input.guestCount,
    full_name: input.fullName,
    email: input.email,
    whatsapp: input.whatsapp,
    country: input.country,
    budget: input.budget,
    accommodation: input.accommodation,
    special_occasion: input.specialOccasion,
    notes: input.notes,
    preferred_contact: input.preferredContact,
    status: "pending" as ReservationStatus,
    submitted_at: input.now,
    updated_at: input.now,
  };
}

function buildReservationId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const shortId = randomUUID().slice(0, 8).toUpperCase();
  return `EKR-${date}-${shortId}`;
}

export async function readReservations(): Promise<ReservationRecord[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to read reservations from Supabase: ${error.message}`);
  }

  return ((data ?? []) as ReservationRow[]).map(mapReservation);
}

export async function createReservation(
  input: ReservationInput,
): Promise<ReservationRecord> {
  const now = new Date().toISOString();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("reservations")
    .insert(mapReservationInsert({ ...input, id: buildReservationId(), now }))
    .select("*")
    .single();

  if (error) {
    throw new Error(`Unable to create reservation in Supabase: ${error.message}`);
  }

  return mapReservation(data as ReservationRow);
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
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("reservations")
    .update({
      status,
      updated_at: new Date().toISOString(),
      status_note: meta?.statusNote?.trim() || "",
      processed_by_name: meta?.processedByName,
      processed_by_email: meta?.processedByEmail,
      status_email_sent_at: meta?.statusEmailSentAt,
      status_email_mode: meta?.statusEmailMode,
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to update reservation status: ${error.message}`);
  }

  return data ? mapReservation(data as ReservationRow) : null;
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
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("reservations")
    .update({
      status: "invoiced" as ReservationStatus,
      updated_at: new Date().toISOString(),
      invoice_currency: invoice.currency,
      invoice_total: invoice.total,
      invoice_due_date: invoice.dueDate,
      invoice_items: invoice.items,
      invoice_note: invoice.note?.trim() || "",
      invoice_issued_at: new Date().toISOString(),
      processed_by_name: invoice.processedByName,
      processed_by_email: invoice.processedByEmail,
      status_email_sent_at: new Date().toISOString(),
      status_email_mode: invoice.statusEmailMode,
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to save reservation invoice: ${error.message}`);
  }

  return data ? mapReservation(data as ReservationRow) : null;
}

export async function confirmReservationPayment(
  id: string,
  meta: {
    paymentConfirmedByName?: string;
    paymentConfirmedByEmail?: string;
    paymentEmailMode?: "smtp" | "preview";
  },
) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("reservations")
    .update({
      status: "paid" as ReservationStatus,
      updated_at: new Date().toISOString(),
      payment_confirmed_at: new Date().toISOString(),
      payment_confirmed_by_name: meta.paymentConfirmedByName,
      payment_confirmed_by_email: meta.paymentConfirmedByEmail,
      payment_email_sent_at: new Date().toISOString(),
      payment_email_mode: meta.paymentEmailMode,
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to confirm reservation payment: ${error.message}`);
  }

  return data ? mapReservation(data as ReservationRow) : null;
}

export async function setReservationArchived(
  id: string,
  archived: boolean,
  meta?: {
    archivedByName?: string;
    archivedByEmail?: string;
  },
) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("reservations")
    .update({
      updated_at: new Date().toISOString(),
      archived_at: archived ? new Date().toISOString() : null,
      archived_by_name: archived ? meta?.archivedByName : null,
      archived_by_email: archived ? meta?.archivedByEmail : null,
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to archive reservation: ${error.message}`);
  }

  return data ? mapReservation(data as ReservationRow) : null;
}

export async function deleteArchivedReservation(id: string) {
  const supabase = getSupabaseServerClient();
  const { data: reservation, error: readError } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (readError) {
    throw new Error(`Unable to load reservation for deletion: ${readError.message}`);
  }

  if (!reservation) {
    return null;
  }

  if (!reservation.archived_at) {
    throw new Error("Only archived reservations can be deleted permanently.");
  }

  const { error: deleteError } = await supabase
    .from("reservations")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw new Error(`Unable to delete archived reservation: ${deleteError.message}`);
  }

  return mapReservation(reservation as ReservationRow);
}
