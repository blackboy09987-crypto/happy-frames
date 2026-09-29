import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

// Live products se Shopify import CSV banata hai (ORIGINAL prices, no discount).
// Browser mein kholने par file download ho jati hai.
const IMG_BASE = "https://www.happyframes.online"; // Shopify import ke waqt images yahan se download hongi (bot-friendly, 200 OK)

const COLS = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value",
  "Variant SKU", "Variant Inventory Qty", "Variant Inventory Policy", "Variant Fulfillment Service",
  "Variant Price", "Variant Compare At Price", "Variant Requires Shipping", "Variant Taxable",
  "Image Src", "Image Position", "Image Alt Text", "Status",
];

const q = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
const imgSrc = (i) => (!i ? "" : i.startsWith("http") ? i : IMG_BASE + i);

export async function GET() {
  const products = await getProducts();
  const rows = [COLS.map(q).join(",")];
  const used = {};

  const handleFor = (p) => {
    let h = p.img
      ? p.img.split("/").pop().replace(/\.[a-z0-9]+$/i, "")
      : (p.name || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    h = h.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    if (used[h]) { used[h]++; h = `${h}-${used[h]}`; } else used[h] = 1;
    return h;
  };

  for (const p of products) {
    const handle = handleFor(p);
    const type = p.cat === "Cricket" ? "Sports" : (p.cat || "Frames");
    const sizes = (p.sizes && p.sizes.length) ? p.sizes : [{ label: "Standard", price: p.price, old: p.old }];
    const img = imgSrc(p.img);
    const title = (p.name || "Frame").slice(0, 140);
    sizes.forEach((s, i) => {
      const first = i === 0;
      const price = (s.old && s.old > 0) ? s.old : s.price; // ORIGINAL price
      rows.push([
        q(handle), q(first ? title : ""), q(first ? `<p>${p.description || ""}</p>` : ""), q(first ? "Happy Frames" : ""),
        q(first ? type : ""), q(first ? (p.tags || "") : ""), q(first ? "TRUE" : ""),
        q("Size"), q(s.label), q(`${handle}-${String(s.label).toLowerCase()}`),
        q("100"), q("continue"), q("manual"), q(price), q(""), q("TRUE"), q("FALSE"),
        q(first ? img : ""), q(first && img ? "1" : ""), q(first && img ? title : ""), q(first ? "active" : ""),
      ].join(","));
    });
  }

  const csv = "﻿" + rows.join("\r\n"); // BOM for Excel/Shopify
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="happy-frames-shopify.csv"',
      "Cache-Control": "no-store",
    },
  });
}
