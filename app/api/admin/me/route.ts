import { NextResponse, NextRequest } from "next/server";
import { verify } from "../../../../server/auth/jwt";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ user: null });

  const payload = verify(token);
  if (!payload) return NextResponse.json({ user: null });

  return NextResponse.json({ user: payload });
}
