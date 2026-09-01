-- Migration: 20260901170000_ecommerce_schema.sql
-- Create e-commerce tables: categories, products, store_settings with RLS policies

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '' NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Create store_settings table
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT DEFAULT 'Mi Tienda' NOT NULL,
  logo_url TEXT,
  whatsapp_number TEXT DEFAULT '51999999999' NOT NULL,
  description TEXT DEFAULT 'Tu tienda online de confianza',
  address TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  facebook_url TEXT DEFAULT '',
  tiktok_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert initial store settings if table is empty
INSERT INTO public.store_settings (store_name, whatsapp_number, description)
SELECT 'Mi Tienda', '51999999999', 'Los mejores productos al mejor precio'
WHERE NOT EXISTS (SELECT 1 FROM public.store_settings);

-- Insert initial categories
INSERT INTO public.categories (name, slug, active)
SELECT 'Celulares', 'celulares', true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'celulares');

INSERT INTO public.categories (name, slug, active)
SELECT 'Accesorios', 'accesorios', true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'accesorios');

INSERT INTO public.categories (name, slug, active)
SELECT 'Computadoras', 'computadoras', true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'computadoras');

INSERT INTO public.categories (name, slug, active)
SELECT 'Hogar', 'hogar', true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'hogar');

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Admin all categories" ON public.categories;
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Admin all products" ON public.products;
DROP POLICY IF EXISTS "Public read store_settings" ON public.store_settings;
DROP POLICY IF EXISTS "Admin all store_settings" ON public.store_settings;

-- RLS Policies for Categories
CREATE POLICY "Public read categories" ON public.categories
  FOR SELECT USING (active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin all categories" ON public.categories
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for Products
CREATE POLICY "Public read products" ON public.products
  FOR SELECT USING (active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin all products" ON public.products
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for Store Settings
CREATE POLICY "Public read store_settings" ON public.store_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin all store_settings" ON public.store_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Storage Buckets setup
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true), ('store-assets', 'store-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin full storage products bucket" ON storage.objects;

CREATE POLICY "Public read products bucket" ON storage.objects
  FOR SELECT USING (bucket_id IN ('products', 'store-assets'));

CREATE POLICY "Admin full storage products bucket" ON storage.objects
  FOR ALL USING (bucket_id IN ('products', 'store-assets') AND auth.role() = 'authenticated');
