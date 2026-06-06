import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  verifySessionToken,
  hashPassword,
  verifyPassword,
  getBootstrapUsername,
  getBootstrapPassword,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type AdminRole,
} from "@/server/admin-auth";
import {
  getAdminUserByLogin,
  countAdminUsers,
  createAdminUser,
} from "@/server/db/queries";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json().catch(() => ({}));
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  let userId: number;
  let resolvedUsername: string;
  let role: AdminRole;

  try {
    // Try DB user first
    const dbUser = await getAdminUserByLogin(username.trim());

    if (dbUser) {
      const valid = await verifyPassword(password, dbUser.password_hash);
      if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      userId = dbUser.id;
      resolvedUsername = dbUser.username;
      role = dbUser.role as AdminRole;
    } else {
      // Bootstrap: allow env-var credentials when no DB user matches
      const envUser = getBootstrapUsername();
      const envPass = getBootstrapPassword();
      if (username.trim() !== envUser || password !== envPass) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      // Auto-create the first super_admin if none exist yet
      const total = await countAdminUsers();
      if (total === 0) {
        const created = await createAdminUser({
          username: envUser,
          email: `${envUser}@admin.local`,
          password_hash: await hashPassword(envPass),
          role: "super_admin",
        });
        userId = created.id;
        resolvedUsername = created.username;
        role = "super_admin";
      } else {
        // Users exist but none match — reject
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    }
  } catch {
    // DB not available (e.g. table not migrated yet) — fall back to env-var only
    const envUser = getBootstrapUsername();
    const envPass = getBootstrapPassword();
    if (username.trim() !== envUser || password !== envPass) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    userId = 0;
    resolvedUsername = envUser;
    role = "super_admin";
  }

  const token = await createSessionToken({
    userId,
    username: resolvedUsername,
    role,
    iat: Math.floor(Date.now() / 1000),
  });

  const response = NextResponse.json({ success: true, username: resolvedUsername, role });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const session = await verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
