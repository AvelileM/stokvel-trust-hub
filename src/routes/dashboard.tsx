import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import {
  store,
  useStokvel,
  monthLabel,
  shortMonth,
  listMonths,
  currentMonthKey,
  type Payment,
} from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · StockVel-RSA" },
      { name: "description", content: "Mark members paid or unpaid for the month and see it on the shared ledger instantly." },
    ],
  }),
  component: DashboardPage,
});

const fmt = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0 });
const fmtCents = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2 });

function DashboardPage() {
  const state = useStokvel();
  const months = useMemo(() => listMonths(state, 6), [state]);
  const [month, setMonth] = useState<string>(currentMonthKey());

  const group = state.group;

  const paymentsByMember = useMemo(() => {
    const map = new Map<string, Payment>();
    for (const p of state.payments) if (p.month === month) map.set(p.memberId, p);
    return map;
  }, [state.payments, month]);

  const paid = paymentsByMember.size;
  const total = state.members.length;
  const expected = (group?.contribution ?? 0) * total;
  const recorded = (group?.contribution ?? 0) * paid;
  const pct = expected ? Math.round((recorded / expected) * 100) : 0;

  if (!group) {
    return (
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        <section className="container-edit py-16">
          <Reveal>
            <p className="eyebrow">No group yet</p>
            <h1 className="mt-3 text-[32px] md:text-[44px] font-semibold">Create your stokvel to get started.</h1>
            <Link to="/create" className="btn-stamp btn-aloe mt-6 inline-flex">Create a group →</Link>
          </Reveal>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      <section className="border-b-2 border-ink">
        <div className="container-edit py-8 md:py-12">
          <Reveal>
            <p className="eyebrow">Group dashboard</p>
            <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-[34px] md:text-[48px] font-semibold leading-[1.05]">{group.name}</h1>
                <p className="mt-2 num text-[13px] text-ink/60">
                  Treasurer · {group.treasurer} · Invite code <span className="font-semibold tracking-widest">{group.inviteCode}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/upload" className="btn-stamp btn-aloe h-12 text-[14px] px-5">Upload POP</Link>
                <Link to="/reports" className="btn-stamp btn-ghost h-12 text-[14px] px-5">Monthly PDF</Link>
              </div>
            </div>
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

      {/* KPI strip */}
      <section className="border-b-2 border-ink">
        <div className="container-edit grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule">
          {[
            { k: "Members", v: total.toString(), s: `${paid} paid · ${total - paid} unpaid` },
            { k: "Recorded this month", v: fmt.format(recorded), s: `Expected ${fmt.format(expected)}` },
            { k: "Month progress", v: `${pct}%`, s: monthLabel(month) },
            { k: "Per member", v: fmt.format(group.contribution), s: "Monthly contribution" },
          ].map((s, i) => (
            <Reveal key={s.k} delay={i * 60} className="bg-paper p-6 md:p-7">
              <p className="num eyebrow text-ink/60">{s.k}</p>
              <p className="mt-3 text-[26px] md:text-[32px] font-semibold leading-none num">{s.v}</p>
              <p className="mt-3 text-[13px] text-ink/65 num">{s.s}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mark paid / unpaid */}
      <section>
        <div className="container-edit py-10 md:py-14">
          <Reveal>
            <div className="flex items-end justify-between gap-3 mb-5">
              <div>
                <p className="eyebrow">Mark members paid · {monthLabel(month)}</p>
                <h2 className="mt-2 text-[24px] md:text-[28px] font-semibold">
                  Tick a row when a member has paid.
                </h2>
              </div>
              <Link to="/ledger" className="hidden md:inline text-[14px] font-medium text-aloe underline underline-offset-4 decoration-2">
                Full ledger →
              </Link>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="panel">
              <div className="px-5 py-3 border-b-2 border-ink bg-paper flex items-center gap-4">
                <div className="flex-1 h-2 bg-rule">
                  <div className="h-full bg-aloe transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="num text-[13px] font-semibold shrink-0">{pct}% · {fmtCents.format(recorded)}</span>
              </div>

              <ul>
                {state.members.map((m) => {
                  const p = paymentsByMember.get(m.id);
                  const isPaid = !!p;
                  return (
                    <li
                      key={m.id}
                      className="grid grid-cols-12 items-center gap-3 px-4 md:px-5 py-3 border-b border-rule last:border-0 hover:bg-paper"
                    >
                      <div className="col-span-7 md:col-span-6 flex items-center gap-3 min-w-0">
                        <span className="shrink-0 w-10 h-10 bg-aloe-soft text-aloe font-mono font-semibold text-[13px] inline-flex items-center justify-center border border-aloe/20">
                          {m.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-[15px] truncate">{m.name}</p>
                          <p className="num text-[12px] text-ink/55 truncate">
                            {p ? `${p.method} · REF ${p.ref}` : "No payment yet"}
                          </p>
                        </div>
                      </div>
                      <div className="hidden md:block md:col-span-3 num text-[14px] text-ink/70">
                        {isPaid ? fmtCents.format(p!.amount) : <span className="text-ink/40">—</span>}
                      </div>
                      <div className="col-span-5 md:col-span-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => store.setPaid(m.id, month, !isPaid)}
                          aria-pressed={isPaid}
                          className={`h-12 px-4 border-2 text-[13px] font-semibold inline-flex items-center gap-2 transition-colors ${
                            isPaid
                              ? "bg-aloe text-paper border-aloe"
                              : "bg-paper text-ink border-ink/30 hover:border-ink"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 inline-flex items-center justify-center border-2 ${
                              isPaid ? "bg-paper text-aloe border-paper" : "border-ink/40"
                            }`}
                          >
                            {isPaid ? "✓" : ""}
                          </span>
                          {isPaid ? "Paid" : "Mark paid"}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="px-5 py-3 border-t-2 border-ink bg-paper flex items-center justify-between">
                <span className="num text-[12px] text-ink/60">UPDATES INSTANTLY · VISIBLE TO ALL MEMBERS</span>
                <Link to="/ledger" className="num text-[12px] font-semibold text-aloe">VIEW LEDGER →</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
