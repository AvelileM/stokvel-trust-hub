import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { LedgerRow } from "@/components/LedgerRow";
import { LEDGER, GROUP } from "@/lib/mock-data";
import heroImg from "@/assets/hero-stokvel.jpg";
import grandmaImg from "@/assets/grandmother-phone.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrustVel · The digital ledger for Mzansi stokvels" },
      { name: "description", content: "TrustVel records every stokvel contribution into a shared, undeniable ledger. We never touch your money — your records stay straight, your group stays together." },
      { property: "og:title", content: "TrustVel · The digital ledger for Mzansi stokvels" },
      { property: "og:description", content: "Replace the A4 counter book and lost WhatsApp receipts with a transparent record everyone can see." },
    ],
  }),
  component: HomePage,
});

const fmt = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2 });

function HomePage() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-ink">
        <div className="container-edit pt-12 md:pt-20 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-6 xl:col-span-7">
            <Reveal>
              <p className="eyebrow">The digital ledger for Mzansi stokvels</p>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-5 text-[44px] sm:text-[56px] md:text-[72px] xl:text-[80px] font-semibold leading-[1.02]">
                Keep the record straight.<br />
                Keep the group's <span className="ink-underline">trust</span>.
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-7 text-[18px] md:text-[20px] leading-[1.55] text-ink/80 max-w-[520px]">
                Replace the A4 counter book and lost WhatsApp receipts with a shared
                record everyone can see. Your money stays in your bank — your records
                stay undeniable.
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link to="/dashboard" className="btn-stamp btn-aloe">
                  Start your group ledger
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M3 9h12m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                </Link>
                <Link to="/ledger" className="btn-stamp btn-ghost">See a live ledger</Link>
              </div>
            </Reveal>
            <Reveal delay={480}>
              <div className="mt-10 flex items-center gap-6 text-[13px] num text-ink/60">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-aloe" /> NO MONEY CUSTODY
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-brass" /> WORKS ON 3G
                </span>
                <span className="hidden sm:inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-ink" /> POPIA COMPLIANT
                </span>
              </div>
            </Reveal>
          </div>

          {/* Ledger artifact */}
          <div className="lg:col-span-6 xl:col-span-5 relative lg:-mr-6 xl:-mr-12">
            <Reveal delay={500}>
              <div className="panel">
                <div className="flex items-center justify-between px-5 py-3.5 border-b-2 border-ink bg-paper">
                  <div>
                    <p className="eyebrow">Transparency Ledger</p>
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
                  <span className="num text-[12px] text-ink/60">LAST SYNCED · 2 MIN AGO</span>
                  <span className="num text-[12px] text-aloe font-semibold">↓ DOWNLOAD PDF</span>
                </div>
              </div>
            </Reveal>

            {/* Chaos vs order: WhatsApp card */}
            <Reveal delay={700}>
              <div className="hidden md:block absolute -bottom-10 -left-6 lg:-left-10 w-[280px] bg-white border-2 border-dashed border-destructive p-4 shadow-[6px_6px_0_0_var(--ink)]">
                <p className="num text-[10px] uppercase tracking-wider text-destructive font-semibold">Group chat · 47 unread</p>
                <p className="mt-2 text-[14px] leading-snug">
                  "Did Sipho pay for October? I scrolled but I can't find the slip 😩"
                </p>
                <p className="mt-2 num text-[11px] text-ink/50">Mam' Beauty · 13:42</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="border-b-2 border-ink">
        <div className="container-edit py-16 md:py-24">
          <Reveal>
            <p className="eyebrow">The chaos we replace</p>
            <h2 className="mt-4 text-[32px] md:text-[44px] font-semibold max-w-3xl">
              The treasurer's stress is real.<br className="hidden md:inline" /> The group's doubt is louder.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t-2 border-ink">
            {[
              { n: "01", t: "Lost POP screenshots", d: "Receipts vanish in a 200-message WhatsApp chat. Nobody can find them when it matters." },
              { n: "02", t: "\"Did she pay?\" arguments", d: "Members accuse each other every month. The treasurer becomes the referee." },
              { n: "03", t: "One A4 book, one risk", d: "If the counter book is lost, stained, or stolen — the whole record is gone." },
              { n: "04", t: "Excel spaghetti", d: "Spreadsheets that only the treasurer can read. No transparency, no trust." },
            ].map((item, i) => (
              <Reveal
                key={item.n}
                delay={i * 80}
                className="p-6 md:p-7 border-b-2 md:border-b-0 md:border-r-2 border-ink last:border-r-0 last:border-b-0 bg-paper"
              >
                <p className="num eyebrow text-ink/50">{item.n}</p>
                <h3 className="mt-3 text-[20px] font-semibold leading-tight">{item.t}</h3>
                <p className="mt-3 text-[15px] text-ink/75 leading-relaxed">{item.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* THE CORE RULE — no money */}
      <section className="bg-ink text-paper border-b-2 border-ink">
        <div className="container-edit py-20 md:py-32 text-center">
          <Reveal>
            <p className="eyebrow text-brass">The one rule that matters</p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mt-6 text-[36px] sm:text-[52px] md:text-[72px] font-semibold leading-[1.05] max-w-5xl mx-auto">
              We record the money.<br />
              <span className="text-brass">We never touch the money.</span>
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-8 text-[17px] md:text-[19px] text-paper/75 max-w-2xl mx-auto leading-relaxed">
              Members keep paying via EFT, cash, or bank transfer — exactly like before.
              TrustVel only keeps the receipts in one shared place that nobody can edit alone.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-paper/15 max-w-3xl mx-auto border border-paper/15">
              {[
                { k: "Wallets", v: "None" },
                { k: "Custody", v: "Zero" },
                { k: "Your bank", v: "Unchanged" },
              ].map((s) => (
                <div key={s.k} className="bg-ink p-6">
                  <p className="num text-[11px] uppercase tracking-wider text-paper/60">{s.k}</p>
                  <p className="mt-2 text-[28px] font-semibold text-paper">{s.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b-2 border-ink">
        <div className="container-edit py-16 md:py-24">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-4 text-[32px] md:text-[44px] font-semibold">Three steps. The same EFT you already use.</h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule">
            {[
              {
                n: "01",
                t: "Member pays the treasurer",
                d: "Same as always — EFT, bank transfer, or cash at the next meeting. Nothing changes about how money moves.",
              },
              {
                n: "02",
                t: "Member uploads the POP",
                d: "One tap to attach the bank slip or photo. Auto-tagged with date, amount, and reference number.",
              },
              {
                n: "03",
                t: "Admin verifies. Group sees it.",
                d: "A treasurer ticks the row. The verified stamp appears for every member, instantly.",
              },
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

      {/* DOCUMENTARY IMAGE BREAK + Trust features */}
      <section className="border-b-2 border-ink">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6 relative">
            <img
              src={heroImg}
              alt="Hands of stokvel members exchanging cash and writing in a hardcover counter book"
              className="w-full h-full object-cover aspect-[4/5] lg:aspect-auto lg:absolute lg:inset-0"
              loading="lazy"
            />
          </div>
          <div className="lg:col-span-6 bg-paper p-8 md:p-12 lg:p-16 border-t-2 lg:border-t-0 lg:border-l-2 border-ink">
            <Reveal>
              <p className="eyebrow">Built for trust</p>
              <h2 className="mt-4 text-[32px] md:text-[42px] font-semibold leading-tight">
                Every change is signed, stamped, and visible to all.
              </h2>
            </Reveal>
            <div className="mt-10 space-y-6">
              {[
                { t: "Multi-admin approvals", d: "Big edits — like changing a verified payment — require two trustees." },
                { t: "Activity log", d: "Every action keeps a timestamp and the name of the person who did it." },
                { t: "Member voting", d: "Decisions get put to the group, not whispered in the chat." },
                { t: "Offline-ready PDF", d: "Download the full ledger any month. Works without data, prints on A4." },
              ].map((f, i) => (
                <Reveal key={f.t} delay={i * 60} className="flex gap-4 pb-6 border-b border-rule last:border-0">
                  <span className="num eyebrow text-aloe shrink-0 mt-1">0{i + 1}</span>
                  <div>
                    <h3 className="text-[18px] font-semibold">{f.t}</h3>
                    <p className="mt-1.5 text-[15px] text-ink/75 leading-relaxed">{f.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="border-b-2 border-ink">
        <div className="container-edit py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Built for the people who hold it together</p>
              <h2 className="mt-4 text-[32px] md:text-[42px] font-semibold leading-tight">
                For the treasurer who deserves a break.
              </h2>
              <p className="mt-6 text-[17px] text-ink/75 leading-relaxed max-w-md">
                We designed every screen for budget Android phones, low-data conditions,
                and members aged 16 to 76. Big buttons. High contrast. Zero hidden menus.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={150}>
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
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="container-edit py-20 md:py-28 text-center">
          <Reveal>
            <p className="eyebrow">Ready when your group is</p>
            <h2 className="mt-5 text-[36px] md:text-[56px] font-semibold leading-[1.05] max-w-3xl mx-auto">
              Start with one cycle. See the trust come back.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard" className="btn-stamp btn-aloe">Open the dashboard</Link>
              <Link to="/pricing" className="btn-stamp btn-ghost">See pricing</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
