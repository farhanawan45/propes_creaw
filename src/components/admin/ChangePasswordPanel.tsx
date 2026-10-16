"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, KeyRound, X } from "lucide-react";

function PasswordField({ id, label, value, onChange, autoComplete }: { id: string; label: string; value: string; onChange: (value: string) => void; autoComplete: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <label htmlFor={id} className="block text-sm font-semibold">
      {label}
      <span className="relative mt-2 block">
        <input id={id} type={visible ? "text" : "password"} autoComplete={autoComplete} required value={value} onChange={(event) => onChange(event.target.value)} className="h-12 w-full rounded-[10px] border border-[#dce3ef] px-4 pr-12 font-normal outline-none transition focus:border-[#fb532c] focus:ring-4 focus:ring-[#fb532c]/10" />
        <button type="button" onClick={() => setVisible((shown) => !shown)} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#53617a] hover:text-[#061a4a]">{visible ? <EyeOff size={19} /> : <Eye size={19} />}</button>
      </span>
    </label>
  );
}

export default function ChangePasswordPanel() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function close() { setOpen(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setMessage(""); setError(""); }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(""); setMessage("");
    if (newPassword !== confirmPassword) return setError("New passwords do not match.");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) });
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Unable to change password.");
      setMessage(result.message || "Password changed successfully.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to change password."); }
    finally { setLoading(false); }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-[10px] border border-[#dce3ef] px-3 py-2 text-sm font-semibold sm:px-4"><KeyRound size={17} /><span className="hidden sm:inline">Change password</span></button>
      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#04163f]/65 p-4" onClick={close}>
        <section onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
          <div className="flex items-start justify-between gap-4"><div><h2 className="text-2xl font-semibold">Change password</h2><p className="mt-1 text-sm text-[#53617a]">Use at least 12 characters for the new password.</p></div><button type="button" onClick={close} aria-label="Close" className="rounded-[10px] bg-[#f3f6fb] p-2"><X size={19} /></button></div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <PasswordField id="current-admin-password" label="Current password" value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" />
            <PasswordField id="new-admin-password" label="New password" value={newPassword} onChange={setNewPassword} autoComplete="new-password" />
            <PasswordField id="confirm-admin-password" label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            {message && <p className="text-sm text-emerald-700" role="status">{message}</p>}
            <button disabled={loading} className="h-12 w-full rounded-[10px] bg-[#fb532c] font-semibold text-white hover:bg-[#dc3f1d] disabled:opacity-60">{loading ? "Updating..." : "Update password"}</button>
          </form>
        </section>
      </div>}
    </>
  );
}