import { getAdminClient, isSupabaseConfigured } from "./supabase";
import { SEED_PRODUCTS } from "./seed";

// sizes ko saaf karta hai: [{label, price}]
export function cleanSizes(v) {
  if (!Array.isArray(v)) return [];
  return v
    .filter((s) => s && (s.label || s.label === 0))
    .map((s) => {
      const o = { label: String(s.label).slice(0, 24), price: Number(s.price) || 0 };
      if (s.old != null && s.old !== "" && Number(s.old) > 0) o.old = Number(s.old);
      return o;
    });
}

// Ek DB row ko site ke product shape mein badalta hai.
export function rowToProduct(r) {
  return {
    id: r.id,
    name: r.name,
    cat: r.cat || "Frames",
    price: Number(r.price) || 0,
    old: r.old != null ? Number(r.old) : null,
    rating: r.rating != null ? Number(r.rating) : 4.9,
    badge: r.badge || "",
    emoji: r.emoji || "🖼️",
    g: r.g || "linear-gradient(135deg,#f4c9a1,#e8896b)",
    img: r.img || null,
    sizes: cleanSizes(r.sizes),
    description: r.description || "",
    tags: r.tags || "",
    sort: r.sort != null ? Number(r.sort) : 0,
  };
}

// Saare products laata hai. Supabase set hai to wahan se, warna demo seed.
export async function getProducts() {
  const supabase = getAdminClient();
  if (!supabase) return SEED_PRODUCTS;
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return SEED_PRODUCTS;
    return data.map(rowToProduct);
  } catch (e) {
    return SEED_PRODUCTS;
  }
}

// Site settings (sale on/off etc.) — ek singleton row id='main'
export async function getSettings() {
  const supabase = getAdminClient();
  const fallback = {
    saleOn: false,
    saleText: "🎉 SALE is live — discount on all frames",
    accountTitle: "",
    jazzcash: "",
    upaisa: "",
  };
  if (!supabase) return fallback;
  try {
    const { data, error } = await supabase.from("settings").select("*").eq("id", "main").single();
    if (error || !data) return fallback;
    return {
      saleOn: Boolean(data.sale_on),
      saleText: data.sale_text || fallback.saleText,
      accountTitle: data.account_title || "",
      jazzcash: data.jazzcash_number || "",
      upaisa: data.upaisa_number || "",
    };
  } catch (e) {
    return fallback;
  }
}

export { isSupabaseConfigured };
