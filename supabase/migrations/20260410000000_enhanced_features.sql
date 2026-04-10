-- Migration: Enhanced Scuba Features
-- Adds rating, difficulty, conditions, and buddy matching infrastructure

-- 1. Update Dive Sites
ALTER TABLE public.dive_sites 
ADD COLUMN IF NOT EXISTS difficulty_score INTEGER CHECK (difficulty_score >= 1 AND difficulty_score <= 5),
ADD COLUMN IF NOT EXISTS temp_range_min double precision,
ADD COLUMN IF NOT EXISTS temp_range_max double precision,
ADD COLUMN IF NOT EXISTS common_marine_life JSONB DEFAULT '[]'::jsonb;

-- 2. Update Dive Logs for richer metrics
ALTER TABLE public.dive_logs 
ADD COLUMN IF NOT EXISTS current_strength TEXT, -- 'none', 'mild', 'strong', 'ripping'
ADD COLUMN IF NOT EXISTS weather_json JSONB, -- For storing raw API metadata
ADD COLUMN IF NOT EXISTS dive_shop_id UUID; -- Will reference dive_shops table below

-- 3. Dive Shops Table
CREATE TABLE IF NOT EXISTS public.dive_shops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    website TEXT,
    contact_info JSONB,
    rating FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Link dive_logs to dive_shops (optional link)
ALTER TABLE public.dive_logs 
ADD CONSTRAINT fk_dive_shop 
FOREIGN KEY (dive_shop_id) 
REFERENCES public.dive_shops(id) 
ON DELETE SET NULL;

-- 4. Dive Photos Table
CREATE TABLE IF NOT EXISTS public.dive_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dive_log_id UUID REFERENCES public.dive_logs(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable RLS
ALTER TABLE public.dive_shops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dive shops are viewable by everyone." ON public.dive_shops FOR SELECT USING (true);

ALTER TABLE public.dive_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Photos are viewable by owner." ON public.dive_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Photos are insertable by owner." ON public.dive_photos FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Seed some Dive Shops (Optional but helpful for UI testing)
INSERT INTO public.dive_shops (name, location) VALUES
('Abyss Pro Center', 'Cozumel, Mexico'),
('Deep Blue Divers', 'Grand Cayman'),
('Sipadan Scuba', 'Mabul Island, Malaysia');
