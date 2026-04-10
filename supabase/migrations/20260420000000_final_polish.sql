-- Migration: Final Technical Hardening & Premium Finish
-- Introduces Gear Vault, Badges, and extends dive_logs for gas efficiency analytics

-- 1. Gear Vault Table
CREATE TABLE IF NOT EXISTS public.gear (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'BCD', 'Regulator', 'Computer', etc.
    model TEXT,
    serial_number TEXT,
    last_service_date DATE,
    service_interval_months INTEGER DEFAULT 12,
    purchase_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Badges Definition Table
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- e.g. 'deep-scout'
    description TEXT,
    icon_name TEXT, -- Lucide icon name
    category TEXT
);

-- 3. User Badges Junction Table
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, badge_id)
);

-- 4. Enable RLS
ALTER TABLE public.gear ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gear is viewable by owner." ON public.gear FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Gear is insertable by owner." ON public.gear FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Gear is updatable by owner." ON public.gear FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Gear is deletable by owner." ON public.gear FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are viewable by everyone." ON public.badges FOR SELECT USING (true);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User badges are viewable by everyone." ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "User badges insertable by owner (or admin)." ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Seed Initial Badges
INSERT INTO public.badges (name, slug, description, icon_name, category) VALUES
('Deep Scout', 'deep-scout', 'Logged a dive below 100ft / 30m', 'Anchor', 'experience'),
('Night Owl', 'night-owl', 'Logged a dive after sunset', 'Moon', 'experience'),
('Polar Bear', 'polar-bear', 'Dived in water below 55°F / 13°C', 'ThermometerSnowflake', 'specialty'),
('Century Diver', 'century-diver', 'Completed 100 logged dives', 'Award', 'milestone')
ON CONFLICT (slug) DO NOTHING;

-- 6. Extend dive_logs for Air Analytics
ALTER TABLE public.dive_logs 
ADD COLUMN IF NOT EXISTS avg_depth_m FLOAT,
ADD COLUMN IF NOT EXISTS air_analytics_json JSONB; -- For storing calculated SAC rate etc.
