import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/auth";
import { STANDARD_SIZES, BASE_PRICE, SET_SIZES, SET_BASE_PRICE } from "@/lib/sizes";

export const dynamic = "force-dynamic";

// Admin: sabhi frames par nayi discounted pricing laga do.
// Islamic (3-panel sets) = set pricing, baaki (Cars/Movies) = standard discount.
export async function POST() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase configure nahi hai" }, { status: 400 });

  const { data, error } = await supabase.from("products").select("id,cat");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let updated = 0;
  for (const p of data || []) {
    let sizes, price;
    if (p.cat === "Islamic") { sizes = SET_SIZES; price = SET_BASE_PRICE; }
    else { sizes = STANDARD_SIZES; price = BASE_PRICE; } // Cars, Movies, etc.
    const { error: e } = await supabase.from("products").update({ sizes, price }).eq("id", p.id);
    if (!e) updated++;
  }
  return NextResponse.json({ updated });
}
