import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

// Live products se Shopify import CSV banata hai (ORIGINAL prices, no discount).
// Browser mein kholने par file download ho jati hai.
// jsDelivr GitHub CDN — bot-friendly, Shopify import ke liye 100% accessible (Vercel bot-block bypass)
const IMG_BASE = "https://cdn.jsdelivr.net/gh/blackboy09987-crypto/happy-frames@main/public";

const COLS = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value",
  "Variant SKU", "Variant Inventory Qty", "Variant Inventory Policy", "Variant Fulfillment Service",
  "Variant Price", "Variant Compare At Price", "Variant Requires Shipping", "Variant Taxable",
  "Image Src", "Image Position", "Image Alt Text", "Status",
];

// Uniform sizes + prices for ALL products
const SHOPIFY_SIZES = [
  { label: "16×20", price: 4500 },
  { label: "18×24", price: 6000 },
  { label: "20×24", price: 6750 },
  { label: "20×30", price: 8500 },
  { label: "24×30", price: 10000 },
  { label: "24×36", price: 12000 },
  { label: "30×40", price: 17000 },
  { label: "36×48", price: 24500 },
];

const q = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
const imgSrc = (i) => (!i ? "" : i.startsWith("http") ? i : IMG_BASE + i);
const skuBit = (s) => s.replace(/[^a-z0-9]/gi, "");

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
    const img = imgSrc(p.img);
    const title = (p.name || "Frame").slice(0, 140);
    SHOPIFY_SIZES.forEach((s, i) => {
      const first = i === 0;
      rows.push([
        q(handle), q(first ? title : ""), q(first ? `<p>${p.description || ""}</p>` : ""), q(first ? "Happy Frames" : ""),
        q(first ? type : ""), q(first ? (p.tags || "") : ""), q(first ? "TRUE" : ""),
        q("Size"), q(s.label), q(`${handle}-${skuBit(s.label)}`),
        q("100"), q("continue"), q("manual"), q(s.price), q(""), q("TRUE"), q("FALSE"),
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
