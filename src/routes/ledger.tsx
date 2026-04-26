import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { LedgerRow, type LedgerStatus } from "@/components/LedgerRow";
import { GROUP, LEDGER } from "@/lib/mock-data";

export const Route = createFileRoute("/ledger")({
  head: () => ({
    meta: [
      { title: "Transparency Ledger · TrustVel" },
      { name: "description", content: "The shared, undeniable record of every stokvel contribution. Filter, search, and export." },
    ],
  }),
  component: LedgerPage,
});

const fmt = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2 });

const FILTERS: { id: "all" | LedgerStatus; label: string }[] = [
  { id: "all", label: "All members" },
  { id: "verified", label: "Verified" },
  { id: "pending", label: "Pending" },
  { id: "missing", label: "Missing" },
];

function LedgerPage() {
  const [filter, setFilter] = useState<"all" | LedgerStatus>("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    return LEDGER.filter((r) => (filter === "all" ? true : r.status === filter))
      .filter((r) => (q ? r.member.toLowerCase().includes(q.toLowerCase()) : true));
  }, [filter, q]);

  const verified = LEDGER.filter((r) => r.status === "verified").length;
  const pending = LEDGER.filter((r) => r.status === "pending").length;
  const missing = LEDGER.filter((r) => r.status === "missing").length;

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      <section className="border-b-2 border-ink">
        <div className="container-edit py-10 md:py-14">
          <Reveal>
            <p className="eyebrow">Transparency Ledger · {GROUP.cycle}</p>
            <h1 className="mt-3 text-[36px] md:text-[52px] font-semibold leading-[1.05]">
              {GROUP.name}
            </h1>
            <p className="mt-4 text-[16px] text-ink/70 max-w-2xl">
              Every contribution. Every timestamp. Every signature. Visible to all approved members.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Toolbar */}
      <section className="border-b-2 border-ink bg-white">
        <div className="container-edit py-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              const count = f.id === "all" ? LEDGER.length : f.id === "verified" ? verified : f.id === "pending" ? pending : missing;
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
              {rows.length === 0 ? (
                <div className="p-12 text-center text-ink/60 text-[15px]">No matches in this cycle.</div>
              ) : (
                rows.map((row) => <LedgerRow key={row.id} row={row} />)
              )}
              <div className="px-5 py-4 border-t-2 border-ink bg-paper flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <span className="num text-[12px] text-ink/60">LAST SYNCED · 2 MIN AGO · BACKED UP</span>
                <div className="flex gap-2">
                  <button className="btn-stamp btn-ghost h-10 px-4 text-[13px]">↓ Download CSV</button>
                  <button className="btn-stamp btn-aloe h-10 px-4 text-[13px]">↓ Download PDF</button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Totals strip */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-rule border border-rule">
            {[
              { k: "Total recorded", v: fmt.format(GROUP.groupTotal) },
              { k: "Expected", v: fmt.format(GROUP.expectedTotal) },
              { k: "Verified entries", v: verified.toString() },
              { k: "Outstanding", v: missing.toString() },
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
