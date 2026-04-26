import type { LedgerRowData } from "@/components/LedgerRow";

export const GROUP = {
  name: "Siyakhula Family Stokvel",
  cycle: "October 2025",
  contribution: 500,
  members: 24,
  paid: 19,
  outstanding: 5,
  groupTotal: 9500,
  expectedTotal: 12000,
  nextPayout: "30 Nov 2025",
};

export const LEDGER: LedgerRowData[] = [
  { id: "1", member: "Sipho Mthembu", initials: "SM", amount: 500, date: "02 Oct 2025", ref: "EFT 8472", status: "verified" },
  { id: "2", member: "Mam' Sibongile Dlamini", initials: "SD", amount: 500, date: "02 Oct 2025", ref: "CASH 0011", status: "verified" },
  { id: "3", member: "Thabo Nkosi", initials: "TN", amount: 500, date: "03 Oct 2025", ref: "EFT 8489", status: "verified" },
  { id: "4", member: "Lerato Mokoena", initials: "LM", amount: 500, date: "03 Oct 2025", ref: "EFT 8501", status: "verified" },
  { id: "5", member: "Bongani Khumalo", initials: "BK", amount: 500, date: "05 Oct 2025", ref: "EFT 8533", status: "verified" },
  { id: "6", member: "Naledi Tshabalala", initials: "NT", amount: 500, date: "07 Oct 2025", ref: "EFT 8612", status: "pending" },
  { id: "7", member: "Mandla Zulu", initials: "MZ", amount: 500, date: "08 Oct 2025", ref: "EFT 8640", status: "pending" },
  { id: "8", member: "Refilwe Mahlangu", initials: "RM", amount: 0, date: "—", ref: "—", status: "missing" },
  { id: "9", member: "Kagiso Sithole", initials: "KS", amount: 0, date: "—", ref: "—", status: "missing" },
  { id: "10", member: "Zinhle Cele", initials: "ZC", amount: 500, date: "10 Oct 2025", ref: "EFT 8701", status: "verified" },
];

export const ACTIVITY = [
  { time: "Today · 14:32", actor: "Mam' Sibongile (Treasurer)", action: "Verified payment from Sipho M.", amount: "R500.00" },
  { time: "Today · 11:08", actor: "Thabo N.", action: "Uploaded proof of payment", amount: "R500.00" },
  { time: "Yesterday · 18:45", actor: "Lerato M.", action: "Uploaded proof of payment", amount: "R500.00" },
  { time: "Yesterday · 09:12", actor: "Mam' Sibongile (Treasurer)", action: "Sent reminder to 5 members", amount: "" },
  { time: "Mon 14 Oct · 16:01", actor: "Group", action: "Cycle opened — October 2025", amount: "R12,000.00" },
];
