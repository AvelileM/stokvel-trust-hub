# StockVel-RSA

> A digital tool that helps stokvel groups in South Africa track contributions transparently — **without holding or managing money**.

We are not a bank. We do not move money. We only keep the records visible so everyone in the group can see who has paid and who hasn't.

**One sentence:** *Who paid? Who didn't? Show everyone clearly.*

---

## 1. Project Overview

StockVel-RSA is a mobile-first web app for stokvel (savings group) treasurers and members.

What it does:
- Create a stokvel group and invite members with a shareable code
- Track monthly contributions (paid / unpaid) per member
- Show a shared **Transparency Ledger** that every member can see
- Let members upload a Proof of Payment (POP) photo
- Let the admin verify a payment
- Generate a printable / downloadable monthly PDF report

What it deliberately does **not** do:
- Hold money, run wallets, process payments
- Loans, funeral cover, insurance, investments, marketplace
- Complex pricing tiers or fake analytics

Designed for low-end Android phones, low data, large buttons, simple language.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Routing | TanStack Router (file-based, in `src/routes/`) |
| Styling | Tailwind CSS v4 (tokens in `src/styles.css`) |
| UI primitives | shadcn/ui + Radix |
| State | Lightweight client store (`src/lib/store.ts`) backed by `localStorage` via `useSyncExternalStore` |
| Backend | **None.** MVP is fully client-side so it runs anywhere with zero setup. |
| PDF / Print | Native `window.print()` against a clean printable HTML layout |

When you are ready to add a real backend later, swap the functions in `src/lib/store.ts` for API calls — the rest of the app does not need to change.

---

## 3. How to Run Locally (Step by Step)

### Prerequisites
- **Node.js 20 or newer** — check with `node -v`
- **npm 10+** (ships with Node) — this project uses **npm**, pick one and stick with it

### Steps

```bash
# 1. Clone the repo
git clone <your-repo-url> stockvel-rsa
cd stockvel-rsa

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173`).

### Other scripts

```bash
npm run build     # Type-check + production build into dist/
npm run preview   # Serve the production build locally to verify it
```

If you prefer Bun, `bun install && bun run dev` also works — but do not mix the two.

---

## 4. Project Structure

```
stockvel-rsa/
├── src/
│   ├── routes/                # File-based routes (each file = one URL)
│   │   ├── __root.tsx         # HTML shell, shared layout
│   │   ├── index.tsx          # /            Landing page
│   │   ├── login.tsx          # /login       Login + Register
│   │   ├── create.tsx         # /create      3-step group setup wizard
│   │   ├── dashboard.tsx      # /dashboard   Mark members paid/unpaid
│   │   ├── ledger.tsx         # /ledger      Shared transparency ledger
│   │   ├── upload.tsx         # /upload      Upload Proof of Payment
│   │   ├── reports.tsx        # /reports     Generate monthly PDF
│   │   └── join.$code.tsx     # /join/:code  Join via invite link
│   ├── components/            # Header, footer, ledger row, reusable bits
│   │   └── ui/                # shadcn/ui primitives
│   ├── lib/
│   │   └── store.ts           # The whole "backend" — group, members, payments
│   ├── hooks/                 # Small reusable hooks
│   ├── styles.css             # Tailwind v4 + design tokens
│   └── router.tsx             # Router bootstrap
├── public/                    # Static assets served as-is
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

`src/routeTree.gen.ts` is **auto-generated** by the TanStack Router plugin. Do not edit it.

---

## 5. How the App Works

All data lives in the browser via `localStorage` (key: `stockvel-rsa:v1`). That means it is a real working demo — refresh the page and your group is still there — but each device has its own copy. Clear browser storage to reset.

### Flow

1. **Landing (`/`)** — explains the product in 5 seconds: *We never hold your money.*
2. **Login / Register (`/login`)** — phone + password (demo). Register routes you to the wizard.
3. **Create group (`/create`)** — 3 steps:
   1. Group name + your name (treasurer)
   2. Monthly contribution amount (R100 / R200 / R500 / R1000 / custom)
   3. Add members (name + phone). On finish you get a shareable invite code.
4. **Invite (`/join/:code`)** — anyone with the code can join the group.
5. **Dashboard (`/dashboard`)** — choose a month and toggle each member **Paid / Unpaid**. Updates the ledger instantly.
6. **Ledger (`/ledger`)** — the shared, read-only record. Filter by Verified / Pending / Missing.
7. **Upload POP (`/upload`)** — 3 big steps for low-end phones: take photo → enter amount + reference → confirm. Saved as `pending`.
8. **Reports (`/reports`)** — pick a month, click **Print / Save as PDF**. Browser print dialog produces a clean one-page statement.

### Where the logic lives

Everything is in `src/lib/store.ts`:

- `store.createGroup(...)` — create the group + seed members
- `store.joinGroup(code, name)` — add a member via invite code
- `store.setPaid(memberId, month, paid)` — admin marks paid/unpaid
- `store.recordPOP({...})` — member submits a POP (status `pending`)
- `useStokvel()` — React hook that returns the live state

To plug in a real backend later, replace the body of those four functions with `fetch` calls. Components do not need to change.

---

## 6. Deployment

### Vercel (recommended)

1. Push the repo to GitHub.
2. In Vercel: **Add New Project** → import the repo.
3. Framework preset: **Vite**.
4. Settings (Vercel auto-detects, but for reference):
   - **Install command:** `npm install`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
5. Click **Deploy**.

`vercel.json` is included so deep links (e.g. `/dashboard`, `/join/ABC-1234`) refresh correctly instead of 404'ing:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### Netlify, Cloudflare Pages, GitHub Pages

Same idea: build command `npm run build`, publish directory `dist`, and add an SPA fallback rewriting all paths to `/index.html`.

---

## 7. FAQ

**Does StockVel-RSA touch any money?**
No. Members keep paying the treasurer the same way they always have (EFT, cash, transfer). We only record it.

**Is there a database?**
Not in the MVP. Data lives in `localStorage` per device. This keeps the demo zero-setup. Adding a real database is a one-file change in `src/lib/store.ts`.

**Can multiple devices share the same group?**
Not in the MVP — that requires a shared backend. The app is structured so this is the natural next step.

---

Built to support trust, not replace it.
