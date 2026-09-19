"use client";
import { useEffect, useState } from "react";

const rs = (n) => "Rs " + Number(n || 0).toLocaleString("en-PK");

export default function CheckoutPage() {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", notes: "" });
  const [payment, setPayment] = useState("COD");
  const [txnId, setTxnId] = useState("");
  const [settings, setSettings] = useState({ accountTitle: "", jazzcash: "", easypaisa: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null); // {orderId, subtotal, payment}

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("hf_cart_v2") || "{}");
      const clean = {};
      Object.keys(saved).forEach((k) => { if (saved[k] && saved[k].id) clean[k] = saved[k]; });
      setCart(clean);
    } catch (e) {}
    fetch("/api/products").then((r) => r.json()).then((d) => setProducts(d.products || [])).catch(() => {});
    fetch("/api/settings").then((r) => r.json()).then((d) => { if (d.settings) setSettings(d.settings); }).catch(() => {});
  }, []);

  const acct = payment === "JazzCash" ? settings.jazzcash : payment === "Easypaisa" ? settings.easypaisa : "";

  const findProd = (id) => products.find((p) => String(p.id) === String(id));
  const keys = Object.keys(cart).filter((k) => findProd(cart[k].id));
  const subtotal = keys.reduce((s, k) => s + cart[k].price * cart[k].qty, 0);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const placeOrder = async () => {
    setErr("");
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) { setErr("Naam, phone aur address zaroori hain."); return; }
    if (payment !== "COD" && !txnId.trim()) { setErr("Payment ka Transaction ID (TID) daalein."); return; }
    if (keys.length === 0) { setErr("Cart khaali hai."); return; }
    setBusy(true);
    const items = keys.map((k) => ({ id: cart[k].id, size: cart[k].size, qty: cart[k].qty }));
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, payment, txnId, items }) });
    setBusy(false);
    if (r.ok) {
      const d = await r.json();
      try { localStorage.removeItem("hf_cart_v2"); } catch (e) {}
      setCart({});
      setDone({ orderId: d.orderId, subtotal: d.subtotal, payment });
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
          <p className="co-cod">{done.payment === "COD"
            ? <>💵 Payment: <b>Cash on Delivery</b> — {rs(done.subtotal)} delivery par dena hai.</>
            : <>📲 Payment: <b>{done.payment}</b> — {rs(done.subtotal)} ka TID mil gaya. Team verify karke order confirm karegi.</>}</p>
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

            <h2 style={{ marginTop: 22 }}>Payment method</h2>
            <div className="pay-list">
              <label className={"pay-opt" + (payment === "COD" ? " on" : "")}>
                <input type="radio" name="pay" checked={payment === "COD"} onChange={() => setPayment("COD")} />
                <div><b>Cash on Delivery</b><span>Order milne par cash mein payment.</span></div>
                <span className="pay-ic">💵</span>
              </label>

              {settings.jazzcash ? (
                <label className={"pay-opt" + (payment === "JazzCash" ? " on" : "")}>
                  <input type="radio" name="pay" checked={payment === "JazzCash"} onChange={() => setPayment("JazzCash")} />
                  <div><b>JazzCash</b><span>Number par bhej ke TID daalein.</span></div>
                  <span className="pay-ic">📲</span>
                </label>
              ) : null}

              {settings.easypaisa ? (
                <label className={"pay-opt" + (payment === "Easypaisa" ? " on" : "")}>
                  <input type="radio" name="pay" checked={payment === "Easypaisa"} onChange={() => setPayment("Easypaisa")} />
                  <div><b>Easypaisa</b><span>Number par bhej ke TID daalein.</span></div>
                  <span className="pay-ic">📲</span>
                </label>
              ) : null}
            </div>

            {payment !== "COD" && (
              <div className="pay-box">
                <p className="pay-line">Neeche diye <b>{payment}</b> account par <b>{rs(subtotal)}</b> bhejein:</p>
                <div className="pay-acct">
                  <div><span>Account title</span><b>{settings.accountTitle || "Happy Frames"}</b></div>
                  <div><span>{payment} number</span><b>{acct}</b></div>
                </div>
                <div className="field" style={{ marginTop: 12, marginBottom: 0 }}>
                  <label>Transaction ID (TID) *</label>
                  <input value={txnId} onChange={(e) => setTxnId(e.target.value)} placeholder="Payment ke baad mili TID yahan daalein" />
                </div>
                <p className="pay-hint">Paisa bhejne ke baad app se TID copy karke yahan paste karein. Team verify karke order confirm karegi.</p>
              </div>
            )}

            {err && <p style={{ color: "var(--coral)", fontSize: 14, marginTop: 12 }}>{err}</p>}
            <button className="btn btn--primary btn--block" style={{ marginTop: 18 }} onClick={placeOrder} disabled={busy}>
              {busy ? "Placing order…" : payment === "COD" ? "Place order (COD) →" : "Confirm order →"}
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
            <div className="co-row co-total"><span>Total</span><b>{rs(subtotal)}</b></div>
            <p className="co-note">Delivery charges (agar hon) team confirm karte waqt bata degi.</p>
          </div>
        </div>
      )}
    </div>
  );
}
