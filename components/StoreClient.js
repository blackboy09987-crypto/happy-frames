"use client";
import { useEffect, useMemo, useRef, useState } from "react";

const rs = (n) => "Rs " + Number(n || 0).toLocaleString("en-PK");

// Curated categories (tiles + filters). "name" = product ki category se match hoti hai.
const CATEGORIES = [
  { name: "Islamic", label: "Islamic", emoji: "🕌", g: "linear-gradient(135deg,#a7d7c3,#6a9b82)" },
  { name: "Motivational", label: "Motivational", emoji: "💪", g: "linear-gradient(135deg,#f2d98a,#e5b85c)" },
  { name: "Nature", label: "Nature", emoji: "🌿", g: "linear-gradient(135deg,#a7d7c3,#8fc9a9)" },
  { name: "Movies", label: "Movies", emoji: "🎬", g: "linear-gradient(135deg,#8a8ea6,#3a3f5c)" },
  { name: "Cars", label: "Cars", emoji: "🚗", g: "linear-gradient(135deg,#f4c9a1,#e8896b)" },
  { name: "Cricket", label: "Cricket / Sports", emoji: "🏏", g: "linear-gradient(135deg,#8fc9a9,#5a9b78)" },
  { name: "Anime", label: "Anime", emoji: "🎌", g: "linear-gradient(135deg,#f6d3dd,#e8a6bb)" },
  { name: "Custom", label: "Custom Photo", emoji: "📸", g: "linear-gradient(135deg,#b7c8f0,#8a9be0)" },
];

export default function StoreClient({ initialProducts, initialSettings }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [settings, setSettings] = useState(initialSettings || { saleOn: false, saleText: "" });
  const [activeCat, setActiveCat] = useState("All");
  const [cart, setCart] = useState({});
  const [favs, setFavs] = useState({});
  const [selSize, setSelSize] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [viewSizeIdx, setViewSizeIdx] = useState(0);
  const [toast, setToast] = useState("");
  const [news, setNews] = useState("");
  const toastTimer = useRef(null);

  // cart localStorage se load (v2 = size-aware format)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("hf_cart_v2") || "{}");
      // sirf sahi shape wale items rakho
      const clean = {};
      Object.keys(saved).forEach((k) => { if (saved[k] && typeof saved[k] === "object" && saved[k].id) clean[k] = saved[k]; });
      setCart(clean);
    } catch (e) {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("hf_cart_v2", JSON.stringify(cart)); } catch (e) {}
  }, [cart]);

  // mount ke baad fresh products + settings (admin changes ke liye)
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => { if (d && Array.isArray(d.products)) setProducts(d.products); })
      .catch(() => {});
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { if (d && d.settings) setSettings(d.settings); })
      .catch(() => {});
  }, []);

  const showToast = (m) => {
    setToast(m);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  const cats = useMemo(() => {
    const merged = CATEGORIES.map((c) => c.name);
    products.map((p) => p.cat).filter(Boolean).forEach((c) => { if (!merged.includes(c)) merged.push(c); });
    return ["All", ...merged];
  }, [products]);

  const goToCategory = (name) => {
    setActiveCat(name);
    const el = document.getElementById("shop");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  const handleCategory = (name) => {
    if (name === "Custom") { window.location.href = "/custom"; return; }
    goToCategory(name);
  };
  const visible = activeCat === "All" ? products : products.filter((p) => p.cat === activeCat);
  const findProd = (id) => products.find((p) => String(p.id) === String(id));

  const addItem = (p, size) => {
    const key = p.id + "|" + (size ? size.label : "");
    const price = size ? size.price : p.price;
    setCart((c) => ({ ...c, [key]: { id: p.id, size: size ? size.label : "", price, qty: (c[key]?.qty || 0) + 1 } }));
    setCartOpen(true);
  };
  const addToCart = (p) => {
    const hasSizes = p.sizes && p.sizes.length;
    const si = selSize[p.id] || 0;
    addItem(p, hasSizes ? p.sizes[si] : null);
  };
  const openView = (p) => { setViewProduct(p); setViewSizeIdx(selSize[p.id] || 0); };
  const setQty = (key, d) =>
    setCart((c) => {
      const it = c[key]; if (!it) return c;
      const q = it.qty + d;
      const nc = { ...c };
      if (q <= 0) delete nc[key]; else nc[key] = { ...it, qty: q };
      return nc;
    });
  const removeItem = (key) => setCart((c) => { const nc = { ...c }; delete nc[key]; return nc; });
  const toggleFav = (id) => setFavs((f) => ({ ...f, [id]: !f[id] }));

  const cartKeys = Object.keys(cart).filter((k) => cart[k].custom || findProd(cart[k].id));
  const customFrame = (it) => ({ name: it.name || "Custom Frame", img: it.img, g: "linear-gradient(135deg,#b7c8f0,#8a9be0)", emoji: "🖼️" });
  const cartCount = cartKeys.reduce((s, k) => s + cart[k].qty, 0);
  const subtotal = cartKeys.reduce((s, k) => s + cart[k].price * cart[k].qty, 0);

  // scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        ...(p.description ? { description: p.description } : {}),
        ...(p.img ? { image: p.img.startsWith("http") ? p.img : "https://happyframes.online" + p.img } : {}),
        category: p.cat,
        offers: { "@type": "Offer", priceCurrency: "PKR", price: p.price, availability: "https://schema.org/InStock" },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {settings.saleOn && <Marquee text={settings.saleText} />}
      <Header cartCount={cartCount} onCart={() => setCartOpen(true)} categories={CATEGORIES} onCategory={handleCategory} />

      <section className="hero">
        <div className="blob blob1" /><div className="blob blob2" />
        <div className="wrap hero__grid">
          <div className="hero__copy reveal">
            <span className="eyebrow">Handcrafted photo frames</span>
            <h1>Frames that make <em>you happy</em>.</h1>
            <p>Apni yaadon ko ek khoobsurat ghar do. Premium quality frames, custom sizes aur design — jo har deewar ko muskuraahat de.</p>
            <div className="hero__cta">
              <a href="#shop" className="btn btn--primary">Shop Now →</a>
              <a href="#featured" className="btn btn--ghost">Bestsellers</a>
            </div>
            <div className="hero__stats">
              <div className="stat"><b>5k+</b><span>Happy customers</span></div>
              <div className="stat"><b>4.9★</b><span>Average rating</span></div>
              <div className="stat"><b>50+</b><span>Frame designs</span></div>
            </div>
          </div>
          <div className="hero__art reveal">
            <div className="float-frame ff1"><img className="pic" src="/frames/movies/the-batman-1.jpg" alt="The Batman frame" /><small>THE BATMAN</small></div>
            <div className="float-frame ff2"><img className="pic" src="/frames/movies/spiderman-2.jpg" alt="Spider-Man frame" /><small>SPIDER-MAN</small></div>
            <div className="float-frame ff3"><img className="pic" src="/frames/movies/spiderman-no-way-home.jpg" alt="Spider-Man No Way Home frame" /><small>NO WAY HOME</small></div>
          </div>
        </div>
        <div className="wrap">
          <div className="strip"><div className="strip__row">
            <div>✋ Handmade</div><div>🌿 Eco Wood</div><div>🚚 Fast Delivery</div><div>↩️ 7-Day Returns</div><div>🎨 Custom Sizes</div>
          </div></div>
        </div>
      </section>

      {settings.saleOn && <Promo />}

      <section className="block" id="shop">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <span className="eyebrow">Our Collection</span>
              <h2>Shop the frames</h2>
              <p>Handcrafted frames, sabhi custom sizes mein available.</p>
            </div>
            <a href="#featured" className="btn btn--ghost">View sale</a>
          </div>
          <div className="filters">
            {cats.map((c) => (
              <button key={c} className={"chip" + (c === activeCat ? " active" : "")} onClick={() => setActiveCat(c)}>{c}</button>
            ))}
          </div>
          <div className="grid">
            {visible.length === 0 ? (
              <div className="empty-note">Jald hi naye frames aa rahe hain 💛</div>
            ) : (
              visible.map((p) => {
                const hasSizes = p.sizes && p.sizes.length > 0;
                const si = selSize[p.id] || 0;
                const curSize = hasSizes ? p.sizes[si] : null;
                const curPrice = curSize ? curSize.price : p.price;
                const curOld = curSize ? curSize.old : p.old;
                const off = curOld && curOld > curPrice ? Math.round((1 - curPrice / curOld) * 100) : 0;
                return (
                  <article className="card" key={p.id}>
                    <div className="card__img" style={{ background: p.g, cursor: "pointer" }} onClick={() => openView(p)}>
                      {p.img && <img className="card__photo" src={p.img} alt={p.name} />}
                      {off ? <span className="card__badge">-{off}%</span>
                        : p.badge === "new" ? <span className="card__badge new">New</span>
                        : p.badge === "sale" ? <span className="card__badge">Sale</span> : null}
                      <button className={"card__fav" + (favs[p.id] ? " on" : "")} onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }} aria-label="Save">{favs[p.id] ? "♥" : "♡"}</button>
                      {!p.img && <span>{p.emoji || "🖼️"}</span>}
                    </div>
                    <div className="card__body">
                      <span className="card__cat">{p.cat}</span>
                      <span className="card__name" style={{ cursor: "pointer" }} onClick={() => openView(p)}>{p.name}</span>
                      <span className="card__rate">★ {Number(p.rating || 0).toFixed(1)} · in stock</span>
                      {p.description ? <span className="card__desc">{p.description}</span> : null}
                      {hasSizes && (
                        <div className="sizes">
                          {p.sizes.map((s, i) => (
                            <button key={i} className={"size-chip" + (i === si ? " on" : "")} onClick={() => setSelSize((m) => ({ ...m, [p.id]: i }))}>{s.label}</button>
                          ))}
                        </div>
                      )}
                      <div className="card__foot">
                        <span className="price">
                          {hasSizes && <em className="from">from</em>}
                          <b>{rs(curPrice)}</b>
                          {curOld && curOld > curPrice ? <s>{rs(curOld)}</s> : null}
                        </span>
                        <button className="add" onClick={() => addToCart(p)} aria-label="Add to cart">+</button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <Features />
      <Newsletter value={news} setValue={setNews} onSubmit={() => setNews("done")} />
      <Footer />

      {/* CART */}
      <div className={"overlay" + (cartOpen ? " open" : "")} onClick={() => setCartOpen(false)} />
      <aside className={"drawer" + (cartOpen ? " open" : "")} aria-label="Shopping cart">
        <div className="drawer__head"><h3>Your Cart</h3><button className="x" onClick={() => setCartOpen(false)} aria-label="Close">×</button></div>
        <div className="drawer__body">
          {cartKeys.length === 0 ? (
            <div className="cart-empty"><div className="big">🛒</div><p>Aapki cart khaali hai.<br />Kuch happy frames add karo!</p></div>
          ) : (
            cartKeys.map((k) => {
              const it = cart[k]; const p = it.custom ? customFrame(it) : findProd(it.id);
              return (
                <div className="citem" key={k}>
                  <div className="citem__img" style={{ background: p.g }}>{p.img ? <img src={p.img} alt="" /> : (p.emoji || "🖼️")}</div>
                  <div className="citem__mid">
                    <b>{p.name}</b><span>{it.size ? it.size + " · " : ""}{rs(it.price)}</span>
                    <div className="qty"><button onClick={() => setQty(k, -1)}>−</button><b>{it.qty}</b><button onClick={() => setQty(k, 1)}>+</button></div>
                  </div>
                  <button className="citem__rm" onClick={() => removeItem(k)}>Remove</button>
                </div>
              );
            })
          )}
        </div>
        <div className="drawer__foot">
          <div className="row"><span>Subtotal</span><b>{rs(subtotal)}</b></div>
          {cartKeys.length > 0
            ? <a href="/checkout" className="btn btn--primary btn--block">Checkout →</a>
            : <button className="btn btn--primary btn--block" onClick={() => showToast("Cart khaali hai 🛒")}>Checkout →</button>}
        </div>
      </aside>

      {/* QUICK VIEW */}
      {viewProduct && (() => {
        const p = viewProduct;
        const hasSizes = p.sizes && p.sizes.length > 0;
        const si = Math.min(viewSizeIdx, hasSizes ? p.sizes.length - 1 : 0);
        const price = hasSizes ? p.sizes[si].price : p.price;
        const oldPrice = hasSizes ? p.sizes[si].old : p.old;
        const qvOff = oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;
        return (
          <>
            <div className="overlay open" style={{ zIndex: 105 }} onClick={() => setViewProduct(null)} />
            <div className="qv" role="dialog" aria-label={p.name}>
              <button className="x qv__x" onClick={() => setViewProduct(null)} aria-label="Close">×</button>
              <div className="qv__img" style={{ background: p.g }}>
                {p.img ? <img src={p.img} alt={p.name} /> : <span className="qv__emoji">{p.emoji || "🖼️"}</span>}
              </div>
              <div className="qv__body">
                <span className="card__cat">{p.cat}</span>
                <h3 className="qv__name">{p.name}</h3>
                <div className="qv__rate">★ {Number(p.rating || 0).toFixed(1)} · in stock</div>
                {hasSizes && (
                  <div className="sizes qv__sizes">
                    {p.sizes.map((s, i) => (
                      <button key={i} className={"size-chip" + (i === si ? " on" : "")} onClick={() => setViewSizeIdx(i)}>{s.label}</button>
                    ))}
                  </div>
                )}
                <div className="qv__price"><b>{rs(price)}</b>{oldPrice && oldPrice > price ? <s>{rs(oldPrice)}</s> : null}{qvOff ? <span className="qv__off">-{qvOff}%</span> : null}</div>
                <div className="qv__ship">🚚 2 se zyada frames par <b>FREE delivery</b></div>
                {p.description ? <p className="qv__desc">{p.description}</p> : null}
                <button className="btn btn--primary btn--block" onClick={() => { addItem(p, hasSizes ? p.sizes[si] : null); setViewProduct(null); }}>Add to cart →</button>
                <button className="btn btn--ghost btn--block" style={{ marginTop: 10 }} onClick={() => setViewProduct(null)}>Continue browsing</button>
              </div>
            </div>
          </>
        );
      })()}

      <div className={"toast" + (toast ? " show" : "")}>{toast}</div>
    </>
  );
}

function Marquee({ text }) {
  const items = [text || "🎉 SALE — discount on all frames", "🚚 2 se zyada frames par FREE delivery", "🖼️ Handcrafted photo frames", "💛 Frames that make you happy"];
  return (
    <div className="marquee" aria-label="Announcements">
      <div className="marquee__track">
        {items.concat(items).map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

function Header({ cartCount, onCart, categories = [], onCategory }) {
  return (
    <header className="header">
      <div className="wrap nav">
        <a className="logo" href="#top"><img className="logo-img" src="/logo.jpg" alt="Happy Frames" /></a>
        <nav className="nav__links">
          <a href="#shop">Shop</a>
          <div className="nav__drop">
            <button className="nav__genre">Genre <span aria-hidden="true">▾</span></button>
            <div className="nav__menu">
              {categories.map((c) => (
                <a key={c.name} onClick={() => onCategory && onCategory(c.name)}>{c.emoji} {c.label}</a>
              ))}
            </div>
          </div>
          <a href="/custom">Custom Frame</a>
          <a href="/contact">Contact</a>
        </nav>
        <button className="cart-btn" onClick={onCart}>🛒 <span className="lbl">Cart</span> <span className="count">{cartCount}</span></button>
      </div>
    </header>
  );
}

function Features() {
  return (
    <section className="block" id="why" style={{ paddingTop: 10 }}>
      <div className="wrap">
        <div className="head reveal"><div><span className="eyebrow">Why Happy Frames</span><h2>Made to make you smile</h2></div></div>
        <div className="feat reveal">
          <div className="feat__item"><div className="feat__ic">🪵</div><h3>Premium Material</h3><p>Solid wood aur scratch-proof finish jo saalon chale.</p></div>
          <div className="feat__item"><div className="feat__ic">🎨</div><h3>Fully Custom</h3><p>Apni size, color aur photo ke sath order karo.</p></div>
          <div className="feat__item"><div className="feat__ic">🚚</div><h3>Fast Delivery</h3><p>Poore Pakistan mein tez aur safe shipping.</p></div>
          <div className="feat__item"><div className="feat__ic">💬</div><h3>24/7 Support</h3><p>Order se pehle aur baad — hum hamesha available.</p></div>
        </div>
      </div>
    </section>
  );
}

function Promo() {
  const [t, setT] = useState({ d: "02", h: "08", m: "45", s: "30" });
  useEffect(() => {
    const end = Date.now() + (2 * 86400 + 8 * 3600 + 45 * 60 + 30) * 1000;
    const pad = (n) => String(n).padStart(2, "0");
    const id = setInterval(() => {
      let s = Math.max(0, Math.floor((end - Date.now()) / 1000));
      const d = Math.floor(s / 86400); s -= d * 86400;
      const h = Math.floor(s / 3600); s -= h * 3600;
      const m = Math.floor(s / 60); s -= m * 60;
      setT({ d: pad(d), h: pad(h), m: pad(m), s: pad(s) });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="block" style={{ paddingBlock: "20px 70px" }} id="featured">
      <div className="wrap">
        <div className="promo reveal">
          <div className="blob blob1" style={{ right: -40, top: -60 }} />
          <div className="blob blob2" style={{ left: "auto", right: "20%", bottom: -60 }} />
          <div className="promo__in">
            <span className="tag">Limited time</span>
            <h2>Sale is <em>live</em></h2>
            <p>Sabhi frames par discount + <b>2 se zyada frames par FREE delivery</b>. Offer khatam hone se pehle grab karo!</p>
            <div className="promo__timer">
              <div className="tbox"><b>{t.d}</b><span>Days</span></div>
              <div className="tbox"><b>{t.h}</b><span>Hrs</span></div>
              <div className="tbox"><b>{t.m}</b><span>Min</span></div>
              <div className="tbox"><b>{t.s}</b><span>Sec</span></div>
            </div>
            <a href="#shop" className="btn btn--primary">Grab the deal →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter({ value, setValue, onSubmit }) {
  const [msg, setMsg] = useState("");
  return (
    <section className="wrap news reveal" id="contact">
      <span className="eyebrow center">Stay in the loop</span>
      <h2>Get 10% off your first order</h2>
      <p>Naye designs aur exclusive offers seedha inbox mein — subscribe karo.</p>
      <form onSubmit={(e) => { e.preventDefault(); setMsg("🎉 Shukriya! 10% discount code aapke email par bhej diya jayega."); e.currentTarget.reset(); }}>
        <input type="email" placeholder="Enter your email" required aria-label="Email" />
        <button className="btn btn--primary" type="submit">Subscribe</button>
      </form>
      <p style={{ minHeight: 20, marginTop: 14, color: "var(--mint)" }}>{msg}</p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot__grid">
          <div className="foot__brand">
            <a className="logo" href="#top"><img className="logo-img" src="/logo.jpg" alt="Happy Frames" /></a>
            <p>Frames that make you happy. Handcrafted with love in Pakistan. 💛</p>
            <div className="social">
              <a href="https://www.instagram.com/happy.frames_/" target="_blank" rel="noopener" aria-label="Instagram">📸</a>
              <a href="#" aria-label="WhatsApp">💬</a>
              <a href="#" aria-label="Facebook">f</a>
            </div>
          </div>
          <div><h4>Shop</h4><a href="#shop">All Frames</a><a href="#shop">Bestsellers</a><a href="#shop">New Arrivals</a><a href="/checkout">Cart</a></div>
          <div><h4>Help</h4><a href="/refund">Refund & Returns</a><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="/contact">Track / Contact</a></div>
          <div><h4>Company</h4><a href="/about">About Us</a><a href="/contact">Contact</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms</a></div>
        </div>
        <div className="foot__bar">
          <span>© 2026 Happy Frames. All rights reserved.</span>
          <span className="foot__links"><a href="/about">About</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/refund">Refund</a> · <a href="/contact">Contact</a></span>
        </div>
      </div>
    </footer>
  );
}
