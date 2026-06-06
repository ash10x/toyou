import { NextResponse } from "next/server";
import { PORTAL_COOKIE } from "@/server/portal-auth";

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(PORTAL_COOKIE, "", { maxAge: 0, path: "/" });
  return response;
}
