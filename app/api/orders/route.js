import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data";
import { getAdminClient } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Public: naya order (COD)
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.name || "").trim();
  const phone = String(b.phone || "").trim();
  const address = String(b.address || "").trim();
  const city = String(b.city || "").trim();
  const notes = String(b.notes || "").slice(0, 500);
  if (!name || !phone || !address) return NextResponse.json({ error: "Naam, phone aur address zaroori hain" }, { status: 400 });

  const items = Array.isArray(b.items) ? b.items : [];
  if (!items.length) return NextResponse.json({ error: "Cart khaali hai" }, { status: 400 });

  // Prices server par recompute (security ke liye)
  const products = await getProducts();
  const lineItems = [];
  let subtotal = 0;
  for (const it of items) {
    const p = products.find((x) => String(x.id) === String(it.id));
    if (!p) continue;
    let price = p.price;
    const size = it.size || "";
    if (size && p.sizes && p.sizes.length) {
      const s = p.sizes.find((s) => s.label === size);
      if (s) price = s.price;
    }
    const qty = Math.max(1, Math.min(999, Number(it.qty) || 1));
    subtotal += price * qty;
    lineItems.push({ name: p.name, size, qty, price });
  }
  if (!lineItems.length) return NextResponse.json({ error: "Order ke products valid nahi" }, { status: 400 });

  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Store setup adhoora hai" }, { status: 400 });

  const row = { name, phone, address, city, notes, payment: "COD", items: lineItems, subtotal, status: "new" };
  const { data, error } = await supabase.from("orders").insert(row).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, orderId: data.id, subtotal });
}

// Admin: orders list
export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ orders: [] });
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data || [] });
}
