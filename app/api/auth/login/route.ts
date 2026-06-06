import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createSessionToken,
  PORTAL_COOKIE,
  PORTAL_MAX_AGE,
  PortalRole,
} from "@/server/portal-auth";
import { getPortalUserByEmail } from "@/server/db/queries";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await getPortalUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!user.is_active) {
      return NextResponse.json({ error: "Your account has been suspended. Contact support." }, { status: 403 });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role as PortalRole,
      firstName: user.first_name,
      iat: Math.floor(Date.now() / 1000),
    });

    const response = NextResponse.json({ success: true, role: user.role, firstName: user.first_name });
    response.cookies.set(PORTAL_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: PORTAL_MAX_AGE,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
