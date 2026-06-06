// Portal user auth utilities — Web Crypto only (same pattern as admin-auth.ts)

export type PortalRole = "renter" | "hoster";

export type PortalSession = {
  userId: number;
  email: string;
  role: PortalRole;
  firstName: string;
  iat: number;
};

export const PORTAL_COOKIE = "portal_session";
export const PORTAL_MAX_AGE = 60 * 60 * 24; // 24 hours

export function getPortalSecret(): string {
  return process.env.PORTAL_SECRET || "portal-secret-change-in-production";
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
    ["deriveBits"],
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256,
  );
}

// ── Session tokens (HMAC-SHA256 signed, base64 payload) ───────────────────

export async function createSessionToken(session: PortalSession): Promise<string> {
  const payload = btoa(JSON.stringify(session));
  const sig = await hmacSign(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<PortalSession | null> {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expectedSig = await hmacSign(payload);
  if (!constantEqual(sig, expectedSig)) return null;
  try {
    const session = JSON.parse(atob(payload)) as PortalSession;
    if (Date.now() / 1000 - session.iat > PORTAL_MAX_AGE) return null;
    return session;
  } catch {
    return null;
  }
}

async function hmacSign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getPortalSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
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
