import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="container-edit py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-paper text-ink font-mono font-semibold text-sm">SV</span>
              <span className="font-semibold text-lg tracking-tight">StockVel · RSA</span>
            </div>
            <p className="mt-4 max-w-md text-paper/75 text-[15px] leading-relaxed">
              We help stokvel groups stay organised and trusted.
              Simple records. Less conflict. We never hold your money.
            </p>
            <p className="mt-6 eyebrow text-brass">Made in Mzansi · For Mzansi</p>
          </div>

          <div className="md:col-span-3">
            <h4 className="eyebrow text-paper/60 mb-4">App</h4>
            <ul className="space-y-2.5 text-[15px]">
              <li><Link to="/dashboard" className="hover:text-brass">Dashboard</Link></li>
              <li><Link to="/ledger" className="hover:text-brass">Ledger</Link></li>
              <li><Link to="/upload" className="hover:text-brass">Upload POP</Link></li>
              <li><Link to="/reports" className="hover:text-brass">Reports</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="eyebrow text-paper/60 mb-4">Get started</h4>
            <ul className="space-y-2.5 text-[15px]">
              <li><Link to="/login" className="hover:text-brass">Login</Link></li>
              <li><Link to="/login" className="hover:text-brass">Register a group</Link></li>
            </ul>
          </div>
        </div>

        <div className="rule-thin mt-12 border-paper/15 pt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <p className="text-paper/60 text-[13px] num">© {new Date().getFullYear()} StockVel-RSA · We never hold your money.</p>
          <p className="text-paper/60 text-[13px] num">MVP · v1.0</p>
        </div>
      </div>
    </footer>
  );
}
