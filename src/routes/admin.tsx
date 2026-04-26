import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { GROUP } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · TrustVel" },
      { name: "description", content: "Manage members, roles, contribution cycles, and approvals for your stokvel." },
    ],
  }),
  component: AdminPage,
});

const MEMBERS = [
  { name: "Mam' Sibongile Dlamini", role: "Treasurer", phone: "+27 83 412 0091", joined: "Mar 2018", status: "Active" },
  { name: "Sipho Mthembu", role: "Trustee", phone: "+27 71 220 4456", joined: "Mar 2018", status: "Active" },
  { name: "Thabo Nkosi", role: "Member", phone: "+27 82 661 7723", joined: "Jan 2020", status: "Active" },
  { name: "Lerato Mokoena", role: "Member", phone: "+27 76 882 1190", joined: "Jul 2021", status: "Active" },
  { name: "Bongani Khumalo", role: "Auditor", phone: "+27 84 110 5562", joined: "Feb 2022", status: "Active" },
  { name: "Naledi Tshabalala", role: "Member", phone: "+27 79 502 8841", joined: "Aug 2023", status: "Pending invite" },
  { name: "Refilwe Mahlangu", role: "Member", phone: "+27 72 991 4420", joined: "Jan 2024", status: "Active" },
];

const APPROVALS = [
  { t: "Edit September verified payment from Sipho M.", who: "Bongani K. (Auditor)", needs: "1 of 2 trustees" },
  { t: "Add new member: Zanele Mbeki", who: "Mam' Sibongile (Treasurer)", needs: "1 of 2 trustees" },
];

function AdminPage() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      <section className="border-b-2 border-ink">
        <div className="container-edit py-10 md:py-14">
          <Reveal>
            <p className="eyebrow">Admin · {GROUP.name}</p>
            <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h1 className="text-[36px] md:text-[52px] font-semibold leading-[1.05]">Group management</h1>
              <div className="flex gap-3">
                <button className="btn-stamp btn-ghost h-12 px-5 text-[14px]">+ New cycle</button>
                <button className="btn-stamp btn-aloe h-12 px-5 text-[14px]">+ Invite member</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pending approvals */}
      <section className="border-b-2 border-ink bg-brass-soft">
        <div className="container-edit py-8">
          <Reveal>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="eyebrow" style={{ color: "oklch(0.50 0.13 80)" }}>Awaiting approval</p>
                <h2 className="mt-2 text-[22px] font-semibold">2 changes need a second trustee</h2>
              </div>
            </div>
          </Reveal>
          <div className="space-y-3">
            {APPROVALS.map((a, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="bg-white border-2 border-ink/10 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-medium text-[16px]">{a.t}</p>
                    <p className="num text-[12px] text-ink/65 mt-1">REQUESTED BY {a.who.toUpperCase()} · NEEDS {a.needs.toUpperCase()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="h-10 px-4 border-2 border-ink/15 hover:border-ink text-[14px] font-medium">Decline</button>
                    <button className="h-10 px-4 bg-aloe text-paper border-2 border-aloe text-[14px] font-medium">Approve</button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="border-b-2 border-ink">
        <div className="container-edit py-12">
          <Reveal>
            <p className="eyebrow">Members</p>
            <h2 className="mt-2 text-[24px] md:text-[28px] font-semibold">{MEMBERS.length} people on this ledger</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-6 panel">
              <div className="grid grid-cols-12 px-5 py-3 border-b-2 border-ink bg-paper num text-[11px] uppercase tracking-wider text-ink/60">
                <p className="col-span-5">Member</p>
                <p className="col-span-3">Role</p>
                <p className="col-span-2 hidden md:block">Joined</p>
                <p className="col-span-2 text-right">Status</p>
              </div>
              {MEMBERS.map((m) => (
                <div key={m.name} className="grid grid-cols-12 items-center px-5 py-4 border-b border-rule last:border-0 hover:bg-paper">
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <span className="shrink-0 w-9 h-9 bg-aloe-soft text-aloe font-mono font-semibold text-[12px] inline-flex items-center justify-center border border-aloe/20">
                      {m.name.split(" ").slice(-2).map((p) => p[0]).join("")}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-[15px] truncate">{m.name}</p>
                      <p className="num text-[12px] text-ink/60 truncate">{m.phone}</p>
                    </div>
                  </div>
                  <p className="col-span-3 num text-[13px] uppercase tracking-wider text-ink/75">{m.role}</p>
                  <p className="col-span-2 num text-[13px] text-ink/65 hidden md:block">{m.joined}</p>
                  <div className="col-span-2 flex justify-end">
                    <span className={m.status === "Active" ? "pill pill-verified" : "pill pill-pending"}>
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cycle settings */}
      <section>
        <div className="container-edit py-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Reveal>
            <div className="panel-soft p-6 md:p-7">
              <p className="eyebrow">Cycle settings</p>
              <h3 className="mt-2 text-[22px] font-semibold">Monthly contribution</h3>
              <p className="mt-4 num text-[36px] font-semibold">R 500.00</p>
              <p className="num text-[12px] text-ink/60 mt-1">DUE BY THE 7TH · OF EACH MONTH</p>
              <div className="mt-6 flex gap-2">
                <button className="btn-stamp btn-ghost h-11 px-4 text-[13px]">Change amount</button>
                <button className="btn-stamp btn-ghost h-11 px-4 text-[13px]">Change due date</button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="panel-soft p-6 md:p-7">
              <p className="eyebrow">Reminders</p>
              <h3 className="mt-2 text-[22px] font-semibold">SMS & WhatsApp nudges</h3>
              <ul className="mt-5 space-y-3 text-[15px]">
                <li className="flex items-center justify-between"><span>3 days before due</span><span className="pill pill-verified">On</span></li>
                <li className="flex items-center justify-between"><span>On the due date</span><span className="pill pill-verified">On</span></li>
                <li className="flex items-center justify-between"><span>3 days overdue</span><span className="pill pill-pending">Off</span></li>
              </ul>
              <button className="mt-6 btn-stamp btn-aloe h-11 px-4 text-[13px]">Edit reminders</button>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
