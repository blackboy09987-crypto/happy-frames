import crypto from "crypto";
import { cookies } from "next/headers";

const PASSWORD = process.env.ADMIN_PASSWORD || "";
export const COOKIE_NAME = "hf_admin";

// Password se ek stable token banata hai (cookie mein raw password store nahi hota).
export function tokenFor(pw) {
  return crypto.createHash("sha256").update("hf::" + pw).digest("hex");
}

export function expectedToken() {
  return PASSWORD ? tokenFor(PASSWORD) : null;
}

// Kya request bhejne wala admin hai? (API routes mein use hota hai)
// Next.js 15+ mein cookies() async hai — isliye await zaroori.
export async function isAdminRequest() {
  const want = expectedToken();
  if (!want) return false;
  const store = await cookies();
  const got = store.get(COOKIE_NAME)?.value;
  return Boolean(got) && got === want;
}
