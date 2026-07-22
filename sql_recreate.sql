-- Create the scraped_leads table if missing
CREATE TABLE IF NOT EXISTS public.scraped_leads (
    id TEXT PRIMARY KEY,
    "storeName" TEXT NOT NULL,
    city TEXT,
    email TEXT,
    phone TEXT,
    score INTEGER,
    status TEXT,
    link TEXT,
    instagram TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.scraped_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow public read access on scraped_leads"
    ON public.scraped_leads
    FOR SELECT
    TO anon
    USING (true);

-- Allow anonymous insert access
CREATE POLICY "Allow public insert access on scraped_leads"
    ON public.scraped_leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow anonymous update access
CREATE POLICY "Allow public update access on scraped_leads"
    ON public.scraped_leads
    FOR UPDATE
    TO anon
    USING (true);
