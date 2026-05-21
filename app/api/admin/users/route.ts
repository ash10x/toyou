import { NextResponse, NextRequest } from "next/server";
import { getUsers } from "../../../../server/db/queries";
import { verify } from "../../../../server/auth/jwt";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!verify(token || ""))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const users = await getUsers();
  return NextResponse.json({ users });
}
