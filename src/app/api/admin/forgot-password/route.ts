import { NextResponse } from "next/server";
import { createAdminPasswordReset } from "@/lib/admin-auth";
import { sendAdminPasswordReset } from "@/lib/mailer";
import { hasReachedRateLimit, recordRateLimitHit } from "@/lib/rate-limit";
import { site } from "@/content/site";

const genericMessage = "If that address matches the admin account, a reset link has been sent.";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateLimitKey = `admin-reset:${ip}`;
  if (hasReachedRateLimit(rateLimitKey)) {
    return NextResponse.json({ message: "Too many reset requests. Please wait 10 minutes and try again." }, { status: 429 });
  }
  recordRateLimitHit(rateLimitKey);

  const { email } = (await request.json().catch(() => ({}))) as { email?: string };
  const adminEmail = (process.env.ADMIN_EMAIL || process.env.CONTACT_TO_EMAIL || site.contact.email).trim().toLowerCase();
  if (!email || email.trim().toLowerCase() !== adminEmail) {
    return NextResponse.json({ message: genericMessage });
  }

  try {
    const token = await createAdminPasswordReset();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const resetUrl = new URL(`/admin/reset-password?token=${encodeURIComponent(token)}`, origin).toString();
    await sendAdminPasswordReset(adminEmail, resetUrl);
    return NextResponse.json({ message: genericMessage });
  } catch (error) {
    console.error("Unable to send admin password reset", error);
    return NextResponse.json(
      { message: "Password reset email is not configured yet. Please contact the site administrator." },
      { status: 503 }
    );
  }
}
