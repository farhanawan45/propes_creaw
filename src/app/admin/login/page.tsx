"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        cache: "no-store",
        signal: controller.signal,
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Unable to sign in.");

      // A full navigation makes the newly issued HttpOnly session cookie
      // available immediately on managed/proxied hosting such as GoDaddy.
      window.location.assign(new URL("/admin", window.location.origin).href);
    } catch (error) {
      setError(
        error instanceof DOMException && error.name === "AbortError"
          ? "Login timed out. Please check your connection and try again."
          : error instanceof Error
            ? error.message
            : "Unable to sign in. Please try again."
      );
      setLoading(false);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#04163f] px-5 py-12">
      <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-white p-7 shadow-2xl sm:p-10">
        <BrandLogo size="md" />
        <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#061a4a] text-white"><LockKeyhole size={21} /></div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">Admin portal</h1>
        <p className="mt-2 text-sm text-[#53617a]">Secure access to enquiries and newsletter subscribers.</p>
        <form onSubmit={submit} className="mt-7">
          <label htmlFor="password" className="text-sm font-semibold">Admin password</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce3ef] bg-white px-4 outline-none transition focus:border-[#fb532c] focus:ring-4 focus:ring-[#fb532c]/10" />
          {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
          <button disabled={loading} className="mt-5 h-12 w-full rounded-[10px] bg-[#fb532c] font-semibold text-white transition hover:bg-[#dc3f1d] disabled:opacity-60">{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        <Link href="/admin/forgot-password" className="mt-5 block text-center text-sm font-semibold text-[#061a4a] transition-colors hover:text-[#fb532c]">Forgot password?</Link>
      </div>
    </main>
  );
}
