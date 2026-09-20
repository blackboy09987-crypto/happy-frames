import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/auth";
import { MOTIVATIONAL } from "@/lib/motivational-seed";

export const dynamic = "force-dynamic";

// Admin: motivational frames one-time import (img se upsert)
export async function POST() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase configure nahi hai" }, { status: 400 });

  const { data: existing } = await supabase.from("products").select("id,img").eq("cat", "Motivational");
  const byImg = new Map((existing || []).filter((r) => r.img).map((r) => [r.img, r.id]));

  const now = Date.now();
  let added = 0, updated = 0;
  for (let i = 0; i < MOTIVATIONAL.length; i++) {
    const m = { ...MOTIVATIONAL[i], sort: now + i };
    const id = byImg.get(m.img);
    if (id) {
      const { error } = await supabase.from("products").update({ name: m.name, description: m.description, tags: m.tags, sizes: m.sizes, price: m.price }).eq("id", id);
      if (!error) updated++;
    } else {
      const { error } = await supabase.from("products").insert(m);
      if (!error) added++;
    }
  }
  return NextResponse.json({ added, updated });
}
