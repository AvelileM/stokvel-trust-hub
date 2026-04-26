import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing · TrustVel" },
      { name: "description", content: "Free for small stokvels. Affordable premium for groups that need more reporting and admin power." },
    ],
  }),
  component: PricingPage,
});

const TIERS = [
  {
    name: "Inkululeko",
    tag: "Free forever",
    price: "R 0",
    cadence: "/ group / month",
    blurb: "For small family stokvels and savings clubs starting out.",
    features: [
      "Up to 15 members",
      "Transparency Ledger",
      "POP upload & verification",
      "Monthly PDF statement",
      "SMS reminders (5 / month)",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Isibindi",
    tag: "Most popular",
    price: "R 199",
    cadence: "/ group / month",
    blurb: "For active stokvels with regular cycles, payouts, and audits.",
    features: [
      "Unlimited members",
      "Multi-admin approvals",
      "Advanced reports & CSV exports",
      "Activity log & audit trail",
      "Unlimited SMS & WhatsApp",
      "Member voting & polls",
    ],
    cta: "Start 30-day trial",
    highlight: true,
  },
  {
    name: "Ubuntu",
    tag: "For burial societies & churches",
    price: "Talk to us",
    cadence: "Custom pricing",
    blurb: "White-label and group-buying access for large communities.",
    features: [
      "Everything in Isibindi",
      "White-label branding",
      "Retail group-buying access",
      "Funeral cover referrals",
      "Dedicated relationship manager",
    ],
    cta: "Book a call",
    highlight: false,
  },
];

const FAQ = [
  { q: "Do you ever hold our money?", a: "No. TrustVel never receives, holds, or transfers your contributions. Members continue to pay each other directly via EFT, cash, or bank transfer. We only record." },
  { q: "What happens if our internet is bad?", a: "The app is built for low-data conditions. Statements can be downloaded as PDF and printed. Your records are safe even if a phone breaks." },
  { q: "Can older members use it?", a: "Yes. Buttons are large, contrast is high, and the most-used actions (upload POP, view ledger) are one tap away. No hidden menus." },
  { q: "Can we cancel anytime?", a: "Yes — cancel any month. You keep all your records and can export everything as PDF or CSV before you go." },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      <section className="border-b-2 border-ink">
        <div className="container-edit py-12 md:py-20 text-center">
          <Reveal>
            <p className="eyebrow">Pricing</p>
            <h1 className="mt-4 text-[40px] md:text-[64px] font-semibold leading-[1.05] max-w-3xl mx-auto">
              Free for small groups.<br /> Fair for the rest.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-[17px] md:text-[19px] text-ink/75 max-w-2xl mx-auto">
              We charge per group, not per member. No hidden fees. No transaction
              percentages — because we never touch the transaction.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="container-edit py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule">
          {TIERS.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 100}
              className={`p-7 md:p-8 flex flex-col ${t.highlight ? "bg-ink text-paper" : "bg-paper text-ink"}`}
            >
              <div className="flex items-center justify-between">
                <p className={`eyebrow ${t.highlight ? "text-brass" : "text-aloe"}`}>{t.name}</p>
                {t.highlight && (
                  <span className="num text-[10px] uppercase tracking-wider bg-brass text-ink px-2 py-1 font-semibold">{t.tag}</span>
                )}
              </div>
              <p className={`mt-3 text-[15px] ${t.highlight ? "text-paper/75" : "text-ink/70"}`}>{t.blurb}</p>
              <div className="mt-6 flex items-baseline gap-2">
                <p className="num text-[44px] font-semibold leading-none">{t.price}</p>
                <p className={`num text-[13px] ${t.highlight ? "text-paper/60" : "text-ink/55"}`}>{t.cadence}</p>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px]">
                    <span className={`shrink-0 mt-1 w-4 h-4 inline-flex items-center justify-center ${t.highlight ? "text-brass" : "text-aloe"}`}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/dashboard"
                className={`btn-stamp mt-8 ${t.highlight ? "btn-aloe" : "btn-ghost"}`}
              >
                {t.cta}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="container-edit py-16 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow">Common questions</p>
              <h2 className="mt-4 text-[32px] md:text-[40px] font-semibold leading-tight">
                Honest answers,<br /> in plain language.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <div className="rule-thick">
              {FAQ.map((f, i) => (
                <Reveal key={f.q} delay={i * 80} className="border-b border-ink py-7">
                  <h3 className="text-[20px] font-semibold">{f.q}</h3>
                  <p className="mt-3 text-[16px] text-ink/75 leading-relaxed max-w-2xl">{f.a}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
