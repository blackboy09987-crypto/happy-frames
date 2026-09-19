import { NextResponse } from "next/server";
import { getSettings } from "@/lib/data";
import { getAdminClient } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Public: current settings (sale on/off, sale text)
export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

// Admin: settings update
export async function POST(req) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase configure nahi hai" }, { status: 400 });

  const b = await req.json().catch(() => ({}));
  const patch = { id: "main", updated_at: new Date().toISOString() };
  if (b.saleOn !== undefined) patch.sale_on = Boolean(b.saleOn);
  if (b.saleText !== undefined) patch.sale_text = String(b.saleText).slice(0, 200);
  if (b.accountTitle !== undefined) patch.account_title = String(b.accountTitle).slice(0, 80);
  if (b.jazzcash !== undefined) patch.jazzcash_number = String(b.jazzcash).slice(0, 40);
  if (b.easypaisa !== undefined) patch.easypaisa_number = String(b.easypaisa).slice(0, 40);

  const { error } = await supabase.from("settings").upsert(patch);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const settings = await getSettings();
  return NextResponse.json({ settings });
}
