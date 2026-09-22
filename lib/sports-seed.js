// Sports frames — one-time import (admin button). Images public/frames/sports/.
// Category "Cricket" (tile "Cricket / Sports").
import { STANDARD_SIZES, BASE_PRICE } from "./sizes";
const G = "linear-gradient(135deg,#8fc9a9,#3a3f5c)";

function sport(name, img, tags) {
  return {
    name,
    cat: "Cricket",
    price: BASE_PRICE,
    old: null,
    rating: 4.9,
    badge: "new",
    emoji: "🏏",
    g: G,
    img,
    sizes: STANDARD_SIZES,
    description: `A high-quality ${name} sports wall frame for fans. Give your room, lounge or gaming setup a sporty look. Available in custom A5, A4 and A3 sizes. Delivery all across Pakistan.`,
    tags: `${tags}, sports, sports frame, wall art, aesthetic frame, room decor, poster frame`,
  };
}

export const SPORTS = [
  sport("Messi", "/frames/sports/messi-1.jpg", "messi, lionel messi, football, barcelona, argentina"),
  sport("Ronaldo", "/frames/sports/ronaldo-1.jpg", "ronaldo, cristiano ronaldo, football, cr7"),
  sport("Ronaldo", "/frames/sports/ronaldo-2.jpg", "ronaldo, cristiano ronaldo, portugal, cr7"),
  sport("Neymar", "/frames/sports/neymar-1.jpg", "neymar, neymar jr, football, brazil"),
  sport("Neymar", "/frames/sports/neymar-2.webp", "neymar, neymar jr, football, brazil"),
  sport("Muhammad Ali", "/frames/sports/muhammad-ali-1.jpg", "muhammad ali, boxing, the greatest"),
  sport("Muhammad Ali", "/frames/sports/muhammad-ali-2.jpg", "muhammad ali, boxing, the greatest"),
  sport("Football Star", "/frames/sports/football-star.jpg", "football, soccer, player"),
  sport("Football Photo Frame", "/frames/sports/football-photo-frame.jpg", "football photo frame, soccer, football"),
  sport("Cricket", "/frames/sports/cricket-1.jpg", "cricket, cricket is my life, bat ball"),
];
