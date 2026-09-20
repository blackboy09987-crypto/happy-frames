"use client";
import { useEffect, useState } from "react";
import { GRADIENTS } from "@/lib/seed";
import { STANDARD_SIZES } from "@/lib/sizes";

const rs = (n) => "Rs " + Number(n || 0).toLocaleString("en-PK");
const DEFAULT_SIZES = () => STANDARD_SIZES.map((s) => ({ label: s.label, price: s.price, old: s.old }));
const EMPTY = () => ({ name: "", cat: "", price: "", old: "", rating: "4.9", badge: "", emoji: "🖼️", g: GRADIENTS[0], img: null, sizes: DEFAULT_SIZES(), description: "", tags: "" });

export default function AdminPage() {
  const [status, setStatus] = useState(null); // {admin, supabase, passwordSet}
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  // note: useState(EMPTY) stores the fn as lazy initializer -> initial form = EMPTY()
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [saleOn, setSaleOn] = useState(false);
  const [saleText, setSaleText] = useState("");
  const [pay, setPay] = useState({ accountTitle: "", jazzcash: "", upaisa: "" });
  const [orders, setOrders] = useState([]);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2200); };
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // size options helpers
  const addSize = () => setForm((f) => ({ ...f, sizes: [...(f.sizes || []), { label: "", price: "", old: "" }] }));
  const updSize = (i, k, v) => setForm((f) => { const s = [...(f.sizes || [])]; s[i] = { ...s[i], [k]: v }; return { ...f, sizes: s }; });
  const removeSize = (i) => setForm((f) => ({ ...f, sizes: (f.sizes || []).filter((_, idx) => idx !== i) }));

  const loadStatus = () => fetch("/api/login").then((r) => r.json()).then(setStatus).catch(() => setStatus({ admin: false }));
  const loadProducts = () => fetch("/api/products").then((r) => r.json()).then((d) => setProducts(d.products || [])).catch(() => {});
  const loadSettings = () => fetch("/api/settings").then((r) => r.json()).then((d) => { if (d.settings) { setSaleOn(d.settings.saleOn); setSaleText(d.settings.saleText || ""); setPay({ accountTitle: d.settings.accountTitle || "", jazzcash: d.settings.jazzcash || "", upaisa: d.settings.upaisa || "" }); } }).catch(() => {});
  const loadOrders = () => fetch("/api/orders").then((r) => r.json()).then((d) => { if (Array.isArray(d.orders)) setOrders(d.orders); }).catch(() => {});

  useEffect(() => { loadStatus(); loadProducts(); loadSettings(); loadOrders(); }, []);

  const saveSale = async (nextOn) => {
    const on = nextOn !== undefined ? nextOn : saleOn;
    const r = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ saleOn: on, saleText }) });
    if (r.ok) { const d = await r.json(); setSaleOn(d.settings.saleOn); setSaleText(d.settings.saleText || ""); showToast("Sale settings save ✅"); }
    else { const d = await r.json().catch(() => ({})); showToast(d.error || "Save fail"); }
  };

  const savePayment = async () => {
    const r = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pay) });
    if (r.ok) { showToast("Payment accounts save ✅"); loadSettings(); }
    else { const d = await r.json().catch(() => ({})); showToast(d.error || "Save fail"); }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoginErr("");
    const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (r.ok) { setPassword(""); loadStatus(); loadOrders(); } else { const d = await r.json().catch(() => ({})); setLoginErr(d.error || "Login fail"); }
  };
  const logout = async () => { await fetch("/api/login", { method: "DELETE" }); loadStatus(); };

  const resetForm = () => { setForm(EMPTY); setEditingId(null); };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name || "", cat: p.cat || "", price: p.price ?? "", old: p.old ?? "", rating: p.rating ?? "4.9", badge: p.badge || "", emoji: p.emoji || "🖼️", g: p.g || GRADIENTS[0], img: p.img || null, sizes: Array.isArray(p.sizes) ? p.sizes.map((s) => ({ label: s.label, price: s.price })) : [], description: p.description || "", tags: p.tags || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadImg = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    setBusy(false);
    if (r.ok) { const d = await r.json(); upd("img", d.url); showToast("Photo add ho gayi ✅"); }
    else { const d = await r.json().catch(() => ({})); showToast(d.error || "Upload fail"); }
  };

  const save = async () => {
    if (!form.name.trim()) return showToast("Product name likhein");
    const sizes = (form.sizes || []).filter((s) => s.label && s.label.trim()).map((s) => {
      const o = { label: s.label.trim(), price: Number(s.price) || 0 };
      if (s.old) o.old = Number(s.old) || 0;
      return o;
    });
    const hasPrice = form.price && Number(form.price) > 0;
    if (!hasPrice && sizes.length === 0) return showToast("Price ya kam se kam ek size likhein");
    setBusy(true);
    const body = {
      name: form.name.trim(), cat: form.cat.trim() || "Frames",
      price: hasPrice ? Number(form.price) : 0,
      old: form.old ? Number(form.old) : null, rating: form.rating ? Number(form.rating) : 4.9,
      badge: form.badge, emoji: form.emoji.trim() || "🖼️", g: form.g, img: form.img || null,
      sizes,
      description: form.description.trim(), tags: form.tags.trim(),
    };
    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(false);
    if (r.ok) { showToast(editingId ? "Update ho gaya ✅" : "Product add ho gaya 🎉"); resetForm(); loadProducts(); }
    else { const d = await r.json().catch(() => ({})); showToast(d.error || "Save fail"); }
  };

  const importCars = async () => {
    if (!confirm("9 car frames (BMW M4/M5, F1, Porsche 911) import karein? Sizes A5=1000, A4=1500, A3=2800 ke saath.")) return;
    const r = await fetch("/api/import-cars", { method: "POST" });
    const d = await r.json().catch(() => ({}));
    if (r.ok) { showToast(`Cars: ${d.added || 0} add, ${d.updated || 0} update 🚗`); loadProducts(); }
    else showToast(d.error || "Import fail");
  };

  const removeDuplicates = async () => {
    if (!confirm("Duplicate products (same photo wale) hataayein? Har image ka sirf ek rahega.")) return;
    const r = await fetch("/api/dedupe", { method: "POST" });
    const d = await r.json().catch(() => ({}));
    if (r.ok) { showToast(d.removed > 0 ? `${d.removed} duplicates hata diye ✅` : "Koi duplicate nahi mila"); loadProducts(); }
    else showToast(d.error || "Fail");
  };

  const importIslamic = async () => {
    if (!confirm("3 Islamic frames import/update karein? (Sabr Shukr Tawakkul, Islamic Calligraphy, Allah) — sizes A5=1000, A4=1500, A3=2800.")) return;
    const r = await fetch("/api/import-islamic", { method: "POST" });
    const d = await r.json().catch(() => ({}));
    if (r.ok) { showToast(`Islamic: ${d.added || 0} add, ${d.updated || 0} update 🕌`); loadProducts(); }
    else showToast(d.error || "Import fail");
  };

  const importMovies = async () => {
    if (!confirm("Movie frames import/update karein? (Breaking Bad, Heisenberg, Spider-Man, The Batman, Joker, Fight Club, Interstellar) — sizes A5=1000, A4=1500, A3=2800.")) return;
    const r = await fetch("/api/import-movies", { method: "POST" });
    const d = await r.json().catch(() => ({}));
    if (r.ok) { showToast(`Movies: ${d.added || 0} add, ${d.updated || 0} update 🎬`); loadProducts(); }
    else showToast(d.error || "Import fail");
  };

  const del = async (p) => {
    if (!confirm(`"${p.name}" delete karein?`)) return;
    const r = await fetch(`/api/products/${p.id}`, { method: "DELETE" });
    if (r.ok) { showToast("Delete ho gaya"); if (editingId === p.id) resetForm(); loadProducts(); }
    else showToast("Delete fail");
  };

  // ---- render ----
  if (!status) return <div className="wrap admin"><p style={{ color: "var(--cream-dim)" }}>Loading…</p></div>;

  if (!status.admin) {
    return (
      <div className="wrap">
        <div className="login">
          <a className="logo" href="/" style={{ marginBottom: 18 }}><span className="face">^_</span> Happy Frames</a>
          <h1>Admin Login</h1>
          <p>Products manage karne ke liye password daalein.</p>
          {!status.passwordSet && <div className="note warn">⚠️ ADMIN_PASSWORD env variable set nahi hai. Vercel settings mein daalein.</div>}
          <form onSubmit={login}>
            <div className="field"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoFocus /></div>
            {loginErr && <p style={{ color: "var(--coral)", fontSize: 13, margin: "0 0 12px" }}>{loginErr}</p>}
            <button className="btn btn--primary btn--block" type="submit">Login →</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap admin">
      <div className="admin__top">
        <h1>Products Admin</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <a className="btn btn--ghost btn--sm" href="/">← View store</a>
          <button className="btn btn--ghost btn--sm" onClick={logout}>Logout</button>
        </div>
      </div>

      {!status.supabase && <div className="note warn">⚠️ Supabase set nahi hai — abhi demo products dikh rahe hain aur save kaam nahi karega. README mein diye steps follow karke keys daalein.</div>}

      {/* SALE CONTROL */}
      <div className="acard" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ marginBottom: 4 }}>Sale Banner {saleOn ? "🟢 ON" : "⚪ OFF"}</h2>
            <p style={{ color: "var(--cream-dim)", fontSize: 13.5, margin: 0 }}>
              {saleOn ? "Top sale marquee aur sale section store par dikh raha hai." : "Sale abhi band hai — store par koi sale banner nahi dikh raha."}
            </p>
          </div>
          <button className={"btn " + (saleOn ? "btn--ghost" : "btn--primary")} onClick={() => saveSale(!saleOn)}>
            {saleOn ? "Turn OFF sale" : "Turn ON sale 🎉"}
          </button>
        </div>
        <div className="field" style={{ marginTop: 16, marginBottom: 0 }}>
          <label>Sale banner text</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input style={{ flex: 1, minWidth: 200 }} value={saleText} onChange={(e) => setSaleText(e.target.value)} placeholder="🎉 MEGA SALE — Flat 40% OFF on all frames" />
            <button className="btn btn--ghost btn--sm" onClick={() => saveSale()}>Save text</button>
          </div>
        </div>
      </div>

      {/* PAYMENT ACCOUNTS */}
      <div className="acard" style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 4 }}>Online Payment Accounts</h2>
        <p style={{ color: "var(--cream-dim)", fontSize: 13.5, margin: "0 0 16px" }}>
          Jo number yahan bharoge wahi checkout par customer ko dikhega. Khaali chhodo to wo option chhup jayega (sirf COD dikhega).
        </p>
        <div className="field"><label>Account title (naam)</label><input value={pay.accountTitle} onChange={(e) => setPay({ ...pay, accountTitle: e.target.value })} placeholder="e.g. Happy Frames" /></div>
        <div className="field row2">
          <div className="field" style={{ margin: 0 }}><label>JazzCash number</label><input value={pay.jazzcash} onChange={(e) => setPay({ ...pay, jazzcash: e.target.value })} placeholder="03xxxxxxxxx" /></div>
          <div className="field" style={{ margin: 0 }}><label>UPaisa number</label><input value={pay.upaisa} onChange={(e) => setPay({ ...pay, upaisa: e.target.value })} placeholder="03xxxxxxxxx" /></div>
        </div>
        <button className="btn btn--primary" onClick={savePayment}>Save payment accounts</button>
      </div>

      <div className="admin__cols">
        {/* FORM */}
        <div className="acard">
          <h2>{editingId ? "Edit product" : "Add product"}</h2>
          <div className="field"><label>Product name</label><input value={form.name} onChange={(e) => upd("name", e.target.value)} placeholder="e.g. Classic Oak Frame" /></div>
          <div className="field row2">
            <div className="field" style={{ margin: 0 }}><label>Category</label><input value={form.cat} onChange={(e) => upd("cat", e.target.value)} placeholder="Classic" /></div>
            <div className="field" style={{ margin: 0 }}><label>Badge</label>
              <select value={form.badge} onChange={(e) => upd("badge", e.target.value)}>
                <option value="">None</option><option value="sale">Sale</option><option value="new">New</option>
              </select>
            </div>
          </div>
          <div className="field row2">
            <div className="field" style={{ margin: 0 }}><label>Price (Rs){form.sizes && form.sizes.length ? " — base/from" : ""}</label><input type="number" value={form.price} onChange={(e) => upd("price", e.target.value)} placeholder="1499" /></div>
            <div className="field" style={{ margin: 0 }}><label>Old price (optional)</label><input type="number" value={form.old} onChange={(e) => upd("old", e.target.value)} placeholder="2499" /></div>
          </div>

          {/* SIZE OPTIONS */}
          <div className="field">
            <label>Size options (optional) — har size ki apni price</label>
            <div className="sizes-admin">
              {(form.sizes || []).map((s, i) => (
                <div className="sizerow" key={i}>
                  <input placeholder="Size (e.g. A3)" value={s.label} onChange={(e) => updSize(i, "label", e.target.value)} />
                  <input className="num" type="number" placeholder="New" value={s.price} onChange={(e) => updSize(i, "price", e.target.value)} />
                  <input className="num" type="number" placeholder="Old" value={s.old ?? ""} onChange={(e) => updSize(i, "old", e.target.value)} />
                  <button type="button" className="iconbtn del" onClick={() => removeSize(i)} title="Remove">✕</button>
                </div>
              ))}
              <button type="button" className="btn btn--ghost btn--sm" onClick={addSize} style={{ marginTop: 4 }}>+ Add size (A3, A4, A5…)</button>
              {form.sizes && form.sizes.length > 0 && <p style={{ fontSize: 12, color: "var(--cream-dim)", margin: "8px 0 0" }}>Size add karne par customer ko chunne ka option milega aur price uske hisaab se badlegi.</p>}
            </div>
          </div>

          <div className="field row2">
            <div className="field" style={{ margin: 0 }}><label>Rating (0–5)</label><input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => upd("rating", e.target.value)} /></div>
            <div className="field" style={{ margin: 0 }}><label>Emoji (photo na ho to)</label><input value={form.emoji} onChange={(e) => upd("emoji", e.target.value)} maxLength={4} placeholder="🖼️" /></div>
          </div>
          <div className="field"><label>Description (SEO)</label>
            <textarea rows={3} value={form.description} onChange={(e) => upd("description", e.target.value)} placeholder="Is frame ke baare mein 1–2 lines — Google search aur customer ke liye." style={{ background: "var(--navy-2)", border: "1px solid var(--line)", borderRadius: 10, padding: "11px 13px", color: "var(--cream)", fontSize: 14, resize: "vertical" }} />
          </div>
          <div className="field"><label>Tags (SEO) — comma se alag</label>
            <input value={form.tags} onChange={(e) => upd("tags", e.target.value)} placeholder="bmw, m4, car frame, wall art" />
          </div>
          <div className="field"><label>Background color</label>
            <div className="swatches">
              {GRADIENTS.map((g) => <div key={g} className={"sw" + (g === form.g ? " on" : "")} style={{ background: g }} onClick={() => upd("g", g)} />)}
            </div>
          </div>
          <div className="field"><label>Product photo</label>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div className="prev" style={{ background: form.g }}>{form.img ? <img src={form.img} alt="" /> : (form.emoji || "🖼️")}</div>
              <div style={{ flex: 1 }}>
                <label className="drop">{busy ? "⏳ Uploading…" : "📷 Photo upload karein"}<input type="file" accept="image/*" hidden onChange={uploadImg} /></label>
                {form.img && <button className="btn btn--ghost btn--sm" style={{ marginTop: 8 }} onClick={() => upd("img", null)}>Remove photo</button>}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button className="btn btn--primary" onClick={save} disabled={busy}>{editingId ? "Update product" : "Save product"}</button>
            {editingId && <button className="btn btn--ghost" onClick={resetForm}>Cancel</button>}
          </div>
        </div>

        {/* LIST */}
        <div className="acard">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
            <h2 style={{ margin: 0 }}>All products ({products.length})</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn--ghost btn--sm" onClick={importCars}>🚗 Cars (9)</button>
              <button className="btn btn--ghost btn--sm" onClick={importMovies}>🎬 Movies (14)</button>
              <button className="btn btn--ghost btn--sm" onClick={importIslamic}>🕌 Islamic (3)</button>
              <button className="btn btn--ghost btn--sm" onClick={removeDuplicates} style={{ borderColor: "rgba(232,137,107,.4)" }}>🧹 Remove duplicates</button>
            </div>
          </div>
          {products.length === 0 && <p style={{ color: "var(--cream-dim)", fontSize: 14 }}>Abhi koi product nahi. Form se add karein.</p>}
          {products.map((p) => (
            <div className="arow" key={p.id}>
              <div className="th" style={{ background: p.g }}>{p.img ? <img src={p.img} alt="" /> : (p.emoji || "🖼️")}</div>
              <div className="info"><b>{p.name}</b><span>{p.cat} · {rs(p.price)}{p.badge ? " · " + p.badge : ""}</span></div>
              <button className="iconbtn" onClick={() => startEdit(p)} title="Edit">✎</button>
              <button className="iconbtn del" onClick={() => del(p)} title="Delete">🗑</button>
            </div>
          ))}
        </div>
      </div>

      {/* ORDERS */}
      <div className="acard" style={{ marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ margin: 0 }}>Orders ({orders.length})</h2>
          <button className="btn btn--ghost btn--sm" onClick={loadOrders}>↻ Refresh</button>
        </div>
        {orders.length === 0 && <p style={{ color: "var(--cream-dim)", fontSize: 14, margin: 0 }}>Abhi koi order nahi aaya.</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((o) => (
            <div className="ordrow" key={o.id}>
              <div className="ordhead">
                <b>{o.name}</b>
                <span className="ordtotal">{rs(o.subtotal)} · {o.payment || "COD"}</span>
              </div>
              <div className="ordmeta">📞 {o.phone}{o.city ? " · " + o.city : ""} · <span style={{ color: "var(--cream-dim)" }}>{new Date(o.created_at).toLocaleString()}</span></div>
              <div className="ordmeta">📍 {o.address}</div>
              {o.txn_id ? <div className="ordmeta" style={{ color: "var(--gold)" }}>💳 {o.payment} TID: {o.txn_id}</div> : null}
              {o.proof_url ? <div className="ordmeta"><a href={o.proof_url} target="_blank" rel="noopener" style={{ color: "var(--mint)", textDecoration: "underline" }}>🖼️ Payment screenshot dekhein</a></div> : null}
              {o.notes ? <div className="ordmeta">📝 {o.notes}</div> : null}
              <div className="orditems">{(o.items || []).map((it, i) => `${it.name}${it.size ? " (" + it.size + ")" : ""} ×${it.qty}`).join(",  ")}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={"toast" + (toast ? " show" : "")}>{toast}</div>
    </div>
  );
}
