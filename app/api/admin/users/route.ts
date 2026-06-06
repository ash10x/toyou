import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE, hashPassword, type AdminRole } from "@/server/admin-auth";
import { getAllAdminUsers, createAdminUser } from "@/server/db/queries";

const VALID_ROLES: AdminRole[] = ["super_admin", "editor", "viewer"];

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const session = await verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const users = await getAllAdminUsers();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const session = await verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const { username, email, password, role } = body;

  if (!username?.trim() || !email?.trim() || !password || !role) {
    return NextResponse.json({ error: "username, email, password, and role are required" }, { status: 400 });
  }
  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: `role must be one of: ${VALID_ROLES.join(", ")}` }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const password_hash = await hashPassword(password);
  const created = await createAdminUser({ username: username.trim(), email: email.trim(), password_hash, role });
  return NextResponse.json(
    { id: created.id, username: created.username, email: created.email, role: created.role, created_at: created.created_at },
    { status: 201 }
  );
}
