"use client";

import { useMemo, useState } from "react";

import {
  deleteArchivedReservationAction,
  setReservationArchivedAction,
} from "@/app/admin/reservations/actions";
import { formatDisplayDateTime } from "@/lib/date-format";

type ArchivedRequestItem = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  archivedAt: string;
  archivedBy: string;
};

type FilterStatus = "all" | "pending" | "invoiced" | "paid" | "rejected";

export function ArchivedRequestsBoard({
  items,
}: {
  items: ArchivedRequestItem[];
}) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [deletePopoverId, setDeletePopoverId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.id.toLowerCase().includes(normalizedSearch) ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.subtitle.toLowerCase().includes(normalizedSearch) ||
        item.archivedBy.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-navy/10 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <label
              htmlFor="archive-search"
              className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-navy/40"
            >
              Search archived requests
            </label>
            <input
              id="archive-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by ID, name, email, or archived by"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-navy outline-none transition focus:border-gold"
            />
          </div>

          <div className="flex items-end gap-3">
            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className="rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold"
            >
              {showFilters ? "Hide filters" : "Filters"}
            </button>
          </div>
        </div>

        {showFilters ? (
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-navy/8 pt-4 md:grid-cols-1">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-navy/40">
                Status
              </span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as FilterStatus)
                }
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-navy outline-none transition focus:border-gold"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="invoiced">Invoiced</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
          </div>
        ) : null}
      </div>

      <div className="rounded-[2rem] border border-navy/10 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-navy/8 px-6 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-navy/40">
              Archived requests
            </p>
            <p className="mt-1 text-sm text-navy/60">
              {filteredItems.length} result(s)
            </p>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-navy/50">
            No archived requests match the current search and filters.
          </div>
        ) : (
          <div className="divide-y divide-navy/8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 gap-4 px-6 py-5 xl:grid-cols-[1.2fr_1fr_0.9fr_1fr_auto]"
              >
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-[0.22em] text-navy/40">
                      {item.id}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-800">
                      {item.status}
                    </span>
                  </div>
                  <p className="truncate text-lg font-bold text-navy">
                    {item.title}
                  </p>
                  <p className="truncate text-sm text-navy/60">{item.subtitle}</p>
                </div>

                <MetadataCell
                  label="Archived on"
                  value={formatDisplayDateTime(item.archivedAt)}
                />
                <MetadataCell label="Archived by" value={item.archivedBy} />
                <MetadataCell label="Scope" value="Reservation" />

                <div className="relative flex items-center gap-2 xl:justify-end">
                  <form action={setReservationArchivedAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="archived" value="false" />
                    <button
                      type="submit"
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-400"
                    >
                      Restore
                    </button>
                  </form>
                  <button
                    type="button"
                    onClick={() =>
                      setDeletePopoverId((current) =>
                        current === item.id ? null : item.id,
                      )
                    }
                    className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-400"
                  >
                    Delete
                  </button>

                  {deletePopoverId === item.id ? (
                    <div className="absolute top-full right-0 z-10 mt-3 w-72 rounded-[1.5rem] border border-navy/10 bg-white p-4 shadow-2xl">
                      <p className="text-sm font-semibold text-navy">
                        Delete archived request?
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-navy/60">
                        This will permanently remove <span className="font-semibold text-navy">{item.id}</span> from the archive.
                      </p>
                      <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setDeletePopoverId(null)}
                          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold"
                        >
                          Cancel
                        </button>
                        <form action={deleteArchivedReservationAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <button
                            type="submit"
                            className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-400"
                          >
                            Delete permanently
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetadataCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-navy/40">
        {label}
      </p>
      <p className="text-sm text-navy">{value}</p>
    </div>
  );
}
