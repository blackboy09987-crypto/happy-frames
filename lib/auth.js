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

// Kya request bheju admin hai? (API routes mein use hota hai)
export function isAdminRequest() {
  const want = expectedToken();
  if (!want) return false;
  const got = cookies().get(COOKIE_NAME)?.value;
  return Boolean(got) && got === want;
}
