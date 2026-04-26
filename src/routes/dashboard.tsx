import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { LedgerRow } from "@/components/LedgerRow";
import { GROUP, LEDGER, ACTIVITY } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · StockVel-RSA" },
      { name: "description", content: "Your stokvel at a glance: who paid, who hasn't, and the shared monthly ledger." },
    ],
  }),
  component: DashboardPage,
});

const fmt = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0 });
const fmtCents = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2 });

function DashboardPage() {
  const pct = Math.round((GROUP.groupTotal / GROUP.expectedTotal) * 100);
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      <section className="border-b-2 border-ink">
        <div className="container-edit py-10 md:py-14">
          <Reveal>
            <p className="eyebrow">Group dashboard · {GROUP.cycle}</p>
            <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h1 className="text-[36px] md:text-[52px] font-semibold leading-[1.05]">{GROUP.name}</h1>
              <div className="flex gap-3">
                <Link to="/upload" className="btn-stamp btn-aloe h-12 text-[14px] px-5">Upload POP</Link>
                <Link to="/reports" className="btn-stamp btn-ghost h-12 text-[14px] px-5">Download statement</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* KPI strip */}
      <section className="border-b-2 border-ink">
        <div className="container-edit grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule">
          {[
            { k: "Members", v: GROUP.members.toString(), s: `${GROUP.paid} paid · ${GROUP.outstanding} unpaid` },
            { k: "Recorded this month", v: fmt.format(GROUP.groupTotal), s: `Expected ${fmt.format(GROUP.expectedTotal)}` },
            { k: "Month progress", v: `${pct}%`, s: `Goal: everyone paid by month-end` },
            { k: "Next statement", v: "01 Nov 2025", s: `Auto-generated PDF` },
          ].map((s, i) => (
            <Reveal key={s.k} delay={i * 60} className="bg-paper p-6 md:p-7">
              <p className="num eyebrow text-ink/60">{s.k}</p>
              <p className="mt-3 text-[28px] md:text-[34px] font-semibold leading-none num">{s.v}</p>
              <p className="mt-3 text-[13px] text-ink/65 num">{s.s}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Progress + Outstanding */}
      <section className="border-b-2 border-ink">
        <div className="container-edit py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="eyebrow">Cycle ledger</p>
                  <h2 className="mt-2 text-[24px] md:text-[28px] font-semibold">October contributions</h2>
                </div>
                <Link to="/ledger" className="text-[14px] font-medium text-aloe underline underline-offset-4 decoration-2">View full ledger →</Link>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="panel">
                <div className="px-5 py-4 border-b-2 border-ink bg-paper flex items-center gap-4">
                  <div className="flex-1 h-2 bg-rule">
                    <div className="h-full bg-aloe" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="num text-[13px] font-semibold">{pct}% · {fmtCents.format(GROUP.groupTotal)}</span>
                </div>
                {LEDGER.slice(0, 7).map((row) => (
                  <LedgerRow key={row.id} row={row} />
                ))}
              </div>
            </Reveal>
          </div>

          {/* Activity */}
          <div className="lg:col-span-5">
            <Reveal delay={150}>
              <p className="eyebrow">Activity log</p>
              <h2 className="mt-2 text-[24px] md:text-[28px] font-semibold">Who did what, when.</h2>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-5 panel-soft">
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="px-5 py-4 border-b border-rule last:border-0">
                    <p className="num text-[11px] uppercase tracking-wider text-ink/55">{a.time}</p>
                    <p className="mt-1.5 text-[15px]"><span className="font-semibold">{a.actor}</span> · {a.action}</p>
                    {a.amount && <p className="mt-1 num text-[14px] text-aloe font-semibold">{a.amount}</p>}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
