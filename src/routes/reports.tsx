import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { GROUP } from "@/lib/mock-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports · StockVel-RSA" },
      { name: "description", content: "Download monthly PDF statements for your stokvel group." },
    ],
  }),
  component: ReportsPage,
});

const fmt = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0 });

const MONTHS = [
  { m: "October 2025", paid: 9500, expected: 12000, status: "Open" },
  { m: "September 2025", paid: 12000, expected: 12000, status: "Closed" },
  { m: "August 2025", paid: 11500, expected: 12000, status: "Closed" },
  { m: "July 2025", paid: 12000, expected: 12000, status: "Closed" },
  { m: "June 2025", paid: 12000, expected: 12000, status: "Closed" },
  { m: "May 2025", paid: 11000, expected: 12000, status: "Closed" },
];

function ReportsPage() {
  const ytdPaid = MONTHS.reduce((s, x) => s + x.paid, 0);
  const ytdExpected = MONTHS.reduce((s, x) => s + x.expected, 0);
  const maxBar = Math.max(...MONTHS.map((m) => m.expected));

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      <section className="border-b-2 border-ink">
        <div className="container-edit py-10 md:py-14">
          <Reveal>
            <p className="eyebrow">Reports · {GROUP.name}</p>
            <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h1 className="text-[36px] md:text-[52px] font-semibold leading-[1.05]">Statements & exports</h1>
              <div className="flex gap-3">
                <button className="btn-stamp btn-ghost h-12 px-5 text-[14px]">↓ CSV (year)</button>
                <button className="btn-stamp btn-aloe h-12 px-5 text-[14px]">↓ PDF statement</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* YTD strip */}
      <section className="border-b-2 border-ink">
        <div className="container-edit grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule">
          {[
            { k: "YTD recorded", v: fmt.format(ytdPaid) },
            { k: "YTD expected", v: fmt.format(ytdExpected) },
            { k: "Collection rate", v: `${Math.round((ytdPaid / ytdExpected) * 100)}%` },
            { k: "Members active", v: GROUP.members.toString() },
          ].map((s, i) => (
            <Reveal key={s.k} delay={i * 60} className="bg-paper p-6 md:p-7">
              <p className="num eyebrow text-ink/60">{s.k}</p>
              <p className="mt-3 text-[28px] md:text-[34px] font-semibold leading-none num">{s.v}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bar chart of months */}
      <section className="border-b-2 border-ink">
        <div className="container-edit py-12">
          <Reveal>
            <p className="eyebrow">Contribution history</p>
            <h2 className="mt-2 text-[24px] md:text-[28px] font-semibold">Last 6 cycles · paid vs expected</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 panel p-5 md:p-7">
              <div className="grid grid-cols-6 gap-4 md:gap-6 items-end h-[260px]">
                {MONTHS.slice().reverse().map((m) => {
                  const paidH = (m.paid / maxBar) * 100;
                  const expH = (m.expected / maxBar) * 100;
                  return (
                    <div key={m.m} className="flex flex-col items-center justify-end h-full gap-1.5">
                      <div className="relative w-full flex items-end justify-center gap-1.5 h-full">
                        <div className="w-1/2 bg-rule" style={{ height: `${expH}%` }} aria-label={`Expected ${fmt.format(m.expected)}`} />
                        <div className="w-1/2 bg-aloe" style={{ height: `${paidH}%` }} aria-label={`Paid ${fmt.format(m.paid)}`} />
                      </div>
                      <p className="num text-[11px] text-ink/60 text-center leading-tight mt-2">{m.m.split(" ")[0].slice(0, 3)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center gap-5 text-[12px] num">
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 bg-aloe" /> PAID</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 bg-rule" /> EXPECTED</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Months table */}
      <section>
        <div className="container-edit py-12">
          <Reveal>
            <p className="eyebrow">Monthly statements</p>
            <h2 className="mt-2 text-[24px] md:text-[28px] font-semibold">Download any cycle</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-6 panel">
              <div className="grid grid-cols-12 px-5 py-3 border-b-2 border-ink bg-paper num text-[11px] uppercase tracking-wider text-ink/60">
                <p className="col-span-5">Cycle</p>
                <p className="col-span-3 text-right">Paid</p>
                <p className="col-span-2 text-right">Expected</p>
                <p className="col-span-2 text-right">Action</p>
              </div>
              {MONTHS.map((m) => (
                <div key={m.m} className="grid grid-cols-12 items-center px-5 py-4 border-b border-rule last:border-0 hover:bg-paper">
                  <div className="col-span-5">
                    <p className="font-medium text-[15px]">{m.m}</p>
                    <p className="num text-[12px] text-ink/55">{m.status}</p>
                  </div>
                  <p className="col-span-3 num text-right text-[15px] font-semibold">{fmt.format(m.paid)}</p>
                  <p className="col-span-2 num text-right text-[14px] text-ink/65">{fmt.format(m.expected)}</p>
                  <div className="col-span-2 flex justify-end">
                    <button className="num text-[12px] font-semibold text-aloe underline underline-offset-4 decoration-2">↓ PDF</button>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
