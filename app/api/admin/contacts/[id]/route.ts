import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/server/admin-auth";
import { deleteContactMessageById } from "@/server/db/queries";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteContactMessageById(Number(id));
  return NextResponse.json({ success: true });
}
