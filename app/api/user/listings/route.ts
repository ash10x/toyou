import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, PORTAL_COOKIE } from "@/server/portal-auth";
import { getListingsByUserId } from "@/server/db/queries";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(PORTAL_COOKIE)?.value ?? "";
  const session = await verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role !== "hoster") {
    return NextResponse.json({ error: "Only hosters can view listings" }, { status: 403 });
  }

  const listings = await getListingsByUserId(session.userId);
  return NextResponse.json(listings);
}
