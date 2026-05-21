import { NextResponse, NextRequest } from "next/server";
import { getCars, createCar } from "../../../../server/db/queries";
import { verify } from "../../../../server/auth/jwt";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!verify(token || ""))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const cars = await getCars();
  return NextResponse.json({ cars });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!verify(token || ""))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const car = await createCar(body);
  return NextResponse.json({ car });
}
