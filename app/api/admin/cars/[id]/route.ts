import { NextResponse, NextRequest } from "next/server";
import { updateCar, deleteCar } from "../../../../../server/db/queries";
import { verify } from "../../../../../server/auth/jwt";

export async function PUT(req: NextRequest, ctx: any) {
  const token = req.cookies.get("admin_token")?.value;
  if (!verify(token || ""))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { params } = ctx;
  const body = await req.json();
  const car = await updateCar(Number(params.id), body);
  return NextResponse.json({ car });
}

export async function DELETE(req: NextRequest, ctx: any) {
  const token = req.cookies.get("admin_token")?.value;
  if (!verify(token || ""))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { params } = ctx;
  const info = await deleteCar(Number(params.id));
  return NextResponse.json({ ok: true, ...info });
}
