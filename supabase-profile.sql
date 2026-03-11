-- 1. Drop existing info table if it exists (Optional, if you want clean slate)
DROP TABLE IF EXISTS info;

-- 2. Create the new portfolio_profile table
CREATE TABLE portfolio_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  avatar TEXT,
  cv TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Disable Row Level Security (RLS) to allow free API read/write
ALTER TABLE portfolio_profile DISABLE ROW LEVEL SECURITY;

-- 4. Seed an initial default row so the Dashboard has something to update
INSERT INTO portfolio_profile (name, title, bio, email, phone, location)
VALUES (
  'John Doe', 
  'Fullstack Developer', 
  'Hello! I am a passionate developer.', 
  'john@example.com', 
  '+1 234 567 890', 
  'New York, USA'
);
