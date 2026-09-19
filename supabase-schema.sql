-- ============================================================
--  Happy Frames — Supabase database setup
--  Supabase dashboard > SQL Editor mein yeh poora paste karke "Run" karein.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,
  cat      text default 'Frames',
  price    numeric not null default 0,
  old      numeric,
  rating   numeric default 4.9,
  badge    text default '',
  emoji    text default '🖼️',
  g        text default 'linear-gradient(135deg,#f4c9a1,#e8896b)',
  img      text,
  sizes    jsonb default '[]'::jsonb,
  sort     bigint default 0,
  created_at timestamptz default now()
);

-- Agar table pehle se maujood hai to sizes column add karne ke liye:
alter table public.products add column if not exists sizes jsonb default '[]'::jsonb;

-- Site sirf server (service role key) se likhta hai, isliye RLS on rakhein
-- aur koi public policy add na karein — service role RLS bypass karta hai.
alter table public.products enable row level security;

-- Site settings (sale banner on/off, sale text) — ek singleton row
create table if not exists public.settings (
  id         text primary key default 'main',
  sale_on    boolean default false,
  sale_text  text default '',
  account_title    text default '',
  jazzcash_number  text default '',
  easypaisa_number text default '',
  updated_at timestamptz default now()
);
insert into public.settings (id) values ('main') on conflict (id) do nothing;
alter table public.settings enable row level security;
alter table public.settings add column if not exists account_title text default '';
alter table public.settings add column if not exists jazzcash_number text default '';
alter table public.settings add column if not exists easypaisa_number text default '';

-- Orders (Cash on Delivery)
create table if not exists public.orders (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  address    text not null,
  city       text,
  notes      text,
  payment    text default 'COD',
  items      jsonb default '[]'::jsonb,
  subtotal   numeric default 0,
  txn_id     text,
  status     text default 'new',
  created_at timestamptz default now()
);
alter table public.orders enable row level security;
alter table public.orders add column if not exists txn_id text;

-- ============================================================
--  STORAGE:  Dashboard > Storage > New bucket
--  Naam:  product-images   |   Public bucket:  ON (toggle)
--  (Yehi naam .env ke SUPABASE_BUCKET se match hona chahiye.)
-- ============================================================
