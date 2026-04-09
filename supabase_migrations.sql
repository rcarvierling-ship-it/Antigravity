-- 1. Gear Vault Table
CREATE TABLE public.gear (
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
CREATE TABLE public.badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- e.g. 'deep-scout'
    description TEXT,
    icon_name TEXT, -- Lucide icon name
    category TEXT
);

-- 3. User Badges Junction Table
CREATE TABLE public.user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, badge_id)
);

-- 4. Buddy Links Table
CREATE TABLE public.buddy_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user1_id, user2_id)
);

-- 5. Extend dive_logs for Air Analytics and Buddies
ALTER TABLE public.dive_logs 
ADD COLUMN IF NOT EXISTS start_psi INTEGER,
ADD COLUMN IF NOT EXISTS end_psi INTEGER,
ADD COLUMN IF NOT EXISTS tank_volume_cuft FLOAT DEFAULT 80.0,
ADD COLUMN IF NOT EXISTS avg_depth_m FLOAT,
ADD COLUMN IF NOT EXISTS air_analytics_json JSONB; -- For storing calculated SAC rate etc.

-- 6. Seed Initial Badges
INSERT INTO public.badges (name, slug, description, icon_name, category) VALUES
('Deep Scout', 'deep-scout', 'Logged a dive below 100ft / 30m', 'Anchor', 'experience'),
('Night Owl', 'night-owl', 'Logged a dive after sunset', 'Moon', 'experience'),
('Polar Bear', 'polar-bear', 'Dived in water below 55°F / 13°C', 'ThermometerSnowflake', 'specialty'),
('Century Diver', 'century-diver', 'Completed 100 logged dives', 'Award', 'milestone');
