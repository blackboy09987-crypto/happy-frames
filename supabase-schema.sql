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

-- ============================================================
--  STORAGE:  Dashboard > Storage > New bucket
--  Naam:  product-images   |   Public bucket:  ON (toggle)
--  (Yehi naam .env ke SUPABASE_BUCKET se match hona chahiye.)
-- ============================================================
