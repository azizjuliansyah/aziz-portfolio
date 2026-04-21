-- ==========================================
-- PORTFOLIO AZIZ SETUP SCRIPT (ONE-SHOT)
-- ==========================================
-- This script will reset and recreate the entire database schema.
-- Wrapped in a transaction to ensure atomicity.

BEGIN;

-- ==========================================
-- PART 1: CLEANUP
-- ==========================================

-- Drop triggers and functions
DROP TRIGGER IF EXISTS enforce_single_active_profile ON portfolio_profile;
DROP FUNCTION IF EXISTS set_single_active_profile();

-- Drop tables with CASCADE to automatically handle foreign key dependencies
DROP TABLE IF EXISTS social_links CASCADE;
DROP TABLE IF EXISTS project_images CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS info CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS app_settings CASCADE;
DROP TABLE IF EXISTS work_experience_responsibilities CASCADE;
DROP TABLE IF EXISTS work_experience CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS portfolio_profile CASCADE;

-- ==========================================
-- PART 2: INITIALIZATION
-- ==========================================

-- Ensure necessary extensions are enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- PART 3: TABLES SETUP
-- ==========================================

-- Profile table
CREATE TABLE portfolio_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  bio TEXT,
  avatar TEXT,
  cv TEXT,
  phone TEXT,
  location TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Admin users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Skills table
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES portfolio_profile(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES portfolio_profile(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  link TEXT,
  info TEXT,
  description TEXT NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Project sub-images table
CREATE TABLE project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Social Links table
CREATE TABLE social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES portfolio_profile(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image TEXT,
  link TEXT NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- General Info table (Key-Value pairs)
CREATE TABLE info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  info TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Work Experience table
CREATE TABLE work_experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES portfolio_profile(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Certificates table
CREATE TABLE certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES portfolio_profile(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date_issued TEXT NOT NULL,
  credential_id TEXT,
  credential_url TEXT,
  image_url TEXT NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Work Experience Responsibilities
CREATE TABLE work_experience_responsibilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID REFERENCES work_experience(id) ON DELETE CASCADE,
  responsibility TEXT NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Application Settings table
CREATE TABLE app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  theme TEXT DEFAULT 'system',
  enable_global_theme BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  seo_site_name TEXT,
  seo_type TEXT,
  seo_image TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- PART 4: FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to handle single active profile
CREATE OR REPLACE FUNCTION set_single_active_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active THEN
    UPDATE portfolio_profile SET is_active = FALSE WHERE id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce single active profile
CREATE TRIGGER enforce_single_active_profile
BEFORE INSERT OR UPDATE OF is_active ON portfolio_profile
FOR EACH ROW
WHEN (NEW.is_active = TRUE)
EXECUTE FUNCTION set_single_active_profile();

-- ==========================================
-- PART 5: SEED DATA
-- ==========================================

-- Seed Initial Admin User (password is 'admin123' bcrypt hashed)
INSERT INTO users (email, password, name) 
VALUES ('admin@portfolio.com', '$2b$10$q3RpHU6qrVhvKLbbhCMa/u9KIZAzsC5s/SbFcqMKgOGQlqFxf.Xvy', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- Default App Settings (using a fixed ID for idempotency)
INSERT INTO app_settings (id, theme, enable_global_theme) 
VALUES ('00000000-0000-0000-0000-000000000001', 'system', false)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- PART 6: SECURITY & RLS
-- ==========================================

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE portfolio_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE info ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience_responsibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Define Security Policies

-- Public Read Access for Portfolio Data
CREATE POLICY "Public profiles are viewable by everyone" ON portfolio_profile FOR SELECT USING (is_active = true);
CREATE POLICY "Skills are viewable by everyone" ON skills FOR SELECT USING (true);
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Project images are viewable by everyone" ON project_images FOR SELECT USING (true);
CREATE POLICY "Social links are viewable by everyone" ON social_links FOR SELECT USING (true);
CREATE POLICY "Work experience is viewable by everyone" ON work_experience FOR SELECT USING (true);
CREATE POLICY "Work experience responsibilities are viewable by everyone" ON work_experience_responsibilities FOR SELECT USING (true);
CREATE POLICY "Certificates are viewable by everyone" ON certificates FOR SELECT USING (true);

-- Note: Tables like 'users' and 'app_settings' stay locked (no public SELECT policy).
-- Access is granted only via 'service_role' key or authenticated sessions.

COMMIT;