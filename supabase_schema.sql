-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  store TEXT NOT NULL,
  volume TEXT NOT NULL,
  challenge TEXT,
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create scraped_leads table
CREATE TABLE IF NOT EXISTS scraped_leads (
  id TEXT PRIMARY KEY,
  store_name TEXT NOT NULL,
  city TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  score INTEGER NOT NULL,
  status TEXT NOT NULL,
  link TEXT,
  instagram TEXT,
  followers INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
