import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login or register · StockVel-RSA" },
      { name: "description", content: "Sign in to your stokvel group, or create a new group in 3 minutes. Free to start. We never hold your money." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <SiteHeader />

      <main className="flex-1 border-b-2 border-ink">
        <div className="container-edit py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Pitch */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Welcome to StockVel-RSA</p>
              <h1 className="mt-4 text-[36px] md:text-[48px] font-semibold leading-[1.05]">
                {mode === "login" ? "Open your group's ledger." : "Start a group in 3 minutes."}
              </h1>
              <p className="mt-6 text-[17px] text-ink/75 leading-relaxed max-w-md">
                {mode === "login"
                  ? "Sign in to view your shared ledger, mark payments, and download statements."
                  : "Create your stokvel group, add members, and start tracking payments — all without holding any money."}
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div className="mt-10 panel-soft p-5">
                <p className="eyebrow text-aloe">Reminder</p>
                <p className="mt-2 text-[15px] leading-relaxed">
                  StockVel-RSA <strong>never holds your money</strong>. Members keep paying
                  the treasurer the same way they always have. We only keep the records.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <Reveal delay={120}>
              <div className="panel">
                <div className="grid grid-cols-2 border-b-2 border-ink">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`py-4 text-[15px] font-semibold border-r-2 border-ink transition-colors ${mode === "login" ? "bg-ink text-paper" : "bg-paper text-ink/60 hover:text-ink"}`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className={`py-4 text-[15px] font-semibold transition-colors ${mode === "register" ? "bg-ink text-paper" : "bg-paper text-ink/60 hover:text-ink"}`}
                  >
                    Register a group
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // MVP: demo only — register goes to the create-group wizard
                    window.location.href = mode === "register" ? "/create" : "/dashboard";
                  }}
                  className="p-6 md:p-8 space-y-5"
                >
                  {mode === "register" && (
                    <>
                      <Field label="Your full name" name="name" placeholder="e.g. Sibongile Dlamini" />
                      <Field label="Stokvel group name" name="group" placeholder="e.g. Siyakhula Family Stokvel" />
                    </>
                  )}
                  <Field label="Mobile number" name="phone" type="tel" placeholder="082 000 0000" inputMode="tel" />
                  <Field label="Password" name="password" type="password" placeholder="At least 6 characters" />

                  <button type="submit" className="btn-stamp btn-aloe w-full mt-2">
                    {mode === "login" ? "Sign in" : "Create my group"}
                  </button>

                  <p className="num text-[12px] text-ink/55 text-center pt-2">
                    By continuing you agree to keep your group's records honest.
                  </p>
                </form>
              </div>

              <p className="mt-6 text-[14px] text-ink/65 text-center">
                {mode === "login" ? (
                  <>New here? <button onClick={() => setMode("register")} className="text-aloe font-semibold underline underline-offset-4 decoration-2">Register a group</button></>
                ) : (
                  <>Already have a group? <button onClick={() => setMode("login")} className="text-aloe font-semibold underline underline-offset-4 decoration-2">Sign in</button></>
                )}
              </p>

              <p className="mt-4 text-center">
                <Link to="/" className="text-[14px] text-ink/60 hover:text-ink underline underline-offset-4">← Back to home</Link>
              </p>
            </Reveal>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
}) {
  return (
    <label className="block">
      <span className="block eyebrow text-ink/70 mb-2">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        inputMode={inputMode}
        required
        className="w-full h-12 px-4 border-2 border-ink bg-paper text-[16px] focus:outline-none focus:bg-paper focus:ring-2 focus:ring-aloe focus:ring-offset-0"
      />
    </label>
  );
}
