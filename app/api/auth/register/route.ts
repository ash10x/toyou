import { NextRequest, NextResponse } from "next/server";
import {
  hashPassword,
  createSessionToken,
  PORTAL_COOKIE,
  PORTAL_MAX_AGE,
  PortalRole,
} from "@/server/portal-auth";
import { getPortalUserByEmail, createPortalUser } from "@/server/db/queries";
import { sendWelcomeEmail } from "@/server/email";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, role } = await request.json();

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["renter", "hoster"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await getPortalUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const password_hash = await hashPassword(password);
    const user = await createPortalUser({
      email,
      password_hash,
      first_name: firstName,
      last_name: lastName,
      phone: phone || undefined,
      role,
    });

    sendWelcomeEmail(user.first_name, user.email, user.role as PortalRole).catch(console.error);

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role as PortalRole,
      firstName: user.first_name,
      iat: Math.floor(Date.now() / 1000),
    });

    const response = NextResponse.json(
      { success: true, role: user.role, firstName: user.first_name },
      { status: 201 },
    );
    response.cookies.set(PORTAL_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: PORTAL_MAX_AGE,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
