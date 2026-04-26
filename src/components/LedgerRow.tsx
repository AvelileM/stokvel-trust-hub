import { cn } from "@/lib/utils";

export type LedgerStatus = "verified" | "pending" | "missing";

export interface LedgerRowData {
  id: string;
  member: string;
  initials: string;
  amount: number;
  date: string;
  ref: string;
  status: LedgerStatus;
  note?: string;
}

const fmt = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2 });

const STATUS_COPY: Record<LedgerStatus, { label: string; cls: string }> = {
  verified: { label: "Verified", cls: "pill pill-verified" },
  pending: { label: "Pending POP", cls: "pill pill-pending" },
  missing: { label: "Missing", cls: "pill pill-missing" },
};

export function LedgerRow({ row, dense = false }: { row: LedgerRowData; dense?: boolean }) {
  const status = STATUS_COPY[row.status];
  return (
    <div
      className={cn(
        "grid grid-cols-12 items-center gap-3 px-4 md:px-5 border-b border-rule last:border-b-0 hover:bg-paper transition-colors",
        dense ? "py-3" : "py-4",
      )}
    >
      <div className="col-span-6 md:col-span-5 flex items-center gap-3 min-w-0">
        <span className="shrink-0 w-9 h-9 bg-aloe-soft text-aloe font-mono font-semibold text-[13px] inline-flex items-center justify-center border border-aloe/20">
          {row.initials}
        </span>
        <div className="min-w-0">
          <p className="font-medium text-[15px] truncate">{row.member}</p>
          <p className="num text-[12px] text-ink/60 truncate">REF · {row.ref}</p>
        </div>
      </div>
      <div className="col-span-6 md:col-span-3 text-right md:text-left num text-[15px] font-medium">
        {fmt.format(row.amount)}
      </div>
      <div className="hidden md:block md:col-span-2 num text-[13px] text-ink/70">{row.date}</div>
      <div className="col-span-12 md:col-span-2 flex md:justify-end">
        <span className={status.cls}>
          {row.status === "verified" && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path d="M1 5l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
            </svg>
          )}
          {status.label}
        </span>
      </div>
    </div>
  );
}
