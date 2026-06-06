import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, PORTAL_COOKIE, hashPassword, verifyPassword } from "@/server/portal-auth";
import { getPortalUserById, updatePortalUser } from "@/server/db/queries";

async function getSession(request: NextRequest) {
  const token = request.cookies.get(PORTAL_COOKIE)?.value ?? "";
  return verifySessionToken(token);
}

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getPortalUserById(session.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { password_hash: _, ...safe } = user;
  return NextResponse.json(safe);
}

export async function PUT(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { firstName, lastName, phone, currentPassword, newPassword } = body;

  const updates: Parameters<typeof updatePortalUser>[1] = {};

  if (firstName) updates.first_name = firstName;
  if (lastName) updates.last_name = lastName;
  if (phone !== undefined) updates.phone = phone;

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Current password required to set new password" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }
    const user = await getPortalUserById(session.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const valid = await verifyPassword(currentPassword, user.password_hash);
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    updates.password_hash = await hashPassword(newPassword);
  }

  const updated = await updatePortalUser(session.userId, updates);
  const { password_hash: _, ...safe } = updated;
  return NextResponse.json(safe);
}
