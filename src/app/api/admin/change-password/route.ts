import { NextResponse } from "next/server";
import { changeAdminPassword, isAdminAuthenticated } from "@/lib/admin-auth";
import { hasReachedRateLimit, recordRateLimitHit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ message: "Your admin session has expired. Please sign in again." }, { status: 401 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateLimitKey = `admin-change-password:${ip}`;
  if (hasReachedRateLimit(rateLimitKey)) return NextResponse.json({ message: "Too many attempts. Please wait 10 minutes and try again." }, { status: 429 });
  const { currentPassword, newPassword } = (await request.json().catch(() => ({}))) as { currentPassword?: string; newPassword?: string };
  if (!currentPassword || !newPassword || newPassword.length < 12) return NextResponse.json({ message: "Enter your current password and a new password of at least 12 characters." }, { status: 422 });
  if (currentPassword === newPassword) return NextResponse.json({ message: "Your new password must be different from the current password." }, { status: 422 });
  try {
    const changed = await changeAdminPassword(currentPassword, newPassword);
    if (!changed) { recordRateLimitHit(rateLimitKey); return NextResponse.json({ message: "Current password is incorrect." }, { status: 401 }); }
    return NextResponse.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Unable to change admin password", error);
    return NextResponse.json({ message: "Unable to change the password right now. Please try again." }, { status: 500 });
  }
}