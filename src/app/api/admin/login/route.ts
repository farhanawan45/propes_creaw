import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminToken, verifyAdminPassword } from "@/lib/admin-auth";
import { clearRateLimit, hasReachedRateLimit, recordRateLimitHit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateLimitKey = `admin-login:${ip}`;
    if (hasReachedRateLimit(rateLimitKey)) {
      return NextResponse.json({ message: "Too many attempts. Please wait and try again." }, { status: 429 });
    }
    const { password } = (await request.json().catch(() => ({}))) as { password?: string };
    if (!password || !(await verifyAdminPassword(password))) {
      const locked = recordRateLimitHit(rateLimitKey);
      return NextResponse.json(
        { message: locked ? "Too many incorrect attempts. Please wait 10 minutes and try again." : "Invalid password." },
        { status: locked ? 429 : 401 }
      );
    }
    clearRateLimit(rateLimitKey);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, createAdminToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  } catch (error) {
    console.error("Admin login configuration error", error);
    const message = error instanceof Error ? error.message : "";
    const configurationMessage = message.includes("ADMIN_PASSWORD")
      ? "GoDaddy ADMIN_PASSWORD is missing or shorter than 12 characters. Update that secret, then restart the app."
      : "Admin login configuration failed. Check the GoDaddy Runtime Logs for the exact server error.";
    return NextResponse.json(
      { message: configurationMessage, code: "ADMIN_AUTH_CONFIGURATION_ERROR" },
      { status: 500, headers: { "X-Admin-Auth-Version": "3" } }
    );
  }
}

