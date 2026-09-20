import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Admin: same image wale duplicate products hatao (har img ka sirf ek rakho)
export async function POST() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase configure nahi hai" }, { status: 400 });

  const { data, error } = await supabase.from("products").select("id,img,sort").order("sort", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const seen = new Set();
  const toDelete = [];
  for (const p of data || []) {
    if (!p.img) continue; // bina photo wale skip (custom etc.)
    if (seen.has(p.img)) toDelete.push(p.id); // pehla rakho, baaki delete
    else seen.add(p.img);
  }

  let removed = 0;
  for (const id of toDelete) {
    const { error: e } = await supabase.from("products").delete().eq("id", id);
    if (!e) removed++;
  }
  return NextResponse.json({ removed });
}
