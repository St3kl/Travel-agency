"use client";

import { useMemo, useRef, useState } from "react";

import { sendReservationInvoiceAction } from "@/app/admin/reservations/actions";
import { formatDisplayDate } from "@/lib/date-format";

type InvoiceRow = {
  id: string;
  description: string;
  amount: string;
};

function buildRow(id: string, description = "", amount = ""): InvoiceRow {
  return {
    id,
    description,
    amount,
  };
}

function buildInitialRows(
  defaultItems: Array<{ description: string; amount: string }>,
) {
  return defaultItems.length > 0
    ? defaultItems.map((item, index) =>
        buildRow(`row-${index}`, item.description, item.amount),
      )
    : [buildRow("row-0")];
}

export function InvoiceBuilderForm({
  reservationId,
  reservationStatus,
  defaultCurrency,
  defaultIssuedAt,
  defaultDueDate,
  defaultNote,
  defaultItems,
}: {
  reservationId: string;
  reservationStatus: "pending" | "invoiced" | "paid" | "rejected";
  defaultCurrency: string;
  defaultIssuedAt: string;
  defaultDueDate: string;
  defaultNote: string;
  defaultItems: Array<{ description: string; amount: string }>;
}) {
  const [rows, setRows] = useState<InvoiceRow[]>(() => buildInitialRows(defaultItems));
  const nextRowIndexRef = useRef(Math.max(defaultItems.length, 1));

  const invoiceTotal = useMemo(
    () =>
      rows.reduce((total, row) => {
        const amount = Number(row.amount);
        return Number.isFinite(amount) ? total + amount : total;
      }, 0),
    [rows],
  );

  const issuedAtLabel = useMemo(
    () => formatDisplayDate(defaultIssuedAt),
    [defaultIssuedAt],
  );

  const invoiceButtonLabel =
    reservationStatus === "invoiced"
      ? "Resend Proforma Invoice"
      : reservationStatus === "paid"
        ? "Payment confirmed"
        : "Approve + Send Proforma Invoice";

  const updateRow = (
    rowId: string,
    field: "description" | "amount",
    value: string,
  ) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row,
      ),
    );
  };

  const addRow = () => {
    const nextRowId = `row-${nextRowIndexRef.current}`;
    nextRowIndexRef.current += 1;
    setRows((currentRows) => [...currentRows, buildRow(nextRowId)]);
  };

  const removeRow = (rowId: string) => {
    setRows((currentRows) =>
      currentRows.length === 1
        ? [buildRow(rowId)]
        : currentRows.filter((row) => row.id !== rowId),
    );
  };

  return (
    <form
      action={sendReservationInvoiceAction}
      className="rounded-[2rem] border border-navy/10 bg-off-white px-5 py-5"
    >
      <input type="hidden" name="id" value={reservationId} />
      <input type="hidden" name="invoiceTotal" value={invoiceTotal.toFixed(2)} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-navy/40">
            Currency
          </span>
          <select
            name="invoiceCurrency"
            defaultValue={defaultCurrency}
            required
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-navy outline-none transition focus:border-gold"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="ZAR">ZAR</option>
          </select>
        </label>
        <div className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-navy/40">
            Invoice date
          </span>
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-navy">
            {issuedAtLabel}
          </div>
        </div>
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-navy/40">
            Due date
          </span>
          <input
            type="date"
            name="invoiceDueDate"
            defaultValue={defaultDueDate}
            required
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-navy outline-none transition focus:border-gold"
          />
        </label>
        <div className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-navy/40">
            Total amount
          </span>
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-navy">
            {invoiceTotal.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-navy/40">
              Expense lines
            </p>
            <p className="mt-1 text-xs text-navy/50">
              The total updates automatically as you enter each amount.
            </p>
          </div>
          <button
            type="button"
            onClick={addRow}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold"
          >
            Add row
          </button>
        </div>

        {rows.map((row, index) => (
          <div
            key={row.id}
            className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_0.7fr_auto]"
          >
            <input
              name="itemDescription"
              value={row.description}
              onChange={(event) =>
                updateRow(row.id, "description", event.target.value)
              }
              placeholder={`Expense ${index + 1} description`}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-navy outline-none transition focus:border-gold"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              name="itemAmount"
              value={row.amount}
              onChange={(event) => updateRow(row.id, "amount", event.target.value)}
              placeholder="Amount"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-navy outline-none transition focus:border-gold"
            />
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="rounded-full border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-400"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-navy/40">
          Invoice note
        </span>
        <textarea
          name="invoiceNote"
          defaultValue={defaultNote}
          rows={4}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-navy outline-none transition focus:border-gold"
          placeholder="Optional finance note or payment instructions"
        />
      </label>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={reservationStatus === "paid"}
          className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {invoiceButtonLabel}
        </button>
        <p className="self-center text-xs text-navy/50">
          Client will receive the proforma invoice PDF and payment instructions by email.
        </p>
      </div>
    </form>
  );
}
