# 💛 Happy Frames — Online Store

Frames that make you happy. Ek professional Next.js store — animated design, cart, WhatsApp checkout, aur ek password-protected **admin panel** (`/admin`) jahan se aap khud products add / edit / delete kar sakte hain.

- **Live design:** navy + cream brand, sale marquee, floating hero, countdown, product grid, slide-in cart
- **Products:** Supabase (free database) mein — sab visitors ko dikhein, permanent
- **Bina Supabase ke bhi chalta hai:** tab demo products dikhte hain (pehla deploy foran green)

---

## 🚀 Deploy karne ka tareeqa (step by step)

### 1) Code GitHub par daalein
```bash
git init
git add .
git commit -m "Happy Frames store"
git branch -M main
git remote add origin https://github.com/<your-username>/happy-frames.git
git push -u origin main
```

### 2) Vercel par import karein
1. [vercel.com](https://vercel.com) par GitHub se login karein
2. **Add New → Project** → apna `happy-frames` repo import karein
3. Framework apne aap **Next.js** detect hoga → **Deploy** dabayein
4. Kuch hi second mein live link mil jayega ✅ (abhi demo products ke sath)

### 3) Domain jodein (happyframes.online)
1. Vercel project → **Settings → Domains** → `happyframes.online` add karein
2. Vercel jo **DNS records** dikhaye, unhe **Namecheap → Domain → Advanced DNS** mein daalein
   - Aam taur par: `A record @ → 76.76.21.21` aur `CNAME www → cname.vercel-dns.com`
   - (Vercel screen par exact values dikhata hai — wahi use karein)
3. 5–30 min mein `https://happyframes.online` live 🎉

### 4) Database + Admin on karein (products save karne ke liye)
1. [supabase.com](https://supabase.com) par free project banayein
2. **SQL Editor** → is repo ki `supabase-schema.sql` file poori paste karke **Run**
3. **Storage → New bucket** → naam `product-images`, **Public** toggle ON
4. **Settings → API** se ye do values copy karein:
   - Project URL
   - `service_role` **secret** key (public anon nahi)
5. Vercel → **Settings → Environment Variables** mein daalein:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | aapka Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role secret key |
| `ADMIN_PASSWORD` | jo password aap chahein |
| `SUPABASE_BUCKET` | `product-images` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | aapka number, e.g. `923001234567` (country code ke sath, `+` ya `0` ke baghair) |

6. Vercel → **Deployments → Redeploy** (taake nayi env values lag jayein)

### 5) Products add karein
- `https://happyframes.online/admin` kholें
- Apna `ADMIN_PASSWORD` daal ke login karein
- Form se product add karein — photo bhi upload kar sakte hain 📷
- Save karte hi store par live ✅

---

## 🧪 Apne computer par chalane ke liye (optional)
```bash
npm install
copy .env.example .env.local   # phir .env.local mein values bhar dein
npm run dev
```
Phir browser mein `http://localhost:3000` aur admin `http://localhost:3000/admin`.

---

## 📁 Structure
```
app/            → pages (home, /admin) + API routes
components/     → StoreClient (poori store UI)
lib/            → supabase, data, auth, seed (demo products)
supabase-schema.sql → database setup
```

## 💳 Payments
Abhi checkout **WhatsApp** par order bhejta hai (asaan + free). Baad mein online payment (Stripe/PayFast) add kiya ja sakta hai.
