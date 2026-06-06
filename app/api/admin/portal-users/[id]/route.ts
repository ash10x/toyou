import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/server/admin-auth";
import { getPortalUserById, updatePortalUser, deletePortalUserById } from "@/server/db/queries";

async function auth(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  return verifySessionToken(token);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const valid = await auth(request);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const user = await getPortalUserById(Number(id));
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { password_hash: _, ...safe } = user;
  return NextResponse.json(safe);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const valid = await auth(request);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { role, is_active } = body;

  const updates: Parameters<typeof updatePortalUser>[1] = {};
  if (role !== undefined) updates.role = role;
  if (is_active !== undefined) updates.is_active = is_active;

  const updated = await updatePortalUser(Number(id), updates);
  const { password_hash: _, ...safe } = updated;
  return NextResponse.json(safe);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const valid = await auth(request);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await deletePortalUserById(Number(id));
  return NextResponse.json({ success: true });
}
