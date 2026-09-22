import { NextResponse } from "next/server";
import { getAdminClient, BUCKET } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Public: customer apni payment screenshot upload karta hai (proof)
export async function POST(req) {
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Store setup is incomplete" }, { status: 400 });

  const form = await req.formData().catch(() => null);
  const file = form && form.get("file");
  if (!file || typeof file === "string") return NextResponse.json({ error: "No file received" }, { status: 400 });
  if (!String(file.type || "").startsWith("image/")) return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
  if (file.size > 6 * 1024 * 1024) return NextResponse.json({ error: "Screenshot must be smaller than 6MB" }, { status: 400 });

  const ext = ((file.name && file.name.split(".").pop()) || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `proofs/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
