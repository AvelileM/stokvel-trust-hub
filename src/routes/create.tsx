import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { store } from "@/lib/store";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create your stokvel · StockVel-RSA" },
      { name: "description", content: "Set up your stokvel group, choose a monthly amount, and invite members in three quick steps." },
    ],
  }),
  component: CreateGroupWizard,
});

type Step = 1 | 2 | 3 | 4;

const PRESETS = [100, 200, 500, 1000, 2000];

function CreateGroupWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  // Step 1
  const [groupName, setGroupName] = useState("");
  const [treasurer, setTreasurer] = useState("");

  // Step 2
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState("");

  // Step 3
  const [members, setMembers] = useState<{ name: string; phone: string }[]>([
    { name: "", phone: "" },
    { name: "", phone: "" },
  ]);

  // Step 4
  const [inviteCode, setInviteCode] = useState<string>("");

  const finalAmount = customAmount ? Number(customAmount) || 0 : amount;
  const filledMembers = members.filter((m) => m.name.trim());

  const canStep1 = groupName.trim().length >= 3 && treasurer.trim().length >= 2;
  const canStep2 = finalAmount > 0;

  const handleCreate = () => {
    const code = store.createGroup({
      name: groupName.trim(),
      contribution: finalAmount,
      treasurer: treasurer.trim(),
      members: filledMembers.map((m) => ({ name: m.name.trim(), phone: m.phone.trim() || undefined })),
    });
    setInviteCode(code);
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b-2 border-ink">
          <div className="container-edit py-8 md:py-12">
            <Reveal>
              <p className="eyebrow">Create a group · Step {Math.min(step, 3)} of 3</p>
              <h1 className="mt-3 text-[32px] md:text-[44px] font-semibold leading-[1.05]">
                {step === 1 && "Name your stokvel."}
                {step === 2 && "Set the monthly amount."}
                {step === 3 && "Invite your members."}
                {step === 4 && "Your group is ready."}
              </h1>
              <Stepper step={step} />
            </Reveal>
          </div>
        </section>

        <section>
          <div className="container-edit py-8 md:py-12 max-w-2xl">
            {step === 1 && (
              <Reveal>
                <div className="panel p-6 md:p-8 space-y-6">
                  <BigField
                    label="Stokvel group name"
                    value={groupName}
                    onChange={setGroupName}
                    placeholder="e.g. Siyakhula Family Stokvel"
                    autoFocus
                  />
                  <BigField
                    label="Your name (treasurer / admin)"
                    value={treasurer}
                    onChange={setTreasurer}
                    placeholder="e.g. Sibongile Dlamini"
                  />
                  <p className="text-[14px] text-ink/65">
                    The treasurer creates the group, marks payments, and downloads statements.
                    You can change this later.
                  </p>
                </div>
                <NavRow
                  back={<Link to="/login" className="btn-stamp btn-ghost h-14 px-5 text-[15px]">← Cancel</Link>}
                  next={
                    <button
                      type="button"
                      disabled={!canStep1}
                      onClick={() => setStep(2)}
                      className="btn-stamp btn-aloe h-14 px-7 text-[16px] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next: Monthly amount →
                    </button>
                  }
                />
              </Reveal>
            )}

            {step === 2 && (
              <Reveal>
                <div className="panel p-6 md:p-8 space-y-7">
                  <div>
                    <p className="block eyebrow text-ink/70 mb-3">How much does each member pay each month?</p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {PRESETS.map((p) => {
                        const active = !customAmount && amount === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => { setAmount(p); setCustomAmount(""); }}
                            className={`h-16 border-2 num text-[18px] font-semibold transition-colors ${
                              active ? "bg-ink text-paper border-ink" : "bg-paper border-ink/15 hover:border-ink"
                            }`}
                          >
                            R{p}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block eyebrow text-ink/70 mb-2">Or enter a custom amount</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 border-2 border-r-0 border-ink num text-[18px] bg-paper">R</span>
                      <input
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9]/g, ""))}
                        inputMode="numeric"
                        placeholder="e.g. 750"
                        className="flex-1 h-16 px-4 border-2 border-ink bg-white text-[20px] num outline-none focus:bg-paper"
                      />
                    </div>
                  </div>

                  <div className="bg-aloe-soft border-2 border-aloe p-4">
                    <p className="num text-[12px] uppercase tracking-wider text-aloe">Each member contributes</p>
                    <p className="mt-2 text-[28px] font-semibold num">R{finalAmount.toLocaleString("en-ZA")} <span className="text-[14px] text-ink/60">/ month</span></p>
                  </div>
                </div>
                <NavRow
                  back={<button type="button" onClick={() => setStep(1)} className="btn-stamp btn-ghost h-14 px-5 text-[15px]">← Back</button>}
                  next={
                    <button
                      type="button"
                      disabled={!canStep2}
                      onClick={() => setStep(3)}
                      className="btn-stamp btn-aloe h-14 px-7 text-[16px] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next: Invite members →
                    </button>
                  }
                />
              </Reveal>
            )}

            {step === 3 && (
              <Reveal>
                <div className="panel p-6 md:p-8 space-y-6">
                  <p className="text-[15px] text-ink/75">
                    Add a few members now. You can also share an invite link after this step,
                    so members can add themselves.
                  </p>

                  <div className="space-y-3">
                    {members.map((m, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          value={m.name}
                          onChange={(e) => {
                            const next = [...members];
                            next[i] = { ...next[i], name: e.target.value };
                            setMembers(next);
                          }}
                          placeholder={`Member ${i + 1} name`}
                          className="h-14 px-4 border-2 border-ink/15 focus:border-ink bg-white text-[16px] outline-none"
                        />
                        <input
                          value={m.phone}
                          onChange={(e) => {
                            const next = [...members];
                            next[i] = { ...next[i], phone: e.target.value };
                            setMembers(next);
                          }}
                          inputMode="tel"
                          placeholder="Phone (optional)"
                          className="h-14 px-4 border-2 border-ink/15 focus:border-ink bg-white text-[16px] num outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setMembers([...members, { name: "", phone: "" }])}
                    className="text-aloe font-semibold text-[15px] underline underline-offset-4 decoration-2"
                  >
                    + Add another member
                  </button>

                  <p className="num text-[12px] uppercase tracking-wider text-ink/55">
                    {filledMembers.length} member{filledMembers.length === 1 ? "" : "s"} ready · You'll be added as treasurer
                  </p>
                </div>
                <NavRow
                  back={<button type="button" onClick={() => setStep(2)} className="btn-stamp btn-ghost h-14 px-5 text-[15px]">← Back</button>}
                  next={
                    <button
                      type="button"
                      onClick={handleCreate}
                      className="btn-stamp btn-aloe h-14 px-7 text-[16px]"
                    >
                      Create group ✓
                    </button>
                  }
                />
              </Reveal>
            )}

            {step === 4 && (
              <Reveal>
                <div className="panel">
                  <div className="bg-aloe text-paper px-6 py-4 border-b-2 border-ink flex items-center gap-3">
                    <span className="w-9 h-9 bg-paper text-aloe inline-flex items-center justify-center font-bold text-lg">✓</span>
                    <div>
                      <p className="font-semibold text-[18px]">Group created</p>
                      <p className="text-[13px] text-paper/80 num">{groupName}</p>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 space-y-6">
                    <div>
                      <p className="eyebrow">Share this with your members</p>
                      <p className="mt-2 text-[15px] text-ink/75">
                        Anyone with this link or code can request to join your stokvel.
                      </p>
                    </div>

                    <InviteShare code={inviteCode} groupName={groupName} />

                    <div className="rule-thin pt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => navigate({ to: "/dashboard" })}
                        className="btn-stamp btn-aloe h-14 text-[15px]"
                      >
                        Open dashboard →
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate({ to: "/ledger" })}
                        className="btn-stamp btn-ghost h-14 text-[15px]"
                      >
                        View ledger
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = ["Group", "Amount", "Members"];
  return (
    <div className="mt-6 flex items-center gap-2">
      {items.map((label, i) => {
        const n = (i + 1) as Step;
        const done = step > n || step === 4;
        const active = step === n;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 inline-flex items-center justify-center border-2 num text-[13px] font-semibold ${
                done ? "bg-aloe text-paper border-aloe" : active ? "bg-ink text-paper border-ink" : "bg-paper text-ink/50 border-ink/20"
              }`}
            >
              {done ? "✓" : n}
            </div>
            <span className={`text-[13px] num uppercase tracking-wider ${active ? "text-ink" : "text-ink/55"}`}>{label}</span>
            {i < items.length - 1 && <span className="w-6 h-px bg-ink/20 mx-1" />}
          </div>
        );
      })}
    </div>
  );
}

function NavRow({ back, next }: { back: React.ReactNode; next: React.ReactNode }) {
  return (
    <div className="mt-5 flex items-center justify-between gap-3">
      {back}
      {next}
    </div>
  );
}

function BigField({
  label, value, onChange, placeholder, autoFocus,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="block eyebrow text-ink/70 mb-2">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full h-14 px-4 border-2 border-ink bg-paper text-[18px] focus:outline-none focus:bg-white"
      />
    </label>
  );
}

function InviteShare({ code, groupName }: { code: string; groupName: string }) {
  const [copied, setCopied] = useState<"link" | "code" | null>(null);
  const link = typeof window !== "undefined"
    ? `${window.location.origin}/join/${code}`
    : `/join/${code}`;

  const copy = async (text: string, kind: "link" | "code") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* ignore */
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share) {
      try {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({
          title: `Join ${groupName} on StockVel-RSA`,
          text: `You're invited to join ${groupName}. Use code ${code}.`,
          url: link,
        });
      } catch {
        /* ignore */
      }
    } else {
      copy(link, "link");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="num text-[11px] uppercase tracking-wider text-ink/55 mb-2">Invite code</p>
        <div className="flex gap-2">
          <div className="flex-1 h-14 px-4 border-2 border-ink bg-paper inline-flex items-center num text-[22px] font-semibold tracking-widest">
            {code}
          </div>
          <button
            type="button"
            onClick={() => copy(code, "code")}
            className="btn-stamp btn-ghost h-14 px-4 text-[14px]"
          >
            {copied === "code" ? "Copied ✓" : "Copy"}
          </button>
        </div>
      </div>

      <div>
        <p className="num text-[11px] uppercase tracking-wider text-ink/55 mb-2">Invite link</p>
        <div className="flex gap-2">
          <div className="flex-1 h-14 px-4 border-2 border-ink/15 bg-white inline-flex items-center num text-[13px] truncate">
            {link}
          </div>
          <button
            type="button"
            onClick={() => copy(link, "link")}
            className="btn-stamp btn-ghost h-14 px-4 text-[14px]"
          >
            {copied === "link" ? "Copied ✓" : "Copy"}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={share}
        className="btn-stamp btn-aloe w-full h-14 text-[15px]"
      >
        Share invite (WhatsApp, SMS, …)
      </button>
    </div>
  );
}
