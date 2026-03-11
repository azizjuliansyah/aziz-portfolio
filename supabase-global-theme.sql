-- 1. Create the new app_settings table
CREATE TABLE app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  theme TEXT DEFAULT 'system',
  enable_global_theme BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Disable Row Level Security (RLS)
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;

-- 3. Insert a single default row
INSERT INTO app_settings (theme, enable_global_theme) VALUES ('system', false);
