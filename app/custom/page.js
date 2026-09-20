"use client";
import { useState } from "react";
import { SIZE_PRICE, SIZE_OLD } from "@/lib/sizes";

const rs = (n) => "Rs " + Number(n || 0).toLocaleString("en-PK");
const SIZES = ["A5", "A4", "A3"];

export default function CustomPage() {
  const [size, setSize] = useState("A4");
  const [imgUrl, setImgUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [added, setAdded] = useState(false);

  const price = SIZE_PRICE[size];
  const old = SIZE_OLD[size];

  const uploadImg = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErr(""); setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/upload-proof", { method: "POST", body: fd });
    setUploading(false);
    if (r.ok) { const d = await r.json(); setImgUrl(d.url); }
    else { const d = await r.json().catch(() => ({})); setErr(d.error || "Upload fail — dobara try karein"); }
  };

  const addToCart = () => {
    if (!imgUrl) { setErr("Pehle apni photo upload karein."); return; }
    try {
      const cart = JSON.parse(localStorage.getItem("hf_cart_v2") || "{}");
      const key = "custom|" + Date.now();
      cart[key] = { id: "custom", custom: true, name: `Custom Frame`, size, price, qty: 1, img: imgUrl };
      localStorage.setItem("hf_cart_v2", JSON.stringify(cart));
      setAdded(true);
    } catch (e) { setErr("Cart save nahi hui, dobara try karein."); }
  };

  return (
    <div className="wrap custom-pg">
      <div className="co-top">
        <a href="/" className="logo"><img className="logo-img" src="/logo.jpg" alt="Happy Frames" /></a>
        <a href="/" className="btn btn--ghost btn--sm">← Back to shop</a>
      </div>

      <div className="cf-head">
        <span className="eyebrow center">Custom order</span>
        <h1>Apna Custom Frame banwayein 🖼️</h1>
        <p>Apni pasand ki koi bhi photo/design bhejein — hum usay premium frame mein bana ke aap tak pahunchayenge.</p>
      </div>

      <div className="cf-grid">
        {/* UPLOAD + PREVIEW */}
        <div className="acard">
          <h2>Apni photo</h2>
          <div className="cf-prev">
            {imgUrl ? <img src={imgUrl} alt="your design" /> : <div className="cf-ph">🖼️<span>Yahan aapki photo dikhegi</span></div>}
          </div>
          {imgUrl
            ? <button className="btn btn--ghost btn--block" onClick={() => setImgUrl("")} style={{ marginTop: 12 }}>Photo badlein</button>
            : <label className="drop" style={{ marginTop: 12 }}>{uploading ? "⏳ Uploading…" : "📷 Photo/design upload karein"}<input type="file" accept="image/*" hidden onChange={uploadImg} /></label>}
        </div>

        {/* SIZE + PRICE */}
        <div className="acard">
          <h2>Size chunein</h2>
          <div className="cf-sizes">
            {SIZES.map((s) => (
              <button key={s} className={"cf-size" + (s === size ? " on" : "")} onClick={() => setSize(s)}>
                <b>{s}</b>
                <span className="cf-new">{rs(SIZE_PRICE[s])}</span>
                <span className="cf-old">{rs(SIZE_OLD[s])}</span>
              </button>
            ))}
          </div>

          <div className="cf-total">
            <span>{size} Custom Frame</span>
            <span className="cf-tprice"><b>{rs(price)}</b> <s>{rs(old)}</s></span>
          </div>
          <p className="cf-ship">🚚 2 se zyada frames par FREE delivery</p>

          {err && <p style={{ color: "var(--coral)", fontSize: 14, margin: "8px 0 0" }}>{err}</p>}

          {added ? (
            <div style={{ marginTop: 14 }}>
              <div className="note" style={{ marginBottom: 12 }}>✅ Custom frame cart mein add ho gaya!</div>
              <a href="/checkout" className="btn btn--primary btn--block">Checkout karein →</a>
              <button className="btn btn--ghost btn--block" style={{ marginTop: 10 }} onClick={() => { setAdded(false); setImgUrl(""); }}>Aur banwayein</button>
            </div>
          ) : (
            <button className="btn btn--primary btn--block" style={{ marginTop: 16 }} onClick={addToCart} disabled={uploading}>Add to cart →</button>
          )}
        </div>
      </div>

      <div className="cf-note">
        <h3>Kaise kaam karta hai?</h3>
        <ol>
          <li>Apni photo/design upload karein aur size chunein.</li>
          <li>Add to cart → checkout par apni details bharein.</li>
          <li>Hamari team confirm karke aapka custom frame bana degi.</li>
        </ol>
        <p style={{ color: "var(--cream-dim)", fontSize: 13 }}>Behtareen result ke liye clear/high-quality photo bhejein.</p>
      </div>
    </div>
  );
}
