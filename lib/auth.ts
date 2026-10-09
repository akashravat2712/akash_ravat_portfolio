import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "portfolio_admin_session";

function getSecret(): string {
  return process.env.ADMIN_PASSWORD || "change-me-in-production";
}

function tokenFromPassword(password: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(`admin:${password}`)
    .digest("hex");
}

export function expectedToken(): string {
  return tokenFromPassword(getSecret());
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  if (!value) return false;
  const expected = expectedToken();
  try {
    return crypto.timingSafeEqual(
      Buffer.from(value),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

export function createSessionCookieValue(password: string): string | null {
  if (!password || password !== getSecret()) return null;
  return tokenFromPassword(password);
}

export { COOKIE_NAME };
