import jwt from "jsonwebtoken";

const SECRET = process.env.ADMIN_JWT_SECRET || "change-me";

export function sign(payload: object, opts?: jwt.SignOptions) {
  return jwt.sign(payload, SECRET, { expiresIn: "8h", ...(opts || {}) });
}

export function verify(token: string) {
  try {
    return jwt.verify(token, SECRET) as any;
  } catch (err) {
    return null;
  }
}
