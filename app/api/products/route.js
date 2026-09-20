import { NextResponse } from "next/server";
import { getProducts, rowToProduct, cleanSizes } from "@/lib/data";
import { getAdminClient } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Public: saare products
export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

// Admin: naya product add
export async function POST(req) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase configure nahi hai" }, { status: 400 });

  const b = await req.json().catch(() => ({}));
  const sizes = cleanSizes(b.sizes);
  let price = Number(b.price) || 0;
  if (sizes.length && !price) price = Math.min(...sizes.map((s) => s.price));
  if (!b.name || (!price && !sizes.length)) return NextResponse.json({ error: "Naam aur price zaroori hai" }, { status: 400 });

  const row = {
    name: String(b.name).slice(0, 120),
    cat: b.cat ? String(b.cat).slice(0, 60) : "Frames",
    price,
    old: b.old ? Number(b.old) : null,
    rating: b.rating != null ? Number(b.rating) : 4.9,
    badge: b.badge || "",
    emoji: b.emoji ? String(b.emoji).slice(0, 8) : "🖼️",
    g: b.g || "linear-gradient(135deg,#f4c9a1,#e8896b)",
    img: b.img || null,
    sizes,
    description: b.description ? String(b.description).slice(0, 600) : "",
    tags: b.tags ? String(b.tags).slice(0, 300) : "",
    sort: b.sort != null ? Number(b.sort) : Date.now(),
  };

  const { data, error } = await supabase.from("products").insert(row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: rowToProduct(data) });
}
