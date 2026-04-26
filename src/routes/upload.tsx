import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { GROUP } from "@/lib/mock-data";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload POP · TrustVel" },
      { name: "description", content: "Upload your proof of payment in seconds. Auto-tagged with date, amount, and reference." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [amount, setAmount] = useState(GROUP.contribution.toString());
  const [reference, setReference] = useState("");
  const [method, setMethod] = useState("EFT");
  const [submitted, setSubmitted] = useState(false);
  const [drag, setDrag] = useState(false);

  const onFile = (f: File | null) => {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      <section className="border-b-2 border-ink">
        <div className="container-edit py-10 md:py-14">
          <Reveal>
            <p className="eyebrow">Step 02 of 03 · Member action</p>
            <h1 className="mt-3 text-[36px] md:text-[52px] font-semibold leading-[1.05]">Upload your proof of payment</h1>
            <p className="mt-4 text-[17px] text-ink/75 max-w-2xl">
              Take a photo of your bank slip or attach a screenshot. The treasurer will verify it
              and the group will see your row turn green.
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="container-edit py-10 md:py-14">
          {submitted ? (
            <Reveal>
              <div className="panel max-w-2xl mx-auto">
                <div className="bg-aloe text-paper px-6 py-4 border-b-2 border-ink flex items-center gap-3">
                  <span className="w-8 h-8 bg-paper text-aloe inline-flex items-center justify-center font-bold">✓</span>
                  <p className="font-semibold text-[18px]">POP submitted — pending verification</p>
                </div>
                <div className="p-6 md:p-8 space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-[14px]">
                    <Field k="Amount" v={`R ${amount}`} />
                    <Field k="Method" v={method} />
                    <Field k="Reference" v={reference || "—"} />
                  </div>
                  <p className="text-[15px] text-ink/75">
                    The treasurer will verify within 24 hours. You'll get a notice and the
                    group ledger will update automatically.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <Link to="/ledger" className="btn-stamp btn-aloe h-12 px-5 text-[14px]">View ledger</Link>
                    <button onClick={() => { setSubmitted(false); setFile(null); setPreview(null); setReference(""); }} className="btn-stamp btn-ghost h-12 px-5 text-[14px]">Submit another</button>
                  </div>
                </div>
              </div>
            </Reveal>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <Reveal className="lg:col-span-7">
                <label
                  htmlFor="pop-file"
                  onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={handleDrop}
                  className={`block panel cursor-pointer transition-colors ${drag ? "bg-aloe-soft" : "bg-white"}`}
                >
                  {preview ? (
                    <div className="p-4">
                      <img src={preview} alt="Proof preview" className="w-full max-h-[480px] object-contain border border-rule bg-paper" />
                      <p className="mt-3 num text-[13px] text-ink/65 truncate">{file?.name}</p>
                    </div>
                  ) : (
                    <div className="px-6 py-16 md:py-20 text-center">
                      <div className="mx-auto w-16 h-16 border-2 border-ink inline-flex items-center justify-center mb-5">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                          <path d="M4 18v4a2 2 0 002 2h16a2 2 0 002-2v-4M14 4v16m0-16l-6 6m6-6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                        </svg>
                      </div>
                      <p className="text-[20px] font-semibold">Tap to take a photo or upload</p>
                      <p className="mt-2 text-[14px] text-ink/60">PNG, JPG, or PDF · Max 10 MB</p>
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
              </Reveal>

              <Reveal className="lg:col-span-5" delay={120}>
                <div className="panel-soft p-6 md:p-7 space-y-5">
                  <div>
                    <p className="eyebrow">Cycle</p>
                    <p className="mt-2 text-[18px] font-semibold">{GROUP.cycle}</p>
                    <p className="num text-[13px] text-ink/60">{GROUP.name}</p>
                  </div>

                  <FormField label="Amount paid (ZAR)">
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border-2 border-r-0 border-ink/15 num text-[15px] bg-paper">R</span>
                      <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                        inputMode="decimal"
                        className="flex-1 h-12 px-3 border-2 border-ink/15 focus:border-ink bg-white text-[16px] num outline-none"
                        required
                      />
                    </div>
                  </FormField>

                  <FormField label="Payment method">
                    <div className="grid grid-cols-3 gap-2">
                      {["EFT", "Cash", "Transfer"].map((m) => (
                        <button
                          type="button"
                          key={m}
                          onClick={() => setMethod(m)}
                          className={`h-12 border-2 text-[14px] font-medium ${method === m ? "bg-ink text-paper border-ink" : "bg-white border-ink/15 hover:border-ink"}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </FormField>

                  <FormField label="Reference number">
                    <input
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="e.g. EFT 8472"
                      className="w-full h-12 px-3 border-2 border-ink/15 focus:border-ink bg-white text-[16px] num outline-none"
                    />
                  </FormField>

                  <button
                    type="submit"
                    disabled={!file}
                    className="btn-stamp btn-aloe w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
                  >
                    Submit proof of payment
                  </button>

                  <p className="text-[13px] text-ink/60 leading-relaxed">
                    By submitting, you confirm this payment was made. The treasurer will verify
                    and the ledger will update for everyone.
                  </p>
                </div>
              </Reveal>
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block num text-[11px] uppercase tracking-wider text-ink/65 mb-2">{label}</label>
      {children}
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-rule p-3">
      <p className="num text-[10px] uppercase tracking-wider text-ink/55">{k}</p>
      <p className="mt-1 num text-[15px] font-semibold">{v}</p>
    </div>
  );
}
