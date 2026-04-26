import { Link } from "@tanstack/react-router";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/ledger", label: "Ledger" },
  { to: "/upload", label: "Upload POP" },
  { to: "/reports", label: "Reports" },
  { to: "/admin", label: "Admin" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b-2 border-ink bg-paper sticky top-0 z-40">
      <div className="container-edit flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2.5" aria-label="TrustVel home">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-ink text-paper font-mono font-semibold text-sm">TV</span>
          <span className="font-semibold text-lg tracking-tight">TrustVel<span className="text-aloe">·</span><span className="text-aloe font-mono text-xs align-middle ml-1">RSA</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {NAV.slice(1, -1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="text-[15px] font-medium text-ink/70 hover:text-ink transition-colors data-[status=active]:text-ink data-[status=active]:underline underline-offset-[6px] decoration-aloe decoration-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/pricing" className="text-[15px] font-medium text-ink/70 hover:text-ink">Pricing</Link>
          <Link to="/dashboard" className="btn-stamp btn-aloe h-11 px-5 text-[14px]">Open ledger</Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 border-2 border-ink"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-[5px]">
            <span className="block w-5 h-[2px] bg-ink" />
            <span className="block w-5 h-[2px] bg-ink" />
            <span className="block w-5 h-[2px] bg-ink" />
          </div>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t-2 border-ink bg-paper">
          <nav className="container-edit py-4 flex flex-col" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-3 text-[17px] font-medium border-b border-rule last:border-0 data-[status=active]:text-aloe"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
