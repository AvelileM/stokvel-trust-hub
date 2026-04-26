import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import {
  useStokvel,
  monthLabel,
  shortMonth,
  listMonths,
  currentMonthKey,
  formatDate,
} from "@/lib/store";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Monthly PDF statement · StockVel-RSA" },
      { name: "description", content: "Pick a month and download or print a clean PDF statement for your stokvel records." },
    ],
  }),
  component: ReportsPage,
});

const fmt = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2 });
const fmt0 = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0 });

function ReportsPage() {
  const state = useStokvel();
  const months = useMemo(() => listMonths(state, 12), [state]);
  const [month, setMonth] = useState<string>(currentMonthKey());
  const printRef = useRef<HTMLDivElement>(null);

  const group = state.group;
  const rows = useMemo(() => {
    const byMember = new Map(state.payments.filter((p) => p.month === month).map((p) => [p.memberId, p]));
    return state.members.map((m) => ({
      member: m,
      payment: byMember.get(m.id),
    }));
  }, [state, month]);

  const paid = rows.filter((r) => r.payment).length;
  const recorded = rows.reduce((s, r) => s + (r.payment?.amount ?? 0), 0);
  const expected = (group?.contribution ?? 0) * state.members.length;
  const pct = expected ? Math.round((recorded / expected) * 100) : 0;

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleDownload = () => {
    // Generate a simple PDF on the fly using a single-page printable HTML.
    if (typeof window === "undefined") return;
    const html = buildPrintableHTML({
      groupName: group?.name ?? "Stokvel",
      month: monthLabel(month),
      contribution: group?.contribution ?? 0,
      treasurer: group?.treasurer ?? "—",
      inviteCode: group?.inviteCode ?? "—",
      rows: rows.map((r) => ({
        name: r.member.name,
        ref: r.payment?.ref ?? "—",
        method: r.payment?.method ?? "—",
        amount: r.payment?.amount ?? 0,
        date: r.payment ? formatDate(r.payment.date) : "—",
        status: r.payment?.status ?? "missing",
      })),
      paid,
      total: state.members.length,
      recorded,
      expected,
      pct,
    });
    const w = window.open("", "_blank", "width=900,height=1200");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      <section className="border-b-2 border-ink print:hidden">
        <div className="container-edit py-8 md:py-12">
          <Reveal>
            <p className="eyebrow">Monthly statement · {group?.name ?? "Your group"}</p>
            <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h1 className="text-[34px] md:text-[48px] font-semibold leading-[1.05]">
                One-tap PDF for the records.
              </h1>
              <div className="flex flex-wrap gap-2">
                <button onClick={handlePrint} className="btn-stamp btn-ghost h-14 px-6 text-[15px]">🖨 Print</button>
                <button onClick={handleDownload} className="btn-stamp btn-aloe h-14 px-6 text-[15px]">↓ Download PDF</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Month selector */}
      <section className="border-b-2 border-ink bg-white print:hidden">
        <div className="container-edit py-4 flex items-center gap-3 overflow-x-auto">
          <span className="num text-[11px] uppercase tracking-wider text-ink/60 shrink-0">Pick month:</span>
          <div className="flex gap-2">
            {months.map((m) => {
              const active = m === month;
              return (
                <button
                  key={m}
                  onClick={() => setMonth(m)}
                  className={`shrink-0 h-12 px-4 border-2 num text-[13px] font-medium transition-colors ${
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

      {/* Printable preview */}
      <section>
        <div className="container-edit py-8 md:py-12">
          <Reveal>
            <div ref={printRef} className="panel print:border-0 max-w-3xl mx-auto print:max-w-none">
              <div className="px-6 md:px-8 py-6 border-b-2 border-ink">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="num text-[11px] uppercase tracking-wider text-ink/55">StockVel-RSA · Monthly statement</p>
                    <h2 className="mt-2 text-[24px] md:text-[28px] font-semibold leading-tight">{group?.name ?? "Your group"}</h2>
                    <p className="mt-1 num text-[13px] text-ink/65">
                      {monthLabel(month)} · Treasurer {group?.treasurer ?? "—"} · Code {group?.inviteCode ?? "—"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="num text-[11px] uppercase tracking-wider text-ink/55">Recorded</p>
                    <p className="mt-1 num text-[22px] font-semibold">{fmt.format(recorded)}</p>
                    <p className="num text-[12px] text-ink/55">of {fmt0.format(expected)} expected · {pct}%</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b-2 border-ink">
                {[
                  { k: "Members", v: state.members.length.toString() },
                  { k: "Paid", v: paid.toString() },
                  { k: "Unpaid", v: (state.members.length - paid).toString() },
                ].map((s) => (
                  <div key={s.k} className="p-5 border-r border-rule last:border-0">
                    <p className="num text-[10px] uppercase tracking-wider text-ink/55">{s.k}</p>
                    <p className="mt-2 num text-[22px] font-semibold">{s.v}</p>
                  </div>
                ))}
              </div>

              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-paper border-b-2 border-ink">
                    <th className="text-left px-5 py-3 num text-[11px] uppercase tracking-wider text-ink/60">Member</th>
                    <th className="text-left px-5 py-3 num text-[11px] uppercase tracking-wider text-ink/60">Ref</th>
                    <th className="text-left px-5 py-3 num text-[11px] uppercase tracking-wider text-ink/60">Method</th>
                    <th className="text-right px-5 py-3 num text-[11px] uppercase tracking-wider text-ink/60">Amount</th>
                    <th className="text-right px-5 py-3 num text-[11px] uppercase tracking-wider text-ink/60">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ member, payment }) => (
                    <tr key={member.id} className="border-b border-rule">
                      <td className="px-5 py-3 font-medium">{member.name}</td>
                      <td className="px-5 py-3 num text-ink/70">{payment?.ref ?? "—"}</td>
                      <td className="px-5 py-3 num text-ink/70">{payment?.method ?? "—"}</td>
                      <td className="px-5 py-3 num text-right">{payment ? fmt.format(payment.amount) : "—"}</td>
                      <td className="px-5 py-3 text-right num text-[12px] uppercase">
                        {payment ? (payment.status === "verified" ? "Paid" : "Pending") : "Unpaid"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-6 md:px-8 py-5 border-t-2 border-ink flex items-center justify-between">
                <p className="num text-[11px] uppercase tracking-wider text-ink/55">
                  Generated {new Date().toLocaleDateString("en-ZA")} · StockVel-RSA never holds your money
                </p>
                <p className="num text-[11px] uppercase tracking-wider text-ink/55">Page 1 / 1</p>
              </div>
            </div>
          </Reveal>

          <div className="mt-6 flex flex-wrap gap-3 justify-center print:hidden">
            <button onClick={handleDownload} className="btn-stamp btn-aloe h-14 px-7 text-[15px]">↓ Download PDF</button>
            <button onClick={handlePrint} className="btn-stamp btn-ghost h-14 px-7 text-[15px]">🖨 Print</button>
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* Print CSS */}
      <style>{`
        @media print {
          body { background: #fff; }
          header, footer { display: none !important; }
          .print\\:hidden { display: none !important; }
          .panel { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}

type PrintRow = {
  name: string;
  ref: string;
  method: string;
  amount: number;
  date: string;
  status: "verified" | "pending" | "missing";
};

function buildPrintableHTML(opts: {
  groupName: string;
  month: string;
  contribution: number;
  treasurer: string;
  inviteCode: string;
  rows: PrintRow[];
  paid: number;
  total: number;
  recorded: number;
  expected: number;
  pct: number;
}) {
  const z = (n: number) => `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const statusLabel = (s: PrintRow["status"]) => s === "verified" ? "Paid" : s === "pending" ? "Pending" : "Unpaid";
  const today = new Date().toLocaleDateString("en-ZA");
  return `<!doctype html><html><head><meta charset="utf-8"/>
<title>${opts.groupName} — ${opts.month} — StockVel-RSA</title>
<style>
  *{box-sizing:border-box} body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#0A192F;margin:0;padding:32px;}
  .head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0A192F;padding-bottom:18px;margin-bottom:18px}
  h1{font-size:22px;margin:6px 0 2px} .meta{font-size:12px;color:#555;font-family:ui-monospace,Menlo,monospace}
  .eyebrow{font-family:ui-monospace,Menlo,monospace;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#666}
  .kpi{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #0A192F;border-bottom:none;margin-bottom:0}
  .kpi>div{padding:12px 16px;border-right:1px solid #ddd}
  .kpi>div:last-child{border-right:0}
  .kpi p{margin:0} .kpi .v{font-size:18px;font-weight:600;font-family:ui-monospace,Menlo,monospace;margin-top:4px}
  table{width:100%;border-collapse:collapse;border:1px solid #0A192F}
  th{background:#F9F8F6;text-align:left;padding:10px 14px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;border-bottom:2px solid #0A192F}
  td{padding:10px 14px;font-size:13px;border-bottom:1px solid #eee}
  td.r,th.r{text-align:right;font-family:ui-monospace,Menlo,monospace}
  .foot{margin-top:18px;display:flex;justify-content:space-between;font-family:ui-monospace,Menlo,monospace;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:.06em}
  .total{font-size:16px;font-weight:600;font-family:ui-monospace,Menlo,monospace;text-align:right}
</style></head><body>
<div class="head">
  <div>
    <div class="eyebrow">StockVel-RSA · Monthly statement</div>
    <h1>${escapeHTML(opts.groupName)}</h1>
    <div class="meta">${escapeHTML(opts.month)} · Treasurer ${escapeHTML(opts.treasurer)} · Code ${escapeHTML(opts.inviteCode)}</div>
  </div>
  <div style="text-align:right">
    <div class="eyebrow">Recorded</div>
    <div class="total">${z(opts.recorded)}</div>
    <div class="meta">of ${z(opts.expected)} · ${opts.pct}%</div>
  </div>
</div>
<div class="kpi">
  <div><p class="eyebrow">Members</p><p class="v">${opts.total}</p></div>
  <div><p class="eyebrow">Paid</p><p class="v">${opts.paid}</p></div>
  <div><p class="eyebrow">Unpaid</p><p class="v">${opts.total - opts.paid}</p></div>
</div>
<table>
  <thead><tr>
    <th>Member</th><th>Ref</th><th>Method</th><th class="r">Amount</th><th class="r">Status</th>
  </tr></thead>
  <tbody>
    ${opts.rows.map(r => `<tr>
      <td>${escapeHTML(r.name)}</td>
      <td>${escapeHTML(r.ref)}</td>
      <td>${escapeHTML(r.method)}</td>
      <td class="r">${r.amount ? z(r.amount) : "—"}</td>
      <td class="r">${statusLabel(r.status)}</td>
    </tr>`).join("")}
  </tbody>
</table>
<div class="foot">
  <span>Generated ${today} · StockVel-RSA never holds your money</span>
  <span>Page 1 / 1</span>
</div>
</body></html>`;
}

function escapeHTML(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
