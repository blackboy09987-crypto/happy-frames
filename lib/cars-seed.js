// Car frames — one-time import (admin button se). Images public/frames/cars/ mein hain.
import { STANDARD_SIZES, BASE_PRICE } from "./sizes";
const SIZES = STANDARD_SIZES;
const G = "linear-gradient(135deg,#5a6072,#2e3352)";

function car(name, img, model, extraTags) {
  return {
    name,
    cat: "Cars",
    price: BASE_PRICE,
    old: null,
    rating: 4.9,
    badge: "new",
    emoji: "🚗",
    g: G,
    img,
    sizes: SIZES,
    description: `${model} ka aesthetic wall frame — high-quality print jo aapke room ya office ko ek sporty, premium look de. Custom sizes A5, A4 aur A3 mein available. Handcrafted quality, delivery all over Pakistan.`,
    tags: `${extraTags}, car frame, cars, wall frame, wall art, aesthetic frame, room decor, poster frame, ${model.toLowerCase()}`,
  };
}

export const CARS = [
  car("BMW M4", "/frames/cars/bmw-m4-1.jpg", "BMW M4", "bmw, m4, bmw m4, bmw m4 frame"),
  car("BMW M4", "/frames/cars/bmw-m4-2.jpg", "BMW M4", "bmw, m4, bmw m4, bmw m4 frame"),
  car("BMW M4", "/frames/cars/bmw-m4-3.jpg", "BMW M4", "bmw, m4, bmw m4, bmw m4 frame"),
  car("BMW M5", "/frames/cars/bmw-m5-1.jpg", "BMW M5", "bmw, m5, bmw m5, bmw m5 frame"),
  car("BMW M5", "/frames/cars/bmw-m5-2.jpg", "BMW M5", "bmw, m5, bmw m5, bmw m5 frame"),
  car("F1", "/frames/cars/f1-1.jpg", "F1", "f1, formula 1, racing, f1 frame"),
  car("F1", "/frames/cars/f1-2.jpg", "F1", "f1, formula 1, racing, f1 frame"),
  car("Porsche 911", "/frames/cars/porsche-911-1.jpg", "Porsche 911", "porsche, 911, porsche 911, porsche frame"),
  car("Porsche 911", "/frames/cars/porsche-911-2.jpg", "Porsche 911", "porsche, 911, porsche 911, porsche frame"),
];
