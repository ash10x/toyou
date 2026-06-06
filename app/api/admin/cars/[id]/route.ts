import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/server/admin-auth";
import { updateCar, deleteCarById } from "@/server/db/queries";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const updated = await updateCar(Number(id), {
    name: body.name,
    image: body.image,
    price: body.price !== undefined ? Number(body.price) : undefined,
    seats: body.seats !== undefined ? Number(body.seats) : undefined,
    fuel: body.fuel,
    body: body.body,
    transmission: body.transmission,
    featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
  });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteCarById(Number(id));
  return NextResponse.json({ success: true });
}
