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

  // pehle se Cars category ke jo products hain unke naam
  const { data: existing } = await supabase.from("products").select("name").eq("cat", "Cars");
  const have = new Set((existing || []).map((r) => r.name));

  const now = Date.now();
  const rows = CARS.filter((c) => !have.has(c.name)).map((c, i) => ({ ...c, sort: now + i }));
  if (rows.length === 0) return NextResponse.json({ added: 0, message: "Sab car frames pehle se maujood hain." });

  const { error } = await supabase.from("products").insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ added: rows.length });
}
