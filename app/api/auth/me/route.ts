import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, PORTAL_COOKIE } from "@/server/portal-auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(PORTAL_COOKIE)?.value ?? "";
  const session = await verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({
    userId: session.userId,
    email: session.email,
    role: session.role,
    firstName: session.firstName,
  });
}
