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
    if (!password || !verifyAdminPassword(password)) {
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
    return NextResponse.json(
      { message: "Admin login is not configured correctly. Please contact the site administrator." },
      { status: 500 }
    );
  }
}

