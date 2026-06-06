import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/server/admin-auth";
import { getBusinessInfo, upsertBusinessInfo } from "@/server/db/queries";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await getBusinessInfo();
  return NextResponse.json(data ?? {});
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const updated = await upsertBusinessInfo({
    phone: body.phone,
    email: body.email,
    address: body.address,
    hours: body.hours,
    facebook_url: body.facebook_url,
    instagram_url: body.instagram_url,
    twitter_url: body.twitter_url,
    maps_embed_url: body.maps_embed_url,
  });
  return NextResponse.json(updated);
}
