import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ensureSchema, getDb } from "@/lib/db";

function csv(value: unknown) {
  const text = value instanceof Date ? value.toISOString() : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await ensureSchema();
  const [rows] = await getDb().execute<RowDataPacket[]>(
    "SELECT id, created_at, full_name, email, phone, event_date, group_size, services, status, email_status, message FROM enquiries ORDER BY created_at DESC"
  );
  const headers = ["Reference", "Created", "Name", "Email", "Phone", "Event date", "Group size", "Services", "Status", "Email status", "Message"];
  const lines = rows.map((r) => [
    `PNC-${r.id}`, r.created_at, r.full_name, r.email, r.phone, r.event_date, r.group_size,
    typeof r.services === "string" ? r.services : JSON.stringify(r.services), r.status, r.email_status, r.message,
  ].map(csv).join(","));
  return new NextResponse([headers.map(csv).join(","), ...lines].join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pnc-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

