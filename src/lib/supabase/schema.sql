-- ===================================================
-- WarehouseHub — Supabase Schema
-- คัดลอก SQL นี้ไปรันใน Supabase SQL Editor
-- https://app.supabase.com → SQL Editor → New query
-- ===================================================

-- 1. สร้าง table warehouses
create table if not exists public.warehouses (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade,
  name          text not null,
  location      text not null,
  province      text not null default 'กรุงเทพฯ',
  area          integer not null,
  price_per_month integer not null,
  price_per_sqm numeric generated always as (price_per_month::numeric / area) stored,
  type          text not null default 'ทั่วไป',
  available     boolean not null default true,
  ceiling_height numeric,
  loading_docks integer default 0,
  has_sprinkler boolean default false,
  has_forklift  boolean default false,
  has_security  boolean default true,
  has_cctv      boolean default true,
  min_rent_months integer default 1,
  owner_name    text,
  owner_phone   text,
  description   text,
  images        text[] default '{}',
  nearby_highways text[] default '{}',
  rating        numeric default 5.0,
  review_count  integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 2. Row Level Security
alter table public.warehouses enable row level security;

-- ทุกคนดูได้ (public listing)
create policy "Public can view all warehouses"
  on public.warehouses for select
  using (true);

-- เจ้าของเท่านั้นที่เพิ่ม/แก้ไข/ลบได้
create policy "Owner can insert"
  on public.warehouses for insert
  with check (auth.uid() = user_id);

create policy "Owner can update"
  on public.warehouses for update
  using (auth.uid() = user_id);

create policy "Owner can delete"
  on public.warehouses for delete
  using (auth.uid() = user_id);

-- 3. profiles table (เก็บข้อมูลเพิ่มเติมของ user)
create table if not exists public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  company_name  text,
  phone         text,
  plan          text default 'free',
  created_at    timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 4. Auto-create profile เมื่อ user สมัคร
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Storage bucket สำหรับรูปคลังสินค้า
-- ไปที่ Storage → New bucket → ตั้งชื่อ "warehouse-images" → Public bucket ✓
insert into storage.buckets (id, name, public)
values ('warehouse-images', 'warehouse-images', true)
on conflict do nothing;

-- Storage policy: ทุกคนดูรูปได้
create policy "Public can view images"
  on storage.objects for select
  using (bucket_id = 'warehouse-images');

-- เจ้าของ upload ได้
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (bucket_id = 'warehouse-images' and auth.role() = 'authenticated');

create policy "Owners can delete own images"
  on storage.objects for delete
  using (bucket_id = 'warehouse-images' and auth.uid()::text = (storage.foldername(name))[1]);
