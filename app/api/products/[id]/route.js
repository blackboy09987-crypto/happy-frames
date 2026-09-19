import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { rowToProduct } from "@/lib/data";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Admin: product edit
export async function PUT(req, { params }) {
  if (!isAdminRequest()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase configure nahi hai" }, { status: 400 });

  const b = await req.json().catch(() => ({}));
  const patch = {};
  ["name", "cat", "badge", "emoji", "g", "img"].forEach((k) => { if (b[k] !== undefined) patch[k] = b[k]; });
  ["price", "old", "rating", "sort"].forEach((k) => { if (b[k] !== undefined) patch[k] = b[k] === null ? null : Number(b[k]); });

  const { data, error } = await supabase.from("products").update(patch).eq("id", params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: rowToProduct(data) });
}

// Admin: product delete
export async function DELETE(req, { params }) {
  if (!isAdminRequest()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase configure nahi hai" }, { status: 400 });

  const { error } = await supabase.from("products").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
