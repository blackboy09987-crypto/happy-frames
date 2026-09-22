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
    else { const d = await r.json().catch(() => ({})); setErr(d.error || "Upload failed — please try again"); }
  };

  const addToCart = () => {
    if (!imgUrl) { setErr("Please upload your photo first."); return; }
    try {
      const cart = JSON.parse(localStorage.getItem("hf_cart_v2") || "{}");
      const key = "custom|" + Date.now();
      cart[key] = { id: "custom", custom: true, name: `Custom Frame`, size, price, qty: 1, img: imgUrl };
      localStorage.setItem("hf_cart_v2", JSON.stringify(cart));
      setAdded(true);
    } catch (e) { setErr("Could not save to cart, please try again."); }
  };

  return (
    <div className="wrap custom-pg">
      <div className="co-top">
        <a href="/" className="logo"><img className="logo-img" src="/logo.jpg" alt="Happy Frames" /></a>
        <a href="/" className="btn btn--ghost btn--sm">← Back to shop</a>
      </div>

      <div className="cf-head">
        <span className="eyebrow center">Custom order</span>
        <h1>Create your Custom Frame 🖼️</h1>
        <p>Send us any photo/design you like — we'll craft it into a premium frame and deliver it to you.</p>
      </div>

      <div className="cf-grid">
        {/* UPLOAD + PREVIEW */}
        <div className="acard">
          <h2>Your photo</h2>
          <div className="cf-prev">
            {imgUrl ? <img src={imgUrl} alt="your design" /> : <div className="cf-ph">🖼️<span>Your photo will appear here</span></div>}
          </div>
          {imgUrl
            ? <button className="btn btn--ghost btn--block" onClick={() => setImgUrl("")} style={{ marginTop: 12 }}>Change photo</button>
            : <label className="drop" style={{ marginTop: 12 }}>{uploading ? "⏳ Uploading…" : "📷 Upload photo/design"}<input type="file" accept="image/*" hidden onChange={uploadImg} /></label>}
        </div>

        {/* SIZE + PRICE */}
        <div className="acard">
          <h2>Choose size</h2>
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
          <p className="cf-ship">🚚 FREE delivery on more than 2 frames</p>

          {err && <p style={{ color: "var(--coral)", fontSize: 14, margin: "8px 0 0" }}>{err}</p>}

          {added ? (
            <div style={{ marginTop: 14 }}>
              <div className="note" style={{ marginBottom: 12 }}>✅ Custom frame added to cart!</div>
              <a href="/checkout" className="btn btn--primary btn--block">Checkout →</a>
              <button className="btn btn--ghost btn--block" style={{ marginTop: 10 }} onClick={() => { setAdded(false); setImgUrl(""); }}>Create another</button>
            </div>
          ) : (
            <button className="btn btn--primary btn--block" style={{ marginTop: 16 }} onClick={addToCart} disabled={uploading}>Add to cart →</button>
          )}
        </div>
      </div>

      <div className="cf-note">
        <h3>How it works</h3>
        <ol>
          <li>Upload your photo/design and choose a size.</li>
          <li>Add to cart → enter your details at checkout.</li>
          <li>Our team confirms and crafts your custom frame.</li>
        </ol>
        <p style={{ color: "var(--cream-dim)", fontSize: 13 }}>For the best result, send a clear/high-quality photo.</p>
      </div>
    </div>
  );
}
