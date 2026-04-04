import type { Metadata } from "next";

import {
  markReservationPaidAction,
  setReservationArchivedAction,
  updateReservationStatusAction,
} from "@/app/admin/reservations/actions";
import { InvoiceBuilderForm } from "@/app/admin/reservations/InvoiceBuilderForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { requireAdminUser } from "@/lib/admin-session";
import { type ReservationRecord, readReservations } from "@/lib/reservations";
import { cn } from "@/lib/utils";
import { buildBusinessWhatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Reservation Board | Ekeon Group",
  description:
    "Internal reservation board for reviewing booking requests and updating their status.",
};

const statuses = ["pending", "invoiced", "paid", "rejected"] as const;

type ReservationStatus = (typeof statuses)[number];

const statusCopy: Record<ReservationStatus, { title: string; description: string }> = {
  pending: {
    title: "Pending review",
    description: "Fresh requests waiting for finance approval.",
  },
  invoiced: {
    title: "Invoice sent",
    description: "Proforma invoice sent and awaiting proof of payment.",
  },
  paid: {
    title: "Paid",
    description: "Payment received and confirmed by the team.",
  },
  rejected: {
    title: "Rejected",
    description: "Requests that were reviewed but not accepted.",
  },
};

export default async function AdminReservationsPage() {
  const currentUser = await requireAdminUser();
  const reservations = await readReservations();
  const activeReservations = reservations.filter(
    (reservation) => !reservation.archivedAt,
  );
  const groupedReservations = groupReservationsByStatus(activeReservations);

  return (
    <div className="min-h-screen bg-off-white pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <AdminHeader
          currentUser={currentUser}
          currentPath="/admin/reservations"
        />

        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Internal Workspace
          </p>
          <h1 className="mb-4 text-4xl font-bold text-navy md:text-5xl">
            Reservation Board
          </h1>
          <p className="max-w-3xl text-navy/60">
            Active reservation work only. Finance must complete a proforma invoice before the client can pay, and payment must then be verified before the request moves to paid.
          </p>
        </div>

        {activeReservations.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-navy/15 bg-white px-8 py-16 text-center text-navy/60">
            No active reservation requests right now.
          </div>
        ) : (
          <div className="space-y-10">
            <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {statuses.map((status) => (
                <div
                  key={status}
                  className="rounded-[2rem] border border-navy/10 bg-white p-6 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-navy/40">
                      {statusCopy[status].title}
                    </p>
                    <StatusBadge status={status} />
                  </div>
                  <p className="text-4xl font-bold text-navy">
                    {groupedReservations[status].length}
                  </p>
                  <p className="mt-2 text-sm text-navy/60">
                    {statusCopy[status].description}
                  </p>
                </div>
              ))}
            </section>

            {statuses.map((status) => (
              <section key={status} className="space-y-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-navy">
                      {statusCopy[status].title}
                    </h2>
                    <p className="text-sm text-navy/60">
                      {statusCopy[status].description}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-navy/50">
                    {groupedReservations[status].length} item(s)
                  </p>
                </div>

                {groupedReservations[status].length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-navy/15 bg-white px-6 py-8 text-sm text-navy/50">
                    No reservations in this section.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groupedReservations[status].map((reservation, index) => (
                      <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        defaultOpen={status === "pending" && index === 0}
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReservationCard({
  reservation,
  defaultOpen,
}: {
  reservation: ReservationRecord;
  defaultOpen: boolean;
}) {
  const canMarkPaid = reservation.status === "invoiced";

  return (
    <details
      open={defaultOpen}
      className="rounded-[2rem] border border-gray-100 bg-white shadow-sm"
    >
      <summary className="list-none cursor-pointer px-6 py-5 md:px-8 [&::-webkit-details-marker]:hidden">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-navy/40">
                {reservation.id}
              </span>
              <StatusBadge status={reservation.status} />
            </div>
            <h3 className="truncate text-2xl font-bold text-navy">
              {reservation.fullName}
            </h3>
            <p className="mt-1 text-sm text-navy/60">
              {reservation.destination} - {reservation.experience}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4 lg:min-w-[28rem]">
            <SummaryMetric label="Travel date" value={reservation.travelDate} />
            <SummaryMetric label="Guests" value={String(reservation.guestCount)} />
            <SummaryMetric label="Email" value={reservation.email} />
            <SummaryMetric
              label="Updated"
              value={new Date(reservation.updatedAt).toLocaleDateString()}
            />
          </div>
        </div>
      </summary>

      <div className="border-t border-navy/8 px-6 py-6 md:px-8 md:py-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.9fr]">
          <div className="rounded-[2rem] border border-navy/10 bg-off-white px-5 py-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-navy/40">
                  Proforma Invoice
                </p>
                <p className="mt-1 text-sm text-navy/60">
                  Complete the charges below, send the invoice, and ask the client to reply with proof of payment.
                </p>
              </div>
              <a
                href={buildBusinessWhatsappUrl(reservation)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold"
              >
                WhatsApp Draft
              </a>
            </div>

            <InvoiceBuilderForm
              reservationId={reservation.id}
              reservationStatus={reservation.status}
              defaultCurrency={reservation.invoiceCurrency ?? "USD"}
              defaultIssuedAt={reservation.invoiceIssuedAt ?? new Date().toISOString()}
              defaultDueDate={reservation.invoiceDueDate ?? ""}
              defaultNote={reservation.invoiceNote ?? ""}
              defaultItems={(reservation.invoiceItems ?? []).map((item) => ({
                description: item.description,
                amount: item.amount.toString(),
              }))}
            />
          </div>

          <div className="space-y-5">
            <form action={updateReservationStatusAction} className="rounded-[2rem] border border-navy/10 bg-white px-5 py-5">
              <input type="hidden" name="id" value={reservation.id} />
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-navy/40">
                Review actions
              </p>
              <p className="mt-1 text-sm text-navy/60">
                Use this note for a rejection or a reset back to pending.
              </p>
              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-navy/40">
                  Admin note
                </span>
                <textarea
                  name="statusNote"
                  defaultValue={reservation.statusNote ?? ""}
                  rows={4}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-navy outline-none transition focus:border-gold"
                  placeholder="Optional note for the traveler"
                />
              </label>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="submit"
                  name="status"
                  value="pending"
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold"
                >
                  Set Pending
                </button>
                <button
                  type="submit"
                  name="status"
                  value="rejected"
                  className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-400"
                >
                  Reject
                </button>
              </div>
            </form>

            <div className="rounded-[2rem] border border-navy/10 bg-white px-5 py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-navy/40">
                Payment confirmation
              </p>
              <p className="mt-1 text-sm text-navy/60">
                After verifying the proof of payment, confirm the reservation as paid and notify the client.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <form action={markReservationPaidAction}>
                  <input type="hidden" name="id" value={reservation.id} />
                  <button
                    type="submit"
                    disabled={!canMarkPaid}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Mark as Paid
                  </button>
                </form>
                <form action={setReservationArchivedAction}>
                  <input type="hidden" name="id" value={reservation.id} />
                  <input type="hidden" name="archived" value="true" />
                  <button
                    type="submit"
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400"
                  >
                    Archive
                  </button>
                </form>
              </div>
              {!canMarkPaid ? (
                <p className="mt-3 text-xs text-navy/50">
                  Send the proforma invoice first. The reservation can only be marked as paid after the invoice has been issued.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Detail label="Travel date" value={reservation.travelDate} />
          <Detail label="Flexible dates" value={reservation.flexibleDates} />
          <Detail label="Duration" value={reservation.duration} />
          <Detail label="Guests" value={String(reservation.guestCount)} />
          <Detail label="Budget" value={reservation.budget} />
          <Detail label="Accommodation" value={reservation.accommodation} />
          <Detail label="Email" value={reservation.email} />
          <Detail label="WhatsApp" value={reservation.whatsapp} />
          <Detail label="Country" value={reservation.country} />
          <Detail label="Preferred contact" value={reservation.preferredContact} />
          <Detail
            label="Invoice total"
            value={
              reservation.invoiceTotal
                ? `${reservation.invoiceCurrency ?? "USD"} ${reservation.invoiceTotal.toFixed(2)}`
                : "Not invoiced yet"
            }
          />
          <Detail
            label="Invoice due date"
            value={reservation.invoiceDueDate || "Not set"}
          />
          <Detail
            label="Invoice sent"
            value={
              reservation.invoiceIssuedAt
                ? new Date(reservation.invoiceIssuedAt).toLocaleString()
                : "Not sent yet"
            }
          />
          <Detail
            label="Payment confirmed"
            value={
              reservation.paymentConfirmedAt
                ? new Date(reservation.paymentConfirmedAt).toLocaleString()
                : "Awaiting payment"
            }
          />
          <Detail
            label="Processed by"
            value={
              reservation.processedByName
                ? `${reservation.processedByName} (${reservation.processedByEmail})`
                : "Awaiting review"
            }
          />
          <Detail
            label="Payment confirmed by"
            value={
              reservation.paymentConfirmedByName
                ? `${reservation.paymentConfirmedByName} (${reservation.paymentConfirmedByEmail})`
                : "Not confirmed yet"
            }
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Detail
            label="Special occasion"
            value={reservation.specialOccasion || "None specified"}
          />
          <Detail label="Notes" value={reservation.notes || "No additional notes"} />
          <Detail
            label="Invoice note"
            value={reservation.invoiceNote || reservation.statusNote || "No note added yet"}
          />
        </div>
      </div>
    </details>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-off-white px-3 py-3">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-navy/40">
        {label}
      </p>
      <p className="truncate text-sm font-medium text-navy">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-off-white px-4 py-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-navy/40">
        {label}
      </p>
      <p className="break-words text-sm text-navy">{value}</p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: ReservationRecord["status"];
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]",
        status === "pending" && "bg-amber-100 text-amber-800",
        status === "invoiced" && "bg-sky-100 text-sky-800",
        status === "paid" && "bg-emerald-100 text-emerald-800",
        status === "rejected" && "bg-rose-100 text-rose-800",
      )}
    >
      {status}
    </span>
  );
}

function groupReservationsByStatus(reservations: ReservationRecord[]) {
  return statuses.reduce(
    (accumulator, status) => {
      accumulator[status] = reservations.filter(
        (reservation) => reservation.status === status,
      );
      return accumulator;
    },
    {
      pending: [],
      invoiced: [],
      paid: [],
      rejected: [],
    } as Record<ReservationStatus, ReservationRecord[]>,
  );
}
