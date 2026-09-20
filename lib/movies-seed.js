// Movie/series frames — one-time import (admin button). Images public/frames/movies/.
import { STANDARD_SIZES, BASE_PRICE } from "./sizes";
const SIZES = STANDARD_SIZES;
const G = "linear-gradient(135deg,#4a3f52,#2e3352)";

function movie(name, img, tags) {
  return {
    name,
    cat: "Movies",
    price: BASE_PRICE,
    old: null,
    rating: 4.9,
    badge: "new",
    emoji: "🎬",
    g: G,
    img,
    sizes: SIZES,
    description: `${name} ka aesthetic movie/series wall frame — high-quality print for fans. Apne room ya gaming setup ko ek cinematic look dein. Custom sizes A5, A4 aur A3 mein available. Delivery all over Pakistan.`,
    tags: `${tags}, movie frame, poster frame, wall art, aesthetic frame, room decor, cinematic`,
  };
}

export const MOVIES = [
  movie("Breaking Bad", "/frames/movies/breaking-bad-1.jpg", "breaking bad, walter white, jesse pinkman, heisenberg, series frame"),
  movie("Breaking Bad", "/frames/movies/breaking-bad-2.webp", "breaking bad, walter white, jesse pinkman, heisenberg, series frame"),
  movie("Heisenberg", "/frames/movies/heisenberg-1.jpg", "heisenberg, breaking bad, walter white, series frame"),
  movie("Heisenberg", "/frames/movies/heisenberg-2.jpg", "heisenberg, breaking bad, walter white, series frame"),
  movie("Spider-Man", "/frames/movies/spiderman-1.jpg", "spiderman, spider man, marvel, superhero"),
  movie("Spider-Man", "/frames/movies/spiderman-2.jpg", "spiderman, spider man, marvel, superhero"),
  movie("Spider-Man", "/frames/movies/spiderman-3.webp", "spiderman, spider man, marvel, superhero, great power"),
  movie("Spider-Man: No Way Home", "/frames/movies/spiderman-no-way-home.jpg", "spiderman no way home, spider man, marvel, tom holland"),
  movie("The Batman", "/frames/movies/the-batman-1.jpg", "the batman, batman, dc, robert pattinson, superhero"),
  movie("The Batman", "/frames/movies/the-batman-2.jpg", "the batman, batman, dc, robert pattinson, superhero"),
  movie("Joker", "/frames/movies/joker-1.webp", "joker, heath ledger, the dark knight, batman, dc, villain"),
  movie("Joker", "/frames/movies/joker-2.jpg", "joker, heath ledger, the dark knight, batman, dc, villain"),
  movie("Fight Club", "/frames/movies/fight-club-1.webp", "fight club, brad pitt, tyler durden, edward norton, classic movie"),
  movie("Interstellar", "/frames/movies/interstellar-1.jpg", "interstellar, christopher nolan, space, sci-fi"),
];
