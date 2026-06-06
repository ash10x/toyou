import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE, type AdminRole } from "@/server/admin-auth";
import { updateAdminUserRole, deleteAdminUserById, countAdminUsers } from "@/server/db/queries";

const VALID_ROLES: AdminRole[] = ["super_admin", "editor", "viewer"];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const session = await verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { role } = await request.json().catch(() => ({}));
  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: `role must be one of: ${VALID_ROLES.join(", ")}` }, { status: 400 });
  }
  const updated = await updateAdminUserRole(Number(id), role);
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const session = await verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const targetId = Number(id);

  // Prevent deleting yourself
  if (session.userId === targetId) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  // Prevent deleting the last super_admin
  const total = await countAdminUsers();
  if (total <= 1) {
    return NextResponse.json({ error: "Cannot delete the last admin user" }, { status: 400 });
  }

  await deleteAdminUserById(targetId);
  return NextResponse.json({ success: true });
}
