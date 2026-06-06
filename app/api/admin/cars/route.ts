import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/server/admin-auth";
import { getCars, createCar } from "@/server/db/queries";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await getCars();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (!body.name || !body.image || !body.price) {
    return NextResponse.json({ error: "name, image, and price are required" }, { status: 400 });
  }
  const car = await createCar({
    name: body.name,
    image: body.image,
    price: Number(body.price),
    seats: body.seats ? Number(body.seats) : undefined,
    fuel: body.fuel,
    body: body.body,
    transmission: body.transmission,
    featured: Boolean(body.featured),
  });
  return NextResponse.json(car, { status: 201 });
}
