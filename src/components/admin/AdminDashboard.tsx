"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Download, Inbox, LogOut, Mail, RefreshCw, Search, Users } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

type Enquiry = { id: number; full_name: string; email: string; phone: string; event_date: string; group_size: string; services: string | string[]; message: string; status: string; email_status: string; created_at: string };
type Subscriber = { id: number; email: string; status: string; email_status: string; created_at: string };
type Payload = { enquiries: Enquiry[]; subscribers: Subscriber[]; stats: { total: number; new_count: number; booked_count: number; last_30_days: number } };
const statusOptions = ["new", "contacted", "qualified", "booked", "closed"];

function date(value: string) { return new Intl.DateTimeFormat("en-NZ", { dateStyle: "medium", timeStyle: "short", timeZone: "Pacific/Auckland" }).format(new Date(value)); }
function services(value: Enquiry["services"]) {
  if (Array.isArray(value)) return value.join(", ");
  try { return (JSON.parse(value) as string[]).join(", "); } catch { return value; }
}

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<Payload | null>(null);
  const [tab, setTab] = useState<"enquiries" | "subscribers">("enquiries");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch(`/api/admin/dashboard?q=${encodeURIComponent(query)}&status=${status}`, { cache: "no-store" });
    if (response.status === 401) return router.replace("/admin/login");
    setData(await response.json());
    setLoading(false);
  }, [query, router, status]);

  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);

  const stats = useMemo(() => [
    ["Total enquiries", data?.stats.total || 0, Inbox],
    ["New leads", data?.stats.new_count || 0, Mail],
    ["Booked", data?.stats.booked_count || 0, CalendarDays],
    ["Subscribers", data?.subscribers.length || 0, Users],
  ] as const, [data]);

  async function updateStatus(id: number, next: string) {
    await fetch("/api/admin/dashboard", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: next }) });
    setSelected((item) => item?.id === id ? { ...item, status: next } : item);
    load();
  }

  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); router.replace("/admin/login"); router.refresh(); }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[#dce3ef] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-4"><BrandLogo className="h-auto w-24" /><span className="hidden h-7 w-px bg-[#dce3ef] sm:block" /><span className="hidden text-sm font-semibold sm:block">Admin Console</span></div>
          <div className="flex items-center gap-2"><a href="/" target="_blank" className="rounded-[10px] border border-[#dce3ef] px-4 py-2 text-sm font-semibold">View website</a><button onClick={logout} aria-label="Sign out" className="rounded-[10px] border border-[#dce3ef] p-2.5"><LogOut size={18} /></button></div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">
        <div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#fb532c]">Operations overview</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Leads & audience</h1></div>
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value, Icon]) => <div key={label} className="rounded-2xl border border-[#dce3ef] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-[#53617a]">{label}</span><Icon size={18} className="text-[#fb532c]" /></div><strong className="mt-3 block text-3xl">{value}</strong></div>)}
        </section>

        <section className="mt-7 overflow-hidden rounded-2xl border border-[#dce3ef] bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#dce3ef] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2"><button onClick={() => setTab("enquiries")} className={`px-4 py-2 text-sm font-semibold ${tab === "enquiries" ? "bg-[#061a4a] text-white" : "bg-[#f3f6fb]"}`}>Enquiries</button><button onClick={() => setTab("subscribers")} className={`px-4 py-2 text-sm font-semibold ${tab === "subscribers" ? "bg-[#061a4a] text-white" : "bg-[#f3f6fb]"}`}>Subscribers</button></div>
            <div className="flex flex-wrap gap-2">
              {tab === "enquiries" && <><label className="flex h-10 min-w-56 items-center gap-2 rounded-[10px] border border-[#dce3ef] px-3"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search leads" className="min-w-0 flex-1 outline-none" /></label><select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-[10px] border border-[#dce3ef] bg-white px-3 text-sm"><option value="all">All statuses</option>{statusOptions.map((s) => <option key={s}>{s}</option>)}</select><a href="/api/admin/export" className="flex h-10 items-center gap-2 rounded-[10px] bg-[#fb532c] px-4 text-sm font-semibold text-white"><Download size={16} /> Export CSV</a></>}
              <button onClick={load} aria-label="Refresh" className="h-10 rounded-[10px] border border-[#dce3ef] px-3"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {tab === "enquiries" ? <table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#f8faff] text-xs uppercase tracking-wider text-[#53617a]"><tr><th className="px-5 py-4">Lead</th><th className="px-5 py-4">Event</th><th className="px-5 py-4">Services</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Received</th></tr></thead><tbody>{data?.enquiries.map((item) => <tr key={item.id} onClick={() => setSelected(item)} className="cursor-pointer border-t border-[#edf1f7] hover:bg-[#f8faff]"><td className="px-5 py-4"><strong>{item.full_name}</strong><span className="mt-1 block text-[#53617a]">{item.email}</span></td><td className="px-5 py-4">{String(item.event_date).slice(0, 10)}<span className="mt-1 block text-[#53617a]">{item.group_size} guests</span></td><td className="max-w-xs px-5 py-4 text-[#53617a]">{services(item.services)}</td><td className="px-5 py-4"><span className="rounded-full bg-[#061a4a]/8 px-3 py-1 font-semibold capitalize">{item.status}</span></td><td className="px-5 py-4 text-[#53617a]">{date(item.created_at)}</td></tr>)}</tbody></table> : <table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-[#f8faff] text-xs uppercase tracking-wider text-[#53617a]"><tr><th className="px-5 py-4">Email</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Notification</th><th className="px-5 py-4">Joined</th></tr></thead><tbody>{data?.subscribers.map((item) => <tr key={item.id} className="border-t border-[#edf1f7]"><td className="px-5 py-4 font-semibold">{item.email}</td><td className="px-5 py-4 capitalize">{item.status}</td><td className="px-5 py-4 capitalize">{item.email_status}</td><td className="px-5 py-4 text-[#53617a]">{date(item.created_at)}</td></tr>)}</tbody></table>}
            {!loading && ((tab === "enquiries" && !data?.enquiries.length) || (tab === "subscribers" && !data?.subscribers.length)) && <p className="p-10 text-center text-[#53617a]">No records found.</p>}
          </div>
        </section>
      </div>

      {selected && <div className="fixed inset-0 z-40 flex justify-end bg-[#04163f]/55 p-3 sm:p-5" onClick={() => setSelected(null)}><aside onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-[#fb532c]">PNC-{selected.id}</p><h2 className="mt-1 text-2xl font-semibold">{selected.full_name}</h2></div><button onClick={() => setSelected(null)} className="rounded-[10px] bg-[#f3f6fb] px-3 py-2">Close</button></div><div className="mt-7 grid gap-4 sm:grid-cols-2">{[["Email", selected.email], ["Phone", selected.phone], ["Event date", String(selected.event_date).slice(0, 10)], ["Group size", selected.group_size], ["Services", services(selected.services)], ["Received", date(selected.created_at)]].map(([label, value]) => <div key={label} className="rounded-xl bg-[#f3f6fb] p-4"><span className="text-xs uppercase tracking-wider text-[#53617a]">{label}</span><p className="mt-1 break-words font-semibold">{value}</p></div>)}</div><div className="mt-4 rounded-xl bg-[#f3f6fb] p-4"><span className="text-xs uppercase tracking-wider text-[#53617a]">Message</span><p className="mt-2 whitespace-pre-wrap leading-relaxed">{selected.message}</p></div><div className="mt-6"><label className="text-sm font-semibold">Lead status</label><select value={selected.status} onChange={(e) => updateStatus(selected.id, e.target.value)} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce3ef] bg-white px-4 capitalize">{statusOptions.map((s) => <option key={s}>{s}</option>)}</select></div><div className="mt-4 grid grid-cols-2 gap-3"><a href={`mailto:${selected.email}`} className="rounded-[10px] bg-[#061a4a] px-4 py-3 text-center font-semibold text-white">Send email</a><a href={`tel:${selected.phone}`} className="rounded-[10px] bg-[#fb532c] px-4 py-3 text-center font-semibold text-white">Call lead</a></div></aside></div>}
    </main>
  );
}
