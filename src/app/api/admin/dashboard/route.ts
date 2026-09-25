import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ensureSchema, getDb } from "@/lib/db";

const statuses = new Set(["new", "contacted", "qualified", "booked", "closed"]);

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await ensureSchema();
  const q = request.nextUrl.searchParams.get("q")?.trim() || "";
  const status = request.nextUrl.searchParams.get("status") || "all";
  const values: string[] = [];
  const filters: string[] = [];
  if (q) {
    filters.push("(full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)");
    const like = `%${q}%`;
    values.push(like, like, like, like);
  }
  if (statuses.has(status)) {
    filters.push("status = ?");
    values.push(status);
  }
  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const db = getDb();
  const [enquiries] = await db.execute<RowDataPacket[]>(
    `SELECT id, full_name, email, phone, event_date, group_size, services, message, status, email_status, created_at
     FROM enquiries ${where} ORDER BY created_at DESC LIMIT 250`,
    values
  );
  const [subscribers] = await db.execute<RowDataPacket[]>(
    "SELECT id, email, status, email_status, created_at FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 500"
  );
  const [stats] = await db.execute<RowDataPacket[]>(`
    SELECT
      COUNT(*) AS total,
      SUM(status = 'new') AS new_count,
      SUM(status = 'booked') AS booked_count,
      SUM(created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) AS last_30_days
    FROM enquiries
  `);
  return NextResponse.json({ enquiries, subscribers, stats: stats[0] });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as { id?: number; status?: string };
  if (!body.id || !body.status || !statuses.has(body.status)) {
    return NextResponse.json({ message: "Invalid update" }, { status: 422 });
  }
  await ensureSchema();
  const [result] = await getDb().execute<ResultSetHeader>("UPDATE enquiries SET status = ? WHERE id = ?", [body.status, body.id]);
  return NextResponse.json({ ok: true, updated: result.affectedRows });
}

