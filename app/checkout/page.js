"use client";
import { useEffect, useState } from "react";

const rs = (n) => "Rs " + Number(n || 0).toLocaleString("en-PK");

export default function CheckoutPage() {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null); // {orderId, subtotal}

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("hf_cart_v2") || "{}");
      const clean = {};
      Object.keys(saved).forEach((k) => { if (saved[k] && saved[k].id) clean[k] = saved[k]; });
      setCart(clean);
    } catch (e) {}
    fetch("/api/products").then((r) => r.json()).then((d) => setProducts(d.products || [])).catch(() => {});
  }, []);

  const findProd = (id) => products.find((p) => String(p.id) === String(id));
  const keys = Object.keys(cart).filter((k) => findProd(cart[k].id));
  const subtotal = keys.reduce((s, k) => s + cart[k].price * cart[k].qty, 0);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const placeOrder = async () => {
    setErr("");
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) { setErr("Naam, phone aur address zaroori hain."); return; }
    if (keys.length === 0) { setErr("Cart khaali hai."); return; }
    setBusy(true);
    const items = keys.map((k) => ({ id: cart[k].id, size: cart[k].size, qty: cart[k].qty }));
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, items }) });
    setBusy(false);
    if (r.ok) {
      const d = await r.json();
      try { localStorage.removeItem("hf_cart_v2"); } catch (e) {}
      setCart({});
      setDone({ orderId: d.orderId, subtotal: d.subtotal });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const d = await r.json().catch(() => ({}));
      setErr(d.error || "Order place nahi hua, dobara try karein.");
    }
  };

  // Success screen
  if (done) {
    return (
      <div className="wrap checkout">
        <div className="co-success">
          <div className="co-tick">✓</div>
          <h1>Order confirm ho gaya! 🎉</h1>
          <p>Shukriya! Aapka order mil gaya hai. Hamari team jald hi aapke number par call/message karke confirm karegi.</p>
          <div className="co-order">
            <span>Order ID</span>
            <b>#{String(done.orderId).slice(0, 8).toUpperCase()}</b>
          </div>
          <p className="co-cod">💵 Payment: <b>Cash on Delivery</b> — {rs(done.subtotal)} delivery par dena hai.</p>
          <a href="/" className="btn btn--primary">← Wapas shop par</a>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap checkout">
      <div className="co-top">
        <a href="/" className="logo"><img className="logo-img" src="/logo.jpg" alt="Happy Frames" /></a>
        <a href="/" className="btn btn--ghost btn--sm">← Continue shopping</a>
      </div>

      <h1 className="co-h1">Checkout</h1>

      {keys.length === 0 ? (
        <div className="co-empty">
          <div style={{ fontSize: 44, marginBottom: 10 }}>🛒</div>
          <p>Aapki cart khaali hai.</p>
          <a href="/" className="btn btn--primary" style={{ marginTop: 12 }}>Shop par jao</a>
        </div>
      ) : (
        <div className="co-grid">
          {/* FORM */}
          <div className="acard">
            <h2>Delivery details</h2>
            <div className="field"><label>Pura naam *</label><input value={form.name} onChange={(e) => upd("name", e.target.value)} placeholder="Aapka naam" /></div>
            <div className="field"><label>Phone / WhatsApp number *</label><input value={form.phone} onChange={(e) => upd("phone", e.target.value)} placeholder="03xx xxxxxxx" inputMode="tel" /></div>
            <div className="field"><label>Pura address *</label><input value={form.address} onChange={(e) => upd("address", e.target.value)} placeholder="Ghar/street, area" /></div>
            <div className="field"><label>Sheher (City)</label><input value={form.city} onChange={(e) => upd("city", e.target.value)} placeholder="e.g. Lahore" /></div>
            <div className="field"><label>Note (optional)</label><input value={form.notes} onChange={(e) => upd("notes", e.target.value)} placeholder="Koi khaas hidayat?" /></div>

            <h2 style={{ marginTop: 22 }}>Payment</h2>
            <label className="pay-opt selected">
              <input type="radio" checked readOnly />
              <div>
                <b>Cash on Delivery (COD)</b>
                <span>Order milne par cash mein payment karein.</span>
              </div>
              <span className="pay-ic">💵</span>
            </label>

            {err && <p style={{ color: "var(--coral)", fontSize: 14, marginTop: 12 }}>{err}</p>}
            <button className="btn btn--primary btn--block" style={{ marginTop: 18 }} onClick={placeOrder} disabled={busy}>
              {busy ? "Placing order…" : "Place order (COD) →"}
            </button>
          </div>

          {/* SUMMARY */}
          <div className="acard co-summary">
            <h2>Your order</h2>
            <div className="co-items">
              {keys.map((k) => {
                const it = cart[k]; const p = findProd(it.id);
                return (
                  <div className="co-item" key={k}>
                    <div className="co-thumb" style={{ background: p.g }}>{p.img ? <img src={p.img} alt="" /> : (p.emoji || "🖼️")}<span className="co-qty">{it.qty}</span></div>
                    <div className="co-info"><b>{p.name}</b><span>{it.size ? it.size + " · " : ""}{rs(it.price)}</span></div>
                    <div className="co-line">{rs(it.price * it.qty)}</div>
                  </div>
                );
              })}
            </div>
            <div className="co-row"><span>Subtotal</span><span>{rs(subtotal)}</span></div>
            <div className="co-row"><span>Delivery</span><span className="free">FREE 🚚</span></div>
            <div className="co-row co-total"><span>Total</span><b>{rs(subtotal)}</b></div>
          </div>
        </div>
      )}
    </div>
  );
}
