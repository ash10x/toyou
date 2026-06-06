import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, PORTAL_COOKIE } from "@/server/portal-auth";
import { getBookingsByEmail } from "@/server/db/queries";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(PORTAL_COOKIE)?.value ?? "";
  const session = await verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await getBookingsByEmail(session.email);
  return NextResponse.json(bookings);
}
