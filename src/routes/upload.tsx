import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { store, useStokvel, currentMonthKey, monthLabel } from "@/lib/store";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Proof of Payment · StockVel-RSA" },
      { name: "description", content: "Take a photo of your bank slip, add the amount and reference, and submit. Big buttons, mobile-first." },
    ],
  }),
  component: UploadPage,
});

type Step = 1 | 2 | 3 | 4;

function UploadPage() {
  const navigate = useNavigate();
  const state = useStokvel();
  const month = currentMonthKey();
  const [step, setStep] = useState<Step>(1);

  const [memberId, setMemberId] = useState<string>(state.members[0]?.id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [amount, setAmount] = useState((state.group?.contribution ?? 0).toString());
  const [reference, setReference] = useState("");
  const [method, setMethod] = useState<"EFT" | "Cash" | "Transfer">("EFT");

  const member = useMemo(() => state.members.find((m) => m.id === memberId), [state.members, memberId]);

  const onFile = (f: File | null) => {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!memberId) return;
    store.recordPOP({
      memberId,
      month,
      amount: Number(amount) || 0,
      ref: reference.trim() || `POP-${Date.now().toString().slice(-5)}`,
      method,
    });
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      <section className="border-b-2 border-ink">
        <div className="container-edit py-8 md:py-12">
          <Reveal>
            <p className="eyebrow">Proof of payment · {monthLabel(month)}</p>
            <h1 className="mt-3 text-[32px] md:text-[44px] font-semibold leading-[1.05]">
              {step === 4 ? "Submitted ✓" : "Upload your proof of payment"}
            </h1>
            {step < 4 && (
              <p className="mt-3 text-[15px] text-ink/70 max-w-xl">
                Three quick steps. Big buttons. Works on any phone.
              </p>
            )}
          </Reveal>
        </div>
      </section>

      <section>
        <div className="container-edit py-8 md:py-12 max-w-2xl">
          {step === 4 ? (
            <Reveal>
              <div className="panel">
                <div className="bg-aloe text-paper px-6 py-4 border-b-2 border-ink flex items-center gap-3">
                  <span className="w-9 h-9 bg-paper text-aloe inline-flex items-center justify-center font-bold text-lg">✓</span>
                  <p className="font-semibold text-[18px]">POP submitted — pending verification</p>
                </div>
                <div className="p-6 md:p-8 space-y-5">
                  <div className="grid grid-cols-3 gap-3">
                    <Field k="Member" v={member?.name ?? "—"} />
                    <Field k="Amount" v={`R ${amount}`} />
                    <Field k="Method" v={method} />
                  </div>
                  <p className="text-[15px] text-ink/75">
                    Treasurer will verify within 24 hours. The ledger has been updated for everyone.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => navigate({ to: "/ledger" })} className="btn-stamp btn-aloe h-14 text-[15px]">View ledger →</button>
                    <button
                      onClick={() => { setStep(1); setFile(null); setPreview(null); setReference(""); }}
                      className="btn-stamp btn-ghost h-14 text-[15px]"
                    >
                      Submit another
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ) : (
            <form onSubmit={submit}>
              <Stepper step={step} />

              {/* STEP 1 — Photo */}
              {step === 1 && (
                <Reveal>
                  <div className="panel">
                    <label
                      htmlFor="pop-file"
                      className="block cursor-pointer"
                    >
                      {preview ? (
                        <div className="p-4">
                          <img src={preview} alt="Proof preview" className="w-full max-h-[420px] object-contain border border-rule bg-paper" />
                          <p className="mt-3 num text-[13px] text-ink/65 truncate">{file?.name}</p>
                        </div>
                      ) : (
                        <div className="px-6 py-16 md:py-20 text-center">
                          <div className="mx-auto w-20 h-20 border-2 border-ink inline-flex items-center justify-center mb-5">
                            <svg width="34" height="34" viewBox="0 0 28 28" fill="none" aria-hidden>
                              <path d="M4 18v4a2 2 0 002 2h16a2 2 0 002-2v-4M14 4v16m0-16l-6 6m6-6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                            </svg>
                          </div>
                          <p className="text-[22px] font-semibold">Take a photo of your slip</p>
                          <p className="mt-2 text-[14px] text-ink/60">Or upload a screenshot · PNG, JPG, PDF</p>
                        </div>
                      )}
                      <input
                        id="pop-file"
                        type="file"
                        accept="image/*,application/pdf"
                        capture="environment"
                        className="sr-only"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onFile(e.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                  <NavRow
                    back={<Link to="/dashboard" className="btn-stamp btn-ghost h-14 px-5 text-[15px]">← Cancel</Link>}
                    next={
                      <button
                        type="button"
                        disabled={!file}
                        onClick={() => setStep(2)}
                        className="btn-stamp btn-aloe h-14 px-7 text-[16px] disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Next: Amount →
                      </button>
                    }
                  />
                </Reveal>
              )}

              {/* STEP 2 — Amount + member */}
              {step === 2 && (
                <Reveal>
                  <div className="panel p-6 md:p-8 space-y-6">
                    <div>
                      <label className="block eyebrow text-ink/70 mb-2">Who paid?</label>
                      <select
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                        className="w-full h-14 px-4 border-2 border-ink bg-paper text-[16px] focus:outline-none"
                      >
                        {state.members.map((m) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block eyebrow text-ink/70 mb-2">Amount paid (ZAR)</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 border-2 border-r-0 border-ink num text-[18px] bg-paper">R</span>
                        <input
                          value={amount}
                          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                          inputMode="decimal"
                          className="flex-1 h-14 px-4 border-2 border-ink bg-white text-[20px] num outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block eyebrow text-ink/70 mb-2">Payment method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["EFT", "Cash", "Transfer"] as const).map((m) => (
                          <button
                            type="button"
                            key={m}
                            onClick={() => setMethod(m)}
                            className={`h-14 border-2 text-[15px] font-semibold ${method === m ? "bg-ink text-paper border-ink" : "bg-white border-ink/15 hover:border-ink"}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <NavRow
                    back={<button type="button" onClick={() => setStep(1)} className="btn-stamp btn-ghost h-14 px-5 text-[15px]">← Back</button>}
                    next={
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={!Number(amount) || !memberId}
                        className="btn-stamp btn-aloe h-14 px-7 text-[16px] disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Next: Reference →
                      </button>
                    }
                  />
                </Reveal>
              )}

              {/* STEP 3 — Reference + confirm */}
              {step === 3 && (
                <Reveal>
                  <div className="panel p-6 md:p-8 space-y-6">
                    <div>
                      <label className="block eyebrow text-ink/70 mb-2">Reference number</label>
                      <input
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="e.g. EFT 8472"
                        className="w-full h-14 px-4 border-2 border-ink bg-paper text-[18px] num outline-none"
                      />
                      <p className="mt-2 text-[13px] text-ink/55">
                        Optional. Helps the treasurer match it to the bank statement.
                      </p>
                    </div>

                    <div className="bg-aloe-soft border-2 border-aloe p-4">
                      <p className="num text-[11px] uppercase tracking-wider text-aloe">Confirm payment</p>
                      <dl className="mt-3 grid grid-cols-2 gap-3 text-[15px]">
                        <dt className="text-ink/60">Member</dt><dd className="font-semibold">{member?.name}</dd>
                        <dt className="text-ink/60">Amount</dt><dd className="num font-semibold">R {amount}</dd>
                        <dt className="text-ink/60">Method</dt><dd className="num">{method}</dd>
                        <dt className="text-ink/60">Reference</dt><dd className="num">{reference || "—"}</dd>
                      </dl>
                    </div>
                  </div>
                  <NavRow
                    back={<button type="button" onClick={() => setStep(2)} className="btn-stamp btn-ghost h-14 px-5 text-[15px]">← Back</button>}
                    next={
                      <button type="submit" className="btn-stamp btn-aloe h-14 px-8 text-[17px]">
                        Submit POP ✓
                      </button>
                    }
                  />
                </Reveal>
              )}
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = ["Photo", "Amount", "Confirm"];
  return (
    <div className="mb-5 flex items-center gap-2">
      {items.map((label, i) => {
        const n = (i + 1) as Step;
        const done = step > n;
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

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-rule p-3">
      <p className="num text-[10px] uppercase tracking-wider text-ink/55">{k}</p>
      <p className="mt-1 num text-[14px] font-semibold truncate">{v}</p>
    </div>
  );
}
