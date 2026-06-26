"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import type { Registration, RegistrationStatus, PaymentStatus } from "@/lib/admin/types";
import { RegistrationStatusBadge, PaymentStatusBadge } from "./StatusBadge";
import RegistrationDrawer from "./RegistrationDrawer";

function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return "—"; }
}

const col = createColumnHelper<Registration>();

const COLUMNS = [
  col.accessor("registrationId", {
    header: "Registration ID",
    cell: (c) => <span className="font-mono text-xs text-gray-600">{c.getValue() ?? "—"}</span>,
  }),
  col.accessor("childrenFullNames", {
    header: "Child(ren)",
    cell: (c) => <span className="font-medium text-gray-900">{c.getValue() ?? "—"}</span>,
  }),
  col.accessor("parentFullName", {
    header: "Parent",
    cell: (c) => <span className="text-gray-700">{c.getValue()}</span>,
  }),
  col.accessor("parentPhone", {
    header: "Phone",
    cell: (c) => <span className="text-gray-500 text-xs">{c.getValue() ?? "—"}</span>,
  }),
  col.accessor("selectedMonths", {
    header: "Month",
    cell: (c) => <span className="text-gray-600 text-xs">{c.getValue() ?? "—"}</span>,
  }),
  col.accessor("selectedWeeks", {
    header: "Duration",
    cell: (c) => <span className="text-gray-600 text-xs">{c.getValue() ?? "—"}</span>,
  }),
  col.accessor("paymentStatus", {
    header: "Payment",
    cell: (c) => <PaymentStatusBadge status={c.getValue() as PaymentStatus} />,
  }),
  col.accessor("status", {
    header: "Status",
    cell: (c) => <RegistrationStatusBadge status={c.getValue() as RegistrationStatus} />,
  }),
  col.accessor("submissionDate", {
    header: "Submitted",
    cell: (c) => <span className="text-gray-400 text-xs whitespace-nowrap">{fmtDate(c.getValue())}</span>,
  }),
];

const REG_STATUS_OPTIONS: RegistrationStatus[] = [
  "pending-payment", "awaiting-verification", "confirmed",
  "checked-in", "completed", "cancelled", "waitlist",
];
const PAY_STATUS_OPTIONS: PaymentStatus[] = [
  "awaiting-review", "deposit-paid", "fully-paid", "payment-issue", "refunded",
];

export default function RegistrationsTable({ data }: { data: Registration[] }) {
  const [search,          setSearch]  = useState("");
  const [statusFilter,    setStatus]  = useState<string>("");
  const [paymentFilter,   setPayment] = useState<string>("");
  const [monthFilter,     setMonth]   = useState<string>("");
  const [sorting,         setSorting] = useState<SortingState>([{ id: "submissionDate", desc: true }]);
  const [columnFilters,   setColFilters] = useState<ColumnFiltersState>([]);
  const [pageSize,        setPageSize]   = useState(25);
  const [selectedReg,     setSelected]   = useState<Registration | null>(null);

  const filtered = useMemo(() => {
    let rows = data;
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        (r.registrationId  ?? "").toLowerCase().includes(q) ||
        (r.parentFullName  ?? "").toLowerCase().includes(q) ||
        (r.childrenFullNames ?? "").toLowerCase().includes(q) ||
        (r.parentPhone     ?? "").toLowerCase().includes(q) ||
        (r.email           ?? "").toLowerCase().includes(q),
      );
    }
    if (statusFilter)  rows = rows.filter((r) => r.status        === statusFilter);
    if (paymentFilter) rows = rows.filter((r) => r.paymentStatus === paymentFilter);
    if (monthFilter)   rows = rows.filter((r) => (r.selectedMonths ?? "").toLowerCase().includes(monthFilter.toLowerCase()));
    return rows;
  }, [data, search, statusFilter, paymentFilter, monthFilter]);

  const table = useReactTable({
    data: filtered,
    columns: COLUMNS,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const months = useMemo(() => {
    const s = new Set(data.map((r) => r.selectedMonths).filter(Boolean) as string[]);
    return Array.from(s).sort();
  }, [data]);

  function exportCSV() {
    const headers = ["ID", "Child", "Parent", "Phone", "Email", "Month", "Weeks", "Payment Status", "Status", "Submitted"];
    const rows = filtered.map((r) => [
      r.registrationId, r.childrenFullNames, r.parentFullName, r.parentPhone,
      r.email, r.selectedMonths, r.selectedWeeks, r.paymentStatus, r.status,
      fmtDate(r.submissionDate),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `registrations-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, ID, phone, email…"
          className="h-9 w-72 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-600"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatus(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-leaf-600"
        >
          <option value="">All statuses</option>
          {REG_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPayment(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-leaf-600"
        >
          <option value="">All payment statuses</option>
          {PAY_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
        </select>

        {months.length > 0 && (
          <select
            value={monthFilter}
            onChange={(e) => setMonth(e.target.value)}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-leaf-600"
          >
            <option value="">All months</option>
            {months.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        )}

        <div className="ml-auto flex gap-2">
          {(search || statusFilter || paymentFilter || monthFilter) && (
            <button
              onClick={() => { setSearch(""); setStatus(""); setPayment(""); setMonth(""); }}
              className="h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={exportCSV}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Result count */}
      <p className="mb-3 text-xs text-gray-400">
        {filtered.length} registration{filtered.length !== 1 ? "s" : ""} {search || statusFilter || paymentFilter ? "(filtered)" : ""}
      </p>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      onClick={h.column.getToggleSortingHandler()}
                      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap ${h.column.getCanSort() ? "cursor-pointer select-none hover:text-gray-800" : ""}`}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() === "asc"  ? " ↑" : h.column.getIsSorted() === "desc" ? " ↓" : ""}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">View</th>
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="px-4 py-12 text-center text-sm text-gray-400">
                    {search || statusFilter || paymentFilter ? "No registrations match your filters." : "No registrations yet."}
                  </td>
                </tr>
              ) : table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelected(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(row.original); }}
                      className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Rows per page</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => { table.setPageSize(Number(e.target.value)); setPageSize(Number(e.target.value)); }}
                className="rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-600"
              >
                {[10, 25, 50].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <span className="text-xs text-gray-400">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <div className="flex gap-1">
              <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
                className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                ← Prev
              </button>
              <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
                className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      {selectedReg && (
        <RegistrationDrawer
          registration={selectedReg}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
