-- Migration: Grant PostgreSQL table permissions to anon and authenticated roles

-- 1. Grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2. Grant SELECT privileges to anon and authenticated on existing tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- 3. Grant full CRUD privileges on existing tables to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- 4. Grant sequence usage to authenticated users
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 5. Alter default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
