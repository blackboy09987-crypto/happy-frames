"use client";
import { useEffect, useState } from "react";
import { FREE_DELIVERY_MIN_QTY } from "@/lib/sizes";

const rs = (n) => "Rs " + Number(n || 0).toLocaleString("en-PK");

export default function CheckoutPage() {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", notes: "" });
  const [payment, setPayment] = useState("COD");
  const [txnId, setTxnId] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [uploading, setUploading] = useState(false);
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

  const acct = payment === "JazzCash" ? settings.jazzcash : payment === "UPaisa" ? settings.upaisa : "";

  const uploadProof = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/upload-proof", { method: "POST", body: fd });
    setUploading(false);
    if (r.ok) { const d = await r.json(); setProofUrl(d.url); }
    else { const d = await r.json().catch(() => ({})); setErr(d.error || "Screenshot upload failed"); }
  };

  const findProd = (id) => products.find((p) => String(p.id) === String(id));
  const keys = Object.keys(cart).filter((k) => cart[k].custom || findProd(cart[k].id));
  const rowFor = (it) => it.custom ? { name: it.name || "Custom Frame", img: it.img, g: "linear-gradient(135deg,#b7c8f0,#8a9be0)", emoji: "🖼️" } : findProd(it.id);
  const subtotal = keys.reduce((s, k) => s + cart[k].price * cart[k].qty, 0);
  const totalQty = keys.reduce((s, k) => s + cart[k].qty, 0);
  const freeDelivery = totalQty >= FREE_DELIVERY_MIN_QTY;
  const needMore = Math.max(0, FREE_DELIVERY_MIN_QTY - totalQty);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const placeOrder = async () => {
    setErr("");
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) { setErr("Name, phone and address are required."); return; }
    if (payment !== "COD" && !txnId.trim()) { setErr("Please enter the payment Transaction ID (TID)."); return; }
    if (keys.length === 0) { setErr("Your cart is empty."); return; }
    setBusy(true);
    const items = keys.map((k) => { const it = cart[k]; return it.custom ? { custom: true, size: it.size, qty: it.qty, img: it.img } : { id: it.id, size: it.size, qty: it.qty }; });
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, payment, txnId, proofUrl, items }) });
    setBusy(false);
    if (r.ok) {
      const d = await r.json();
      try { localStorage.removeItem("hf_cart_v2"); } catch (e) {}
      setCart({});
      setDone({ orderId: d.orderId, subtotal: d.subtotal, payment });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const d = await r.json().catch(() => ({}));
      setErr(d.error || "Order could not be placed, please try again.");
    }
  };

  // Success screen
  if (done) {
    return (
      <div className="wrap checkout">
        <div className="co-success">
          <div className="co-tick">✓</div>
          <h1>Order confirmed! 🎉</h1>
          <p>Thank you! We've received your order. Our team will call/message you shortly to confirm.</p>
          <div className="co-order">
            <span>Order ID</span>
            <b>#{String(done.orderId).slice(0, 8).toUpperCase()}</b>
          </div>
          <p className="co-cod">{done.payment === "COD"
            ? <>💵 Payment: <b>Cash on Delivery</b> — pay {rs(done.subtotal)} on delivery.</>
            : <>📲 Payment: <b>{done.payment}</b> — TID received for {rs(done.subtotal)}. The team will verify and confirm your order.</>}</p>
          <a href="/" className="btn btn--primary">← Back to shop</a>
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
          <p>Your cart is empty.</p>
          <a href="/" className="btn btn--primary" style={{ marginTop: 12 }}>Go to shop</a>
        </div>
      ) : (
        <div className="co-grid">
          {/* FORM */}
          <div className="acard">
            <h2>Delivery details</h2>
            <div className="field"><label>Full name *</label><input value={form.name} onChange={(e) => upd("name", e.target.value)} placeholder="Your name" /></div>
            <div className="field"><label>Phone / WhatsApp number *</label><input value={form.phone} onChange={(e) => upd("phone", e.target.value)} placeholder="03xx xxxxxxx" inputMode="tel" /></div>
            <div className="field"><label>Full address *</label><input value={form.address} onChange={(e) => upd("address", e.target.value)} placeholder="House/street, area" /></div>
            <div className="field"><label>City</label><input value={form.city} onChange={(e) => upd("city", e.target.value)} placeholder="e.g. Lahore" /></div>
            <div className="field"><label>Note (optional)</label><input value={form.notes} onChange={(e) => upd("notes", e.target.value)} placeholder="Any special instructions?" /></div>

            <h2 style={{ marginTop: 22 }}>Payment method</h2>
            <div className="pay-list">
              <label className={"pay-opt" + (payment === "COD" ? " on" : "")}>
                <input type="radio" name="pay" checked={payment === "COD"} onChange={() => setPayment("COD")} />
                <div><b>Cash on Delivery</b><span>Pay with cash when your order arrives.</span></div>
                <span className="pay-ic">💵</span>
              </label>

              {settings.jazzcash ? (
                <label className={"pay-opt" + (payment === "JazzCash" ? " on" : "")}>
                  <input type="radio" name="pay" checked={payment === "JazzCash"} onChange={() => setPayment("JazzCash")} />
                  <div><b>JazzCash</b><span>Send to the number and enter the TID.</span></div>
                  <span className="pay-ic">📲</span>
                </label>
              ) : null}

              {settings.upaisa ? (
                <label className={"pay-opt" + (payment === "UPaisa" ? " on" : "")}>
                  <input type="radio" name="pay" checked={payment === "UPaisa"} onChange={() => setPayment("UPaisa")} />
                  <div><b>UPaisa</b><span>Send to the number and enter the TID.</span></div>
                  <span className="pay-ic">📲</span>
                </label>
              ) : null}
            </div>

            {payment !== "COD" && (
              <div className="pay-box">
                <p className="pay-line">Send <b>{rs(subtotal)}</b> to the <b>{payment}</b> account below:</p>
                <div className="pay-acct">
                  <div><span>Account title</span><b>{settings.accountTitle || "Happy Frames"}</b></div>
                  <div><span>{payment} number</span><b>{acct}</b></div>
                </div>
                <div className="field" style={{ marginTop: 12, marginBottom: 0 }}>
                  <label>Transaction ID (TID) *</label>
                  <input value={txnId} onChange={(e) => setTxnId(e.target.value)} placeholder="Enter the TID you received after payment" />
                </div>
                <div className="field" style={{ marginTop: 12, marginBottom: 0 }}>
                  <label>Payment screenshot (optional)</label>
                  {proofUrl ? (
                    <div className="proof-done">
                      <img src={proofUrl} alt="proof" />
                      <span>✅ Screenshot added</span>
                      <button type="button" className="iconbtn del" onClick={() => setProofUrl("")}>✕</button>
                    </div>
                  ) : (
                    <label className="drop">{uploading ? "⏳ Uploading…" : "📷 Upload screenshot"}<input type="file" accept="image/*" hidden onChange={uploadProof} /></label>
                  )}
                </div>
                <p className="pay-hint">After sending the payment, copy the TID from your app and paste it here. Adding a screenshot is optional but speeds up verification. The team will confirm and finalize your order.</p>
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
                const it = cart[k]; const p = rowFor(it);
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
            <div className="co-row"><span>Delivery</span>{freeDelivery ? <span className="free">FREE 🚚</span> : <span style={{ color: "var(--cream-dim)" }}>Confirmed by team</span>}</div>
            <div className="co-row co-total"><span>Total</span><b>{rs(subtotal)}</b></div>
            {freeDelivery
              ? <p className="co-note" style={{ color: "var(--mint)" }}>🎉 You've unlocked FREE delivery (more than 2 frames)!</p>
              : needMore > 0
                ? <p className="co-note">🚚 Add just {needMore} more frame{needMore > 1 ? "s" : ""} to get <b>FREE</b> delivery! Otherwise delivery charges will be confirmed by the team.</p>
                : null}
          </div>
        </div>
      )}
    </div>
  );
}
