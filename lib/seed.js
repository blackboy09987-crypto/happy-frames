// Fallback demo products — jab tak Supabase configure nahi hota, ya database khaali ho,
// tab site inhe dikhati hai taake khali na lage. Admin se asli products add hone par
// yeh apne aap replace ho jate hain.
export const SEED_PRODUCTS = [
  { id: "d1", name: "Classic Oak Frame", cat: "Classic", price: 1499, old: 2499, rating: 4.9, badge: "sale", emoji: "🖼️", g: "linear-gradient(135deg,#f4c9a1,#e8896b)", img: null, sort: 1 },
  { id: "d2", name: "Minimal White A4", cat: "Minimal", price: 1199, old: null, rating: 4.8, badge: "new", emoji: "🤍", g: "linear-gradient(135deg,#eef0e6,#c9c6ac)", img: null, sort: 2 },
  { id: "d3", name: "Golden Vintage", cat: "Vintage", price: 2299, old: 3299, rating: 5.0, badge: "sale", emoji: "✨", g: "linear-gradient(135deg,#f2d98a,#e5b85c)", img: null, sort: 3 },
  { id: "d4", name: "Collage Wall Set", cat: "Sets", price: 3999, old: 5999, rating: 4.9, badge: "sale", emoji: "🧩", g: "linear-gradient(135deg,#a7d7c3,#8fc9a9)", img: null, sort: 4 },
  { id: "d5", name: "Rustic Walnut", cat: "Classic", price: 1799, old: null, rating: 4.7, badge: "", emoji: "🌰", g: "linear-gradient(135deg,#d9b48f,#a97c50)", img: null, sort: 5 },
  { id: "d6", name: "Floral Soft Pink", cat: "Minimal", price: 1349, old: 1899, rating: 4.8, badge: "sale", emoji: "🌸", g: "linear-gradient(135deg,#f6d3dd,#e8a6bb)", img: null, sort: 6 },
  { id: "d7", name: "Black Studio", cat: "Minimal", price: 1599, old: null, rating: 4.9, badge: "new", emoji: "⬛", g: "linear-gradient(135deg,#6a6e86,#3a3f5c)", img: null, sort: 7 },
  { id: "d8", name: "Family Memory Grid", cat: "Sets", price: 4499, old: 6299, rating: 5.0, badge: "sale", emoji: "👨‍👩‍👧", g: "linear-gradient(135deg,#f4c9a1,#f2d98a)", img: null, sort: 8 },
];

export const GRADIENTS = [
  "linear-gradient(135deg,#f4c9a1,#e8896b)",
  "linear-gradient(135deg,#f2d98a,#e5b85c)",
  "linear-gradient(135deg,#a7d7c3,#8fc9a9)",
  "linear-gradient(135deg,#f6d3dd,#e8a6bb)",
  "linear-gradient(135deg,#d9b48f,#a97c50)",
  "linear-gradient(135deg,#6a6e86,#3a3f5c)",
  "linear-gradient(135deg,#eef0e6,#c9c6ac)",
  "linear-gradient(135deg,#b7c8f0,#8a9be0)",
];
