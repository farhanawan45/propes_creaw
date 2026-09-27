import { NextResponse } from "next/server";
import { resetAdminPassword } from "@/lib/admin-auth";
import { hasReachedRateLimit, recordRateLimitHit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateLimitKey = `admin-reset-submit:${ip}`;
  if (hasReachedRateLimit(rateLimitKey)) {
    return NextResponse.json({ message: "Too many attempts. Please wait 10 minutes and try again." }, { status: 429 });
  }

  const { token, password } = (await request.json().catch(() => ({}))) as { token?: string; password?: string };
  if (!token || token.length !== 64 || !password || password.length < 12) {
    recordRateLimitHit(rateLimitKey);
    return NextResponse.json({ message: "Use a valid reset link and a password of at least 12 characters." }, { status: 422 });
  }

  try {
    const reset = await resetAdminPassword(token, password);
    if (!reset) {
      recordRateLimitHit(rateLimitKey);
      return NextResponse.json({ message: "This reset link is invalid, expired, or has already been used." }, { status: 400 });
    }
    return NextResponse.json({ ok: true, message: "Password updated. You can now sign in." });
  } catch (error) {
    console.error("Unable to reset admin password", error);
    return NextResponse.json({ message: "Unable to reset the password right now. Please try again." }, { status: 500 });
  }
}
