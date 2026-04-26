import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { LedgerRow, type LedgerRowData, type LedgerStatus } from "@/components/LedgerRow";
import {
  useStokvel,
  monthLabel,
  shortMonth,
  listMonths,
  currentMonthKey,
  formatDate,
} from "@/lib/store";

export const Route = createFileRoute("/ledger")({
  head: () => ({
    meta: [
      { title: "Shared Ledger · StockVel-RSA" },
      { name: "description", content: "The shared record of every stokvel contribution — visible to all members." },
    ],
  }),
  component: LedgerPage,
});

const fmt = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2 });

const FILTERS: { id: "all" | LedgerStatus; label: string }[] = [
  { id: "all", label: "All members" },
  { id: "verified", label: "Paid" },
  { id: "pending", label: "Pending POP" },
  { id: "missing", label: "Unpaid" },
];

function LedgerPage() {
  const state = useStokvel();
  const months = useMemo(() => listMonths(state, 6), [state]);
  const [month, setMonth] = useState<string>(currentMonthKey());
  const [filter, setFilter] = useState<"all" | LedgerStatus>("all");
  const [q, setQ] = useState("");

  const rows: LedgerRowData[] = useMemo(() => {
    const byMember = new Map(state.payments.filter((p) => p.month === month).map((p) => [p.memberId, p]));
    return state.members.map((m) => {
      const p = byMember.get(m.id);
      const status: LedgerStatus = p ? p.status : "missing";
      return {
        id: `${m.id}-${month}`,
        member: m.name,
        initials: m.initials,
        amount: p?.amount ?? 0,
        date: p ? formatDate(p.date) : "—",
        ref: p?.ref ?? "—",
        status,
      };
    });
  }, [state, month]);

  const filtered = rows
    .filter((r) => (filter === "all" ? true : r.status === filter))
    .filter((r) => (q ? r.member.toLowerCase().includes(q.toLowerCase()) : true));

  const verified = rows.filter((r) => r.status === "verified").length;
  const pending = rows.filter((r) => r.status === "pending").length;
  const missing = rows.filter((r) => r.status === "missing").length;

  const recorded = rows.reduce((s, r) => s + (r.status === "missing" ? 0 : r.amount), 0);
  const expected = (state.group?.contribution ?? 0) * state.members.length;

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      <section className="border-b-2 border-ink">
        <div className="container-edit py-8 md:py-12">
          <Reveal>
            <p className="eyebrow">Transparency Ledger · {monthLabel(month)}</p>
            <h1 className="mt-3 text-[34px] md:text-[48px] font-semibold leading-[1.05]">
              {state.group?.name ?? "Your stokvel"}
            </h1>
            <p className="mt-4 text-[16px] text-ink/70 max-w-2xl">
              Every contribution. Every timestamp. Visible to all members.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Month selector */}
      <section className="border-b-2 border-ink bg-white">
        <div className="container-edit py-4 flex items-center gap-3 overflow-x-auto">
          <span className="num text-[11px] uppercase tracking-wider text-ink/60 shrink-0">Month:</span>
          <div className="flex gap-2">
            {months.map((m) => {
              const active = m === month;
              return (
                <button
                  key={m}
                  onClick={() => setMonth(m)}
                  className={`shrink-0 h-11 px-4 border-2 num text-[13px] font-medium transition-colors ${
                    active ? "bg-ink text-paper border-ink" : "bg-paper border-ink/15 hover:border-ink"
                  }`}
                >
                  {shortMonth(m)} <span className="opacity-60">{m.slice(2, 4)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="border-b-2 border-ink bg-white">
        <div className="container-edit py-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              const count = f.id === "all" ? rows.length : f.id === "verified" ? verified : f.id === "pending" ? pending : missing;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`h-10 px-4 border-2 text-[14px] font-medium inline-flex items-center gap-2 transition-colors ${
                    active ? "bg-ink text-paper border-ink" : "bg-paper text-ink border-ink/15 hover:border-ink"
                  }`}
                >
                  {f.label}
                  <span className="num text-[12px] opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="flex-1 flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by member name…"
              className="flex-1 h-10 px-3 border-2 border-ink/15 focus:border-ink bg-paper text-[15px] outline-none"
            />
            <Link to="/upload" className="btn-stamp btn-aloe h-10 px-4 text-[13px]">+ Log payment</Link>
          </div>
        </div>
      </section>

      {/* Ledger */}
      <section>
        <div className="container-edit py-10">
          <Reveal>
            <div className="panel">
              <div className="grid grid-cols-12 items-center gap-3 px-4 md:px-5 py-3 border-b-2 border-ink bg-paper">
                <p className="col-span-6 md:col-span-5 num text-[11px] uppercase tracking-wider text-ink/60">Member</p>
                <p className="col-span-6 md:col-span-3 num text-[11px] uppercase tracking-wider text-ink/60 text-right md:text-left">Amount</p>
                <p className="hidden md:block md:col-span-2 num text-[11px] uppercase tracking-wider text-ink/60">Date</p>
                <p className="hidden md:block md:col-span-2 num text-[11px] uppercase tracking-wider text-ink/60 text-right">Status</p>
              </div>
              {filtered.length === 0 ? (
                <div className="p-12 text-center text-ink/60 text-[15px]">No matches in this month.</div>
              ) : (
                filtered.map((row) => <LedgerRow key={row.id} row={row} />)
              )}
              <div className="px-5 py-4 border-t-2 border-ink bg-paper flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <span className="num text-[12px] text-ink/60">UPDATES INSTANTLY · VISIBLE TO ALL MEMBERS</span>
                <Link to="/reports" className="btn-stamp btn-aloe h-10 px-4 text-[13px]">↓ Monthly PDF</Link>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-rule border border-rule">
            {[
              { k: "Total recorded", v: fmt.format(recorded) },
              { k: "Expected", v: fmt.format(expected) },
              { k: "Paid", v: verified.toString() },
              { k: "Unpaid", v: missing.toString() },
            ].map((s) => (
              <div key={s.k} className="bg-paper p-5">
                <p className="num text-[11px] uppercase tracking-wider text-ink/55">{s.k}</p>
                <p className="mt-2 num text-[22px] font-semibold">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
