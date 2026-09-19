"use client";
import { useEffect, useState } from "react";
import { GRADIENTS } from "@/lib/seed";

const rs = (n) => "Rs " + Number(n || 0).toLocaleString("en-PK");
const EMPTY = { name: "", cat: "", price: "", old: "", rating: "4.9", badge: "", emoji: "🖼️", g: GRADIENTS[0], img: null };

export default function AdminPage() {
  const [status, setStatus] = useState(null); // {admin, supabase, passwordSet}
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2200); };
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const loadStatus = () => fetch("/api/login").then((r) => r.json()).then(setStatus).catch(() => setStatus({ admin: false }));
  const loadProducts = () => fetch("/api/products").then((r) => r.json()).then((d) => setProducts(d.products || [])).catch(() => {});

  useEffect(() => { loadStatus(); loadProducts(); }, []);

  const login = async (e) => {
    e.preventDefault();
    setLoginErr("");
    const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (r.ok) { setPassword(""); loadStatus(); } else { const d = await r.json().catch(() => ({})); setLoginErr(d.error || "Login fail"); }
  };
  const logout = async () => { await fetch("/api/login", { method: "DELETE" }); loadStatus(); };

  const resetForm = () => { setForm(EMPTY); setEditingId(null); };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name || "", cat: p.cat || "", price: p.price ?? "", old: p.old ?? "", rating: p.rating ?? "4.9", badge: p.badge || "", emoji: p.emoji || "🖼️", g: p.g || GRADIENTS[0], img: p.img || null });
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
    if (!form.price || Number(form.price) < 0) return showToast("Sahi price likhein");
    setBusy(true);
    const body = {
      name: form.name.trim(), cat: form.cat.trim() || "Frames", price: Number(form.price),
      old: form.old ? Number(form.old) : null, rating: form.rating ? Number(form.rating) : 4.9,
      badge: form.badge, emoji: form.emoji.trim() || "🖼️", g: form.g, img: form.img || null,
    };
    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(false);
    if (r.ok) { showToast(editingId ? "Update ho gaya ✅" : "Product add ho gaya 🎉"); resetForm(); loadProducts(); }
    else { const d = await r.json().catch(() => ({})); showToast(d.error || "Save fail"); }
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
            <div className="field" style={{ margin: 0 }}><label>Price (Rs)</label><input type="number" value={form.price} onChange={(e) => upd("price", e.target.value)} placeholder="1499" /></div>
            <div className="field" style={{ margin: 0 }}><label>Old price (optional)</label><input type="number" value={form.old} onChange={(e) => upd("old", e.target.value)} placeholder="2499" /></div>
          </div>
          <div className="field row2">
            <div className="field" style={{ margin: 0 }}><label>Rating (0–5)</label><input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => upd("rating", e.target.value)} /></div>
            <div className="field" style={{ margin: 0 }}><label>Emoji (photo na ho to)</label><input value={form.emoji} onChange={(e) => upd("emoji", e.target.value)} maxLength={4} placeholder="🖼️" /></div>
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
          <h2>All products ({products.length})</h2>
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

      <div className={"toast" + (toast ? " show" : "")}>{toast}</div>
    </div>
  );
}
