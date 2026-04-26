import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { store, useStokvel } from "@/lib/store";

export const Route = createFileRoute("/join/$code")({
  head: () => ({
    meta: [
      { title: "Join a stokvel · StockVel-RSA" },
      { name: "description", content: "Join your stokvel group with an invite code." },
    ],
  }),
  component: JoinPage,
});

function JoinPage() {
  const { code } = useParams({ from: "/join/$code" });
  const { group } = useStokvel();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const matches = group?.inviteCode.toUpperCase() === code.toUpperCase();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    const ok = store.joinGroup(code, name.trim(), phone.trim() || undefined);
    if (!ok) {
      setError("That invite code doesn't match any group on this device.");
      return;
    }
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b-2 border-ink">
          <div className="container-edit py-10 md:py-14 max-w-xl">
            <Reveal>
              <p className="eyebrow">Stokvel invitation</p>
              <h1 className="mt-3 text-[34px] md:text-[44px] font-semibold leading-[1.05]">
                {done ? "You're in." : "Join the group."}
              </h1>
              <p className="mt-4 text-[16px] text-ink/75">
                Code <span className="num font-semibold tracking-widest">{code}</span>
                {matches && group ? <> · <span className="font-semibold">{group.name}</span></> : null}
              </p>
            </Reveal>
          </div>
        </section>

        <section>
          <div className="container-edit py-10 max-w-xl">
            {done ? (
              <Reveal>
                <div className="panel">
                  <div className="bg-aloe text-paper px-6 py-4 border-b-2 border-ink">
                    <p className="font-semibold text-[18px]">Welcome, {name.split(" ")[0]} ✓</p>
                  </div>
                  <div className="p-6 md:p-8 space-y-5">
                    <p className="text-[15px] text-ink/75">
                      You've been added to <strong>{group?.name}</strong>. The treasurer will
                      mark your contributions on the shared ledger each month.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
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
            ) : (
              <Reveal>
                <form onSubmit={submit} className="panel p-6 md:p-8 space-y-5">
                  {!matches && (
                    <div className="border-2 border-brass bg-brass-soft p-4 text-[14px]">
                      Heads up: this code doesn't match the group saved on this device.
                      Submit anyway and we'll add you locally for now.
                    </div>
                  )}
                  <label className="block">
                    <span className="block eyebrow text-ink/70 mb-2">Your full name</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Thabo Nkosi"
                      autoFocus
                      className="w-full h-14 px-4 border-2 border-ink bg-paper text-[18px] focus:outline-none focus:bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="block eyebrow text-ink/70 mb-2">Mobile number (optional)</span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                      placeholder="082 000 0000"
                      className="w-full h-14 px-4 border-2 border-ink/15 focus:border-ink bg-white text-[18px] num focus:outline-none"
                    />
                  </label>

                  {error && <p className="text-[14px] text-red-700">{error}</p>}

                  <button type="submit" className="btn-stamp btn-aloe w-full h-14 text-[16px]">
                    Join {group?.name ?? "this group"}
                  </button>

                  <p className="text-center">
                    <Link to="/" className="text-[14px] text-ink/60 underline underline-offset-4">← Back to home</Link>
                  </p>
                </form>
              </Reveal>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
