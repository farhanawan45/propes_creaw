"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirm) return setMessage("Passwords do not match.");
    if (password.length < 12) return setMessage("Password must be at least 12 characters.");
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      setMessage(result.message || "Unable to reset password.");
      setSuccess(response.ok);
      if (response.ok) {
        setPassword("");
        setConfirm("");
      }
    } catch {
      setMessage("Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#04163f] px-5 py-12">
      <div className="w-full max-w-md rounded-[24px] bg-white p-7 shadow-2xl sm:p-10">
        <BrandLogo size="md" />
        <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#061a4a] text-white"><KeyRound size={21} /></div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">Choose a new password</h1>
        <p className="mt-2 text-sm text-[#53617a]">Use at least 12 characters and keep it private.</p>
        {!token ? <p className="mt-6 text-sm text-red-600">This reset link is invalid.</p> : (
          <form onSubmit={submit} className="mt-7">
            <label htmlFor="password" className="text-sm font-semibold">New password</label>
            <input id="password" type="password" autoComplete="new-password" required minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce3ef] px-4 outline-none focus:border-[#fb532c] focus:ring-4 focus:ring-[#fb532c]/10" />
            <label htmlFor="confirm-password" className="mt-4 block text-sm font-semibold">Confirm password</label>
            <input id="confirm-password" type="password" autoComplete="new-password" required minLength={12} value={confirm} onChange={(event) => setConfirm(event.target.value)} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce3ef] px-4 outline-none focus:border-[#fb532c] focus:ring-4 focus:ring-[#fb532c]/10" />
            {message && <p className={`mt-3 text-sm ${success ? "text-emerald-700" : "text-red-600"}`} role="status">{message}</p>}
            {!success && <button disabled={loading} className="mt-5 h-12 w-full rounded-[10px] bg-[#fb532c] font-semibold text-white disabled:opacity-60">{loading ? "Updating..." : "Update password"}</button>}
          </form>
        )}
        <Link href="/admin/login" className="mt-5 block text-center text-sm font-semibold text-[#061a4a] hover:text-[#fb532c]">Back to sign in</Link>
      </div>
    </main>
  );
}
