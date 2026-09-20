// Islamic frames — 3-panel SET frames (set pricing). Images public/frames/islamic/.
import { SET_SIZES, SET_BASE_PRICE } from "./sizes";
const SIZES = SET_SIZES;
const G = "linear-gradient(135deg,#a7d7c3,#6a9b82)";

function islamic(name, img, tags) {
  return {
    name,
    cat: "Islamic",
    price: SET_BASE_PRICE,
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
