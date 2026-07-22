-- Drop the existing policies so we can recreate them safely
DROP POLICY IF EXISTS "Allow public read access on scraped_leads" ON public.scraped_leads;
DROP POLICY IF EXISTS "Allow public insert access on scraped_leads" ON public.scraped_leads;
DROP POLICY IF EXISTS "Allow public update access on scraped_leads" ON public.scraped_leads;
