import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { LedgerRow } from "@/components/LedgerRow";
import { LEDGER, GROUP } from "@/lib/mock-data";
import grandmaImg from "@/assets/grandmother-phone.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StockVel-RSA · Track stokvel payments. Stay trusted." },
      { name: "description", content: "We help South African stokvel groups stay organised and trusted. Track who paid, share one ledger, download monthly statements. We never hold your money." },
      { property: "og:title", content: "StockVel-RSA · Track stokvel payments. Stay trusted." },
      { property: "og:description", content: "Simple records. Less conflict. We never hold your money." },
    ],
  }),
  component: HomePage,
});

const fmt = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2 });

function HomePage() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      {/* HERO — 5-second clarity */}
      <section className="relative overflow-hidden border-b-2 border-ink">
        <div className="container-edit pt-12 md:pt-20 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-6 xl:col-span-7">
            <Reveal>
              <p className="eyebrow">Stokvel record-keeping · Made in Mzansi</p>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-5 text-[44px] sm:text-[56px] md:text-[68px] xl:text-[76px] font-semibold leading-[1.02]">
                Track stokvel payments.<br />
                Keep the <span className="ink-underline">trust</span>.
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-7 text-[18px] md:text-[20px] leading-[1.55] text-ink/80 max-w-[540px]">
                StockVel-RSA helps your group track who paid each month — in one
                shared ledger everyone can see. <strong className="text-ink">We never hold your money.</strong>
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link to="/create" className="btn-stamp btn-aloe">
                  Create your group
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M3 9h12m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                </Link>
                <Link to="/ledger" className="btn-stamp btn-ghost">See an example ledger</Link>
              </div>
            </Reveal>
            <Reveal delay={480}>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] num text-ink/60">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-aloe" /> NO MONEY HELD
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-brass" /> WORKS ON 3G
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-ink" /> FREE TO START
                </span>
              </div>
            </Reveal>
          </div>

          {/* Live ledger artifact */}
          <div className="lg:col-span-6 xl:col-span-5 relative lg:-mr-6 xl:-mr-12">
            <Reveal delay={500}>
              <div className="panel">
                <div className="flex items-center justify-between px-5 py-3.5 border-b-2 border-ink bg-paper">
                  <div>
                    <p className="eyebrow">Shared ledger</p>
                    <p className="text-[15px] font-semibold mt-1">{GROUP.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="num text-[11px] uppercase tracking-wider text-ink/60">{GROUP.cycle}</p>
                    <p className="num text-[15px] font-semibold mt-1">{fmt.format(GROUP.groupTotal)} <span className="text-ink/50 text-[12px]">/ {fmt.format(GROUP.expectedTotal)}</span></p>
                  </div>
                </div>
                <div>
                  {LEDGER.slice(0, 5).map((row) => (
                    <LedgerRow key={row.id} row={row} dense />
                  ))}
                </div>
                <div className="px-5 py-3 border-t-2 border-ink bg-paper flex items-center justify-between">
                  <span className="num text-[12px] text-ink/60">VISIBLE TO ALL MEMBERS</span>
                  <span className="num text-[12px] text-aloe font-semibold">↓ MONTHLY PDF</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CORE PROMISE — no money */}
      <section className="bg-ink text-paper border-b-2 border-ink">
        <div className="container-edit py-20 md:py-28 text-center">
          <Reveal>
            <p className="eyebrow text-brass">The one rule that matters</p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mt-6 text-[36px] sm:text-[48px] md:text-[64px] font-semibold leading-[1.05] max-w-4xl mx-auto">
              We record the money.<br />
              <span className="text-brass">We never hold the money.</span>
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-8 text-[17px] md:text-[19px] text-paper/75 max-w-2xl mx-auto leading-relaxed">
              Members keep paying the treasurer like they always have — EFT, cash,
              bank transfer. StockVel-RSA only keeps the receipts in one shared place
              everyone can see.
            </p>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS — 3 steps */}
      <section className="border-b-2 border-ink">
        <div className="container-edit py-16 md:py-24">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-4 text-[32px] md:text-[44px] font-semibold">Three steps. Nothing complicated.</h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule">
            {[
              { n: "01", t: "Create your group", d: "Add your stokvel name, monthly contribution, and the members. Takes 3 minutes." },
              { n: "02", t: "Mark members paid", d: "Each month, tick who has paid. Members upload their proof of payment from their phone." },
              { n: "03", t: "Everyone sees the same ledger", d: "No more 'did she pay?' arguments. Download a monthly PDF for the records." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 100} className="bg-paper p-7 md:p-9">
                <p className="num text-[40px] font-semibold text-aloe leading-none">{s.n}</p>
                <h3 className="mt-5 text-[22px] font-semibold leading-tight">{s.t}</h3>
                <p className="mt-3 text-[15px] text-ink/75 leading-relaxed">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET — MVP only */}
      <section className="border-b-2 border-ink">
        <div className="container-edit py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">What you get</p>
              <h2 className="mt-4 text-[32px] md:text-[42px] font-semibold leading-tight">
                Just enough to keep your group honest.
              </h2>
              <p className="mt-6 text-[17px] text-ink/75 leading-relaxed max-w-md">
                No insurance. No loans. No funeral cover. No fancy analytics.
                Just the basics — done well, on a phone.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <div className="rule-thick">
              {[
                { t: "Create a stokvel group", d: "Name it, set the monthly contribution, add members." },
                { t: "Mark members paid / unpaid", d: "Tick a row each month. Simple as a counter book." },
                { t: "Shared transparency ledger", d: "Every member sees the same record. No secrets." },
                { t: "Upload proof of payment", d: "One tap from a phone. Bank slip or photo." },
                { t: "Monthly PDF statement", d: "Download and print for meetings or your records." },
              ].map((f, i) => (
                <Reveal key={f.t} delay={i * 60} className="flex gap-4 py-5 border-b border-ink last:border-0">
                  <span className="num eyebrow text-aloe shrink-0 mt-1">0{i + 1}</span>
                  <div>
                    <h3 className="text-[18px] font-semibold">{f.t}</h3>
                    <p className="mt-1 text-[15px] text-ink/75 leading-relaxed">{f.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="border-b-2 border-ink">
        <div className="container-edit py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <img
                src={grandmaImg}
                alt="A grandmother carefully reviewing her stokvel ledger on a smartphone"
                className="w-full aspect-[4/3] object-cover border-2 border-ink"
                loading="lazy"
                width={1024}
                height={1024}
              />
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow">Built for everyone in the group</p>
              <h2 className="mt-4 text-[32px] md:text-[42px] font-semibold leading-tight">
                Big buttons. Plain words.<br /> Easy for older members.
              </h2>
              <p className="mt-6 text-[17px] text-ink/75 leading-relaxed max-w-md">
                Designed for budget Android phones, low-data conditions,
                and members aged 16 to 76. No hidden menus. No jargon.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="container-edit py-20 md:py-28 text-center">
          <Reveal>
            <p className="eyebrow">Ready when your group is</p>
            <h2 className="mt-5 text-[36px] md:text-[56px] font-semibold leading-[1.05] max-w-3xl mx-auto">
              Simple records.<br /> Less conflict.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/create" className="btn-stamp btn-aloe">Create your group · Free</Link>
              <Link to="/dashboard" className="btn-stamp btn-ghost">See the dashboard</Link>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-6 num text-[12px] uppercase tracking-wider text-ink/55">No card required · Free for groups under 15 members</p>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
