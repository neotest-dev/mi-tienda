-- RLS Hardening & Storage Security Configuration

-- 1. Ensure RLS is enabled on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- 2. Clean up & re-apply strict table RLS policies
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Admin all categories" ON public.categories;
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Admin all products" ON public.products;
DROP POLICY IF EXISTS "Public read store_settings" ON public.store_settings;
DROP POLICY IF EXISTS "Admin all store_settings" ON public.store_settings;

-- Categories RLS
CREATE POLICY "Public read categories" ON public.categories
  FOR SELECT USING (active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin insert categories" ON public.categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update categories" ON public.categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete categories" ON public.categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Products RLS
CREATE POLICY "Public read products" ON public.products
  FOR SELECT USING (active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin insert products" ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update products" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete products" ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Store Settings RLS
CREATE POLICY "Public read store_settings" ON public.store_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin update store_settings" ON public.store_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- 3. Storage Buckets RLS Hardening
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true), ('store-assets', 'store-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin insert storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin update storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete storage objects" ON storage.objects;

CREATE POLICY "Public read storage objects" ON storage.objects
  FOR SELECT USING (bucket_id IN ('products', 'store-assets'));

CREATE POLICY "Admin insert storage objects" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('products', 'store-assets') AND auth.role() = 'authenticated');

CREATE POLICY "Admin update storage objects" ON storage.objects
  FOR UPDATE USING (bucket_id IN ('products', 'store-assets') AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete storage objects" ON storage.objects
  FOR DELETE USING (bucket_id IN ('products', 'store-assets') AND auth.role() = 'authenticated');
