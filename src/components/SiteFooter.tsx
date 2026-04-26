import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="container-edit py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-paper text-ink font-mono font-semibold text-sm">TV</span>
              <span className="font-semibold text-lg tracking-tight">TrustVel · RSA</span>
            </div>
            <p className="mt-4 max-w-md text-paper/75 text-[15px] leading-relaxed">
              The shared ledger for South African stokvels. We record contributions —
              your money stays in your bank.
            </p>
            <p className="mt-6 eyebrow text-brass">Made in Mzansi · For Mzansi</p>
          </div>

          <div className="md:col-span-3">
            <h4 className="eyebrow text-paper/60 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-[15px]">
              <li><Link to="/dashboard" className="hover:text-brass">Dashboard</Link></li>
              <li><Link to="/ledger" className="hover:text-brass">Transparency Ledger</Link></li>
              <li><Link to="/upload" className="hover:text-brass">Upload POP</Link></li>
              <li><Link to="/reports" className="hover:text-brass">Reports</Link></li>
              <li><Link to="/admin" className="hover:text-brass">Admin tools</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="eyebrow text-paper/60 mb-4">Group</h4>
            <ul className="space-y-2.5 text-[15px]">
              <li><Link to="/pricing" className="hover:text-brass">Pricing</Link></li>
              <li><a href="#" className="hover:text-brass">Help centre</a></li>
              <li><a href="#" className="hover:text-brass">Trust & safety</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="eyebrow text-paper/60 mb-4">Contact</h4>
            <ul className="space-y-2.5 text-[15px] num">
              <li>+27 11 000 0000</li>
              <li className="break-all">help@trustvel.co.za</li>
            </ul>
          </div>
        </div>

        <div className="rule-thin mt-12 border-paper/15 pt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <p className="text-paper/60 text-[13px] num">© {new Date().getFullYear()} TrustVel (Pty) Ltd · All record-keeping, no custody.</p>
          <p className="text-paper/60 text-[13px] num">Stokvel record OS · v1.0</p>
        </div>
      </div>
    </footer>
  );
}
