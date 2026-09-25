"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return setError(result.message || "Unable to sign in.");
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#04163f] px-5 py-12">
      <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-white p-7 shadow-2xl sm:p-10">
        <BrandLogo size="md" className="h-auto w-32" />
        <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#061a4a] text-white"><LockKeyhole size={21} /></div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">Admin portal</h1>
        <p className="mt-2 text-sm text-[#53617a]">Secure access to enquiries and newsletter subscribers.</p>
        <form onSubmit={submit} className="mt-7">
          <label htmlFor="password" className="text-sm font-semibold">Admin password</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce3ef] bg-white px-4 outline-none transition focus:border-[#fb532c] focus:ring-4 focus:ring-[#fb532c]/10" />
          {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
          <button disabled={loading} className="mt-5 h-12 w-full rounded-[10px] bg-[#fb532c] font-semibold text-white transition hover:bg-[#dc3f1d] disabled:opacity-60">{loading ? "Signing in..." : "Sign in"}</button>
        </form>
      </div>
    </main>
  );
}
