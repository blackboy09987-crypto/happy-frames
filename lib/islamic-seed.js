// Islamic frames — one-time import (admin button). Images public/frames/islamic/.
const SIZES = [
  { label: "A5", price: 1000 },
  { label: "A4", price: 1500 },
  { label: "A3", price: 2800 },
];
const G = "linear-gradient(135deg,#a7d7c3,#6a9b82)";

function islamic(name, img, tags) {
  return {
    name,
    cat: "Islamic",
    price: 1000,
    old: null,
    rating: 5.0,
    badge: "new",
    emoji: "🕌",
    g: G,
    img,
    sizes: SIZES,
    description: `${name} — khoobsurat Islamic calligraphy wall frame jo aapke ghar ko sukoon aur barkat de. Elegant Arabic art, premium print. Custom sizes A5, A4 aur A3 mein available. Delivery all over Pakistan.`,
    tags: `${tags}, islamic, calligraphy, arabic, islamic frame, wall art, aesthetic frame, home decor`,
  };
}

export const ISLAMIC = [
  islamic("Sabr Shukr Tawakkul", "/frames/islamic/sabr-shukr-tawakkul.jpg", "sabr, shukr, tawakkul, patience, gratitude, minimalist calligraphy"),
  islamic("Islamic Calligraphy Set", "/frames/islamic/islamic-calligraphy-set.jpg", "islamic calligraphy, kalma, tasbeeh, arabic calligraphy set"),
  islamic("Allah Calligraphy", "/frames/islamic/allah-calligraphy.jpg", "allah, hubb, love, allah calligraphy, black white islamic art"),
];
