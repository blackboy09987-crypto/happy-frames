import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/auth";
import { CARS } from "@/lib/cars-seed";

export const dynamic = "force-dynamic";

// Admin: car frames one-time import (duplicate names skip)
export async function POST() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase configure nahi hai" }, { status: 400 });

  // pehle se maujood Cars products — img se pehchaanenge (naam duplicate ho sakte hain)
  const { data: existing } = await supabase.from("products").select("id,img").eq("cat", "Cars");
  const byImg = new Map((existing || []).filter((r) => r.img).map((r) => [r.img, r.id]));

  const now = Date.now();
  let added = 0, updated = 0;
  for (let i = 0; i < CARS.length; i++) {
    const c = { ...CARS[i], sort: now + i };
    const id = byImg.get(c.img);
    if (id) {
      // pehle se hai (shayad purana numbered naam) — update kar do
      const { error } = await supabase.from("products").update({ name: c.name, description: c.description, tags: c.tags, sizes: c.sizes, price: c.price }).eq("id", id);
      if (!error) updated++;
    } else {
      const { error } = await supabase.from("products").insert(c);
      if (!error) added++;
    }
  }
  return NextResponse.json({ added, updated });
}
