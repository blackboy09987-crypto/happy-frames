// Anime frames — one-time import (admin button). Images public/frames/anime/.
import { STANDARD_SIZES, BASE_PRICE, SET_SIZES, SET_BASE_PRICE } from "./sizes";
const G = "linear-gradient(135deg,#e8896b,#4a3f52)";

function anime(name, img, tags, isSet = false) {
  return {
    name,
    cat: "Anime",
    price: isSet ? SET_BASE_PRICE : BASE_PRICE,
    old: null,
    rating: 4.9,
    badge: "new",
    emoji: "🎌",
    g: G,
    img,
    sizes: isSet ? SET_SIZES : STANDARD_SIZES,
    description: `${name} anime wall frame — high-quality print for anime fans. Apne room ya setup ko ek bold otaku look dein. Custom sizes available. Delivery all over Pakistan.`,
    tags: `${tags}, anime, anime frame, anime poster, wall art, otaku, aesthetic frame, room decor`,
  };
}

export const ANIME = [
  anime("Bleach", "/frames/anime/bleach-1.jpg", "bleach, ichigo, anime poster"),
  anime("Zoro", "/frames/anime/zoro-1.webp", "zoro, roronoa zoro, one piece"),
  anime("Luffy", "/frames/anime/luffy-1.webp", "luffy, monkey d luffy, one piece"),
  anime("Luffy", "/frames/anime/luffy-2.jpg", "luffy, monkey d luffy, one piece"),
  anime("One Piece", "/frames/anime/one-piece-1.jpg", "one piece, luffy, zoro, sanji, manga panel"),
  anime("Naruto", "/frames/anime/naruto-1.png", "naruto, naruto uzumaki, shinobi"),
  anime("Naruto", "/frames/anime/naruto-2.jpg", "naruto, naruto uzumaki, shinobi"),
  anime("Naruto", "/frames/anime/naruto-3.jpg", "naruto, naruto uzumaki, shinobi"),
  anime("Itachi", "/frames/anime/itachi-1.jpg", "itachi, itachi uchiha, akatsuki, naruto"),
  anime("Haikyuu", "/frames/anime/haikyuu-1.jpg", "haikyuu, volleyball anime, karasuno"),
  anime("Ace Luffy Sabo", "/frames/anime/ace-luffy-sabo.jpg", "ace, luffy, sabo, asl brothers, one piece", true),
];
