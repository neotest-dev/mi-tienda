-- Seed data for products

INSERT INTO public.products (name, slug, description, price, image_url, category_id, active)
SELECT
  'POCO X8 Pro 5G',
  'poco-x8-pro-5g',
  'Smartphone POCO X8 Pro 5G con procesador de última generación, 12GB RAM, 256GB almacenamiento y pantalla AMOLED 120Hz.',
  1299.00,
  'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
  c.id,
  true
FROM public.categories c WHERE c.slug = 'celulares'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, image_url, category_id, active)
SELECT
  'Audífonos Inalámbricos Bluetooth',
  'audifonos-inalambricos-bluetooth',
  'Audífonos supraaurales con cancelación activa de ruido, 40 horas de batería y sonido de alta fidelidad.',
  299.00,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  c.id,
  true
FROM public.categories c WHERE c.slug = 'accesorios'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, image_url, category_id, active)
SELECT
  'Laptop Pro 15.6" M3 16GB RAM',
  'laptop-pro-15-m3',
  'Potente laptop para trabajo pesado y desarrollo con pantalla de alta resolución y batería de 18 horas.',
  4599.00,
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
  c.id,
  true
FROM public.categories c WHERE c.slug = 'computadoras'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, image_url, category_id, active)
SELECT
  'Lámpara Inteligente RGB',
  'lampara-inteligente-rgb',
  'Lámpara de noche con iluminación RGB regulable, parlante Bluetooth y base de carga rápida Qi.',
  149.00,
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
  c.id,
  true
FROM public.categories c WHERE c.slug = 'hogar'
ON CONFLICT (slug) DO NOTHING;
