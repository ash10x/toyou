// Admin auth utilities — Web Crypto only (works in Edge middleware + Node 18+)

export type AdminRole = "super_admin" | "editor" | "viewer";

export type AdminSession = {
  userId: number;
  username: string;
  role: AdminRole;
  iat: number; // issued-at (seconds)
};

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || "change-this-secret-in-production";
}
export function getBootstrapUsername(): string {
  return process.env.ADMIN_USERNAME || "admin";
}
export function getBootstrapPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin";
}

// ── Password hashing (PBKDF2 via Web Crypto) ──────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16)) as Uint8Array<ArrayBuffer>;
  const key = await pbkdf2(password, salt);
  const saltHex = toHex(salt);
  const hashHex = toHex(new Uint8Array(key));
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = fromHex(saltHex) as Uint8Array<ArrayBuffer>;
  const key = await pbkdf2(password, salt);
  const newHex = toHex(new Uint8Array(key));
  return constantEqual(newHex, hashHex);
}

async function pbkdf2(password: string, salt: Uint8Array<ArrayBuffer>): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256
  );
}

// ── Session tokens (HMAC-SHA256 signed, base64 payload) ───────────────────

export async function createSessionToken(session: AdminSession): Promise<string> {
  const payload = btoa(JSON.stringify(session));
  const sig = await hmacSign(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expectedSig = await hmacSign(payload);
  if (!constantEqual(sig, expectedSig)) return null;
  try {
    const session = JSON.parse(atob(payload)) as AdminSession;
    if (Date.now() / 1000 - session.iat > SESSION_MAX_AGE) return null;
    return session;
  } catch {
    return null;
  }
}

async function hmacSign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getAdminSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toHex(new Uint8Array(sig));
}

// ── Helpers ───────────────────────────────────────────────────────────────

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array {
  return new Uint8Array((hex.match(/.{2}/g) ?? []).map((h) => parseInt(h, 16)));
}

function constantEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ── Role helpers ──────────────────────────────────────────────────────────

export function canWrite(role: AdminRole): boolean {
  return role === "super_admin" || role === "editor";
}

export function isSuperAdmin(role: AdminRole): boolean {
  return role === "super_admin";
}
