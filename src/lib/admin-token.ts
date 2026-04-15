import { SignJWT, jwtVerify } from "jose";
import { getAdminSessionSecret } from "@/lib/load-local-env";

const COOKIE_NAME = "admin_session";
const DAY = 60 * 60 * 24;

function getSecret(): Uint8Array {
  const s = getAdminSessionSecret();
  if (!s || s.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET doit faire au moins 16 caractères");
  }
  return new TextEncoder().encode(s);
}

function getSecretOptional(): Uint8Array | null {
  const s = getAdminSessionSecret();
  if (!s || s.length < 16) return null;
  return new TextEncoder().encode(s);
}

export async function signAdminToken(): Promise<string> {
  const secret = getSecret();
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${7}d`)
    .sign(secret);
}

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const secret = getSecretOptional();
  if (!secret) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export { COOKIE_NAME };

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: DAY * 7,
  };
}
