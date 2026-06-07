import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/server/admin-auth";
import { getBookingById, deleteBookingById, updateBookingById } from "@/server/db/queries";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const booking = await getBookingById(Number(id));
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { status } = await request.json();
  const VALID = ["pending", "confirmed", "active", "completed", "cancelled"];
  if (!VALID.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const updated = await updateBookingById(Number(id), { status });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteBookingById(Number(id));
  return NextResponse.json({ success: true });
}
