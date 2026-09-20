// Motivational frames — one-time import (admin button). Images public/frames/motivational/.
import { STANDARD_SIZES, BASE_PRICE } from "./sizes";
const G = "linear-gradient(135deg,#e5b85c,#2e3352)";

function motiv(name, img, tags) {
  return {
    name,
    cat: "Motivational",
    price: BASE_PRICE,
    old: null,
    rating: 4.9,
    badge: "new",
    emoji: "💪",
    g: G,
    img,
    sizes: STANDARD_SIZES,
    description: `"${name}" — powerful motivational wall frame jo aapko har roz push kare. Office, gym ya study room ke liye perfect. Custom sizes A5, A4 aur A3 mein available. Delivery all over Pakistan.`,
    tags: `${tags}, motivational, motivation, quote frame, gym, hustle, success, wall art, room decor`,
  };
}

export const MOTIVATIONAL = [
  motiv("Worth It", "/frames/motivational/worth-it.jpg", "worth it, gym motivation, hard work"),
  motiv("Push Your Limits", "/frames/motivational/push-your-limits.jpg", "push your limits, gym, bodybuilding"),
  motiv("Change Your Life", "/frames/motivational/change-your-life.jpg", "only you can change your life, self improvement"),
  motiv("Best Revenge", "/frames/motivational/best-revenge.jpg", "best revenge improve yourself, self improvement"),
  motiv("Consistency", "/frames/motivational/consistency.jpg", "consistency beats motivation, discipline"),
  motiv("Dreams Don't Work", "/frames/motivational/dreams-dont-work.jpg", "dreams dont work unless you do, hustle"),
  motiv("Stop Thinking Start Doing", "/frames/motivational/stop-thinking-start-doing.jpg", "stop thinking start doing, action"),
  motiv("Discipline", "/frames/motivational/discipline.jpg", "discipline, self control, focus"),
];
