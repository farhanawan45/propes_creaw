"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError(false);
    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      setMessage(result.message || "Unable to request a reset link.");
      setError(!response.ok);
    } catch {
      setMessage("Unable to request a reset link. Please try again.");
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#04163f] px-5 py-12">
      <div className="w-full max-w-md rounded-[24px] bg-white p-7 shadow-2xl sm:p-10">
        <BrandLogo size="md" />
        <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#061a4a] text-white"><Mail size={21} /></div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">Reset password</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#53617a]">Enter the admin email address and we will send a secure reset link.</p>
        <form onSubmit={submit} className="mt-7">
          <label htmlFor="email" className="text-sm font-semibold">Admin email</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce3ef] px-4 outline-none focus:border-[#fb532c] focus:ring-4 focus:ring-[#fb532c]/10" />
          {message && <p className={`mt-3 text-sm ${error ? "text-red-600" : "text-emerald-700"}`} role="status">{message}</p>}
          <button disabled={loading} className="mt-5 h-12 w-full rounded-[10px] bg-[#fb532c] font-semibold text-white disabled:opacity-60">{loading ? "Sending..." : "Send reset link"}</button>
        </form>
        <Link href="/admin/login" className="mt-5 block text-center text-sm font-semibold text-[#061a4a] hover:text-[#fb532c]">Back to sign in</Link>
      </div>
    </main>
  );
}
