import { NextResponse } from "next/server";
import { COOKIE_NAME, tokenFor, expectedToken, isAdminRequest } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Admin logged-in hai ya nahi + kya Supabase set hai
export async function GET() {
  return NextResponse.json({
    admin: isAdminRequest(),
    supabase: isSupabaseConfigured,
    passwordSet: Boolean(expectedToken()),
  });
}

// Login: password check karke httpOnly cookie set karta hai
export async function POST(req) {
  const want = expectedToken();
  if (!want) return NextResponse.json({ error: "ADMIN_PASSWORD set nahi hai" }, { status: 400 });

  const { password } = await req.json().catch(() => ({}));
  if (!password || tokenFor(password) !== want) {
    return NextResponse.json({ error: "Ghalat password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, want, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 din
  });
  return res;
}

// Logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
