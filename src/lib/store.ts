// Lightweight client-only store for the StockVel-RSA MVP.
// Persists to localStorage so the wizard, dashboard, ledger, and reports
// stay in sync without a backend.

import { useSyncExternalStore } from "react";

export type Member = {
  id: string;
  name: string;
  phone?: string;
  initials: string;
};

export type PaymentStatus = "verified" | "pending" | "missing";

export type Payment = {
  memberId: string;
  month: string; // "2025-10"
  amount: number;
  date: string; // ISO
  ref: string;
  method: "EFT" | "Cash" | "Transfer";
  status: PaymentStatus;
};

export type Group = {
  name: string;
  contribution: number;
  cycleStartMonth: string; // "2025-10"
  inviteCode: string;
  treasurer: string;
  createdAt: string;
};

export type StokvelState = {
  group: Group | null;
  members: Member[];
  payments: Payment[];
};

const KEY = "stockvel-rsa:v1";

const DEFAULT: StokvelState = {
  group: {
    name: "Siyakhula Family Stokvel",
    contribution: 500,
    cycleStartMonth: currentMonth(),
    inviteCode: "SIYA-2025",
    treasurer: "Mam' Sibongile Dlamini",
    createdAt: new Date().toISOString(),
  },
  members: [
    { id: "m1", name: "Sipho Mthembu", initials: "SM", phone: "0821112233" },
    { id: "m2", name: "Mam' Sibongile Dlamini", initials: "SD", phone: "0823334455" },
    { id: "m3", name: "Thabo Nkosi", initials: "TN", phone: "0825556677" },
    { id: "m4", name: "Lerato Mokoena", initials: "LM", phone: "0827778899" },
    { id: "m5", name: "Bongani Khumalo", initials: "BK", phone: "0829990011" },
    { id: "m6", name: "Naledi Tshabalala", initials: "NT", phone: "0820001122" },
    { id: "m7", name: "Mandla Zulu", initials: "MZ", phone: "0822223344" },
    { id: "m8", name: "Refilwe Mahlangu", initials: "RM", phone: "0824445566" },
    { id: "m9", name: "Kagiso Sithole", initials: "KS", phone: "0826667788" },
    { id: "m10", name: "Zinhle Cele", initials: "ZC", phone: "0828889900" },
  ],
  payments: seedPayments(),
};

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function seedPayments(): Payment[] {
  const m = currentMonth();
  return [
    { memberId: "m1", month: m, amount: 500, date: isoFor(m, 2), ref: "EFT 8472", method: "EFT", status: "verified" },
    { memberId: "m2", month: m, amount: 500, date: isoFor(m, 2), ref: "CASH 0011", method: "Cash", status: "verified" },
    { memberId: "m3", month: m, amount: 500, date: isoFor(m, 3), ref: "EFT 8489", method: "EFT", status: "verified" },
    { memberId: "m4", month: m, amount: 500, date: isoFor(m, 3), ref: "EFT 8501", method: "EFT", status: "verified" },
    { memberId: "m5", month: m, amount: 500, date: isoFor(m, 5), ref: "EFT 8533", method: "EFT", status: "verified" },
    { memberId: "m6", month: m, amount: 500, date: isoFor(m, 7), ref: "EFT 8612", method: "EFT", status: "pending" },
    { memberId: "m7", month: m, amount: 500, date: isoFor(m, 8), ref: "EFT 8640", method: "EFT", status: "pending" },
    { memberId: "m10", month: m, amount: 500, date: isoFor(m, 10), ref: "EFT 8701", method: "EFT", status: "verified" },
  ];
}

function isoFor(month: string, day: number) {
  return `${month}-${String(day).padStart(2, "0")}T09:00:00.000Z`;
}

let state: StokvelState = load();
const listeners = new Set<() => void>();

function load(): StokvelState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as StokvelState;
    // basic shape check
    if (!parsed.members || !parsed.payments) return DEFAULT;
    return parsed;
  } catch {
    return DEFAULT;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

function emit() {
  for (const l of listeners) l();
}

function set(updater: (prev: StokvelState) => StokvelState) {
  state = updater(state);
  persist();
  emit();
}

export const store = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },

  createGroup(input: {
    name: string;
    contribution: number;
    treasurer: string;
    members: { name: string; phone?: string }[];
  }) {
    const month = currentMonth();
    const code = makeCode(input.name);
    const members: Member[] = [
      {
        id: `m_${Date.now()}_t`,
        name: input.treasurer,
        initials: initials(input.treasurer),
        phone: undefined,
      },
      ...input.members.map((m, i) => ({
        id: `m_${Date.now()}_${i}`,
        name: m.name,
        phone: m.phone,
        initials: initials(m.name),
      })),
    ];
    set(() => ({
      group: {
        name: input.name,
        contribution: input.contribution,
        cycleStartMonth: month,
        inviteCode: code,
        treasurer: input.treasurer,
        createdAt: new Date().toISOString(),
      },
      members,
      payments: [],
    }));
    return code;
  },

  joinGroup(code: string, name: string, phone?: string) {
    if (!state.group) return false;
    if (state.group.inviteCode.toUpperCase() !== code.toUpperCase()) return false;
    const exists = state.members.some((m) => m.name.toLowerCase() === name.toLowerCase());
    if (exists) return true;
    set((p) => ({
      ...p,
      members: [
        ...p.members,
        { id: `m_${Date.now()}`, name, phone, initials: initials(name) },
      ],
    }));
    return true;
  },

  setPaid(memberId: string, month: string, paid: boolean) {
    set((p) => {
      const others = p.payments.filter((x) => !(x.memberId === memberId && x.month === month));
      if (!paid) return { ...p, payments: others };
      const newP: Payment = {
        memberId,
        month,
        amount: p.group?.contribution ?? 0,
        date: new Date().toISOString(),
        ref: `MARK-${Date.now().toString().slice(-5)}`,
        method: "EFT",
        status: "verified",
      };
      return { ...p, payments: [...others, newP] };
    });
  },

  recordPOP(input: {
    memberId: string;
    month: string;
    amount: number;
    ref: string;
    method: "EFT" | "Cash" | "Transfer";
  }) {
    set((p) => {
      const others = p.payments.filter(
        (x) => !(x.memberId === input.memberId && x.month === input.month),
      );
      const newP: Payment = {
        ...input,
        date: new Date().toISOString(),
        status: "pending",
      };
      return { ...p, payments: [...others, newP] };
    });
  },

  addMember(name: string, phone?: string) {
    set((p) => ({
      ...p,
      members: [
        ...p.members,
        { id: `m_${Date.now()}`, name, phone, initials: initials(name) },
      ],
    }));
  },
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function makeCode(name: string) {
  const part = name
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 4)
    .toUpperCase()
    .padEnd(4, "X");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${part}-${rand}`;
}

// ---------- Hooks ----------

export function useStokvel(): StokvelState {
  return useSyncExternalStore(
    store.subscribe,
    () => state,
    () => DEFAULT,
  );
}

// ---------- Helpers ----------

export function monthLabel(month: string) {
  // "2025-10" → "October 2025"
  const [y, m] = month.split("-").map(Number);
  if (!y || !m) return month;
  return new Date(y, m - 1, 1).toLocaleString("en-ZA", { month: "long", year: "numeric" });
}

export function shortMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  if (!y || !m) return month;
  return new Date(y, m - 1, 1).toLocaleString("en-ZA", { month: "short" });
}

export function formatDate(iso: string) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}

export function listMonths(state: StokvelState, count = 6): string[] {
  // Return last `count` months ending at current month
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  // ensure cycle start included
  if (state.group && !out.includes(state.group.cycleStartMonth)) {
    out.push(state.group.cycleStartMonth);
  }
  return Array.from(new Set(out)).sort().reverse();
}

export function currentMonthKey(): string {
  return currentMonth();
}
