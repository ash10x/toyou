import { NextResponse, NextRequest } from "next/server";
import { getUserByEmail } from "../../../../server/db/queries";
import { sign } from "../../../../server/auth/jwt";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Basic example: validate against users table
  const user = await getUserByEmail(email);
  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // Compare password with stored hash
  const ok = bcrypt.compareSync(password, user.password_hash || "");
  if (!ok)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  if (!user.is_admin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const token = sign({ id: user.id, email: user.email, is_admin: true });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, { httpOnly: true, path: "/" });
  return res;
}
