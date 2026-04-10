-- Migration: Abyss Emergency Response
-- Infrastructure for medical safety, distress tracking, and hyperbaric facility registry

-- 1. Enhance Profiles with Critical Medical Data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS blood_type TEXT,
ADD COLUMN IF NOT EXISTS medical_notes TEXT;

-- 2. Hyperbaric Chamber Registry
CREATE TABLE IF NOT EXISTS public.hyperbaric_chambers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    lat FLOAT8 NOT NULL,
    lng FLOAT8 NOT NULL,
    phone_24h TEXT,
    address TEXT,
    region TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. RLS for Safety Data
ALTER TABLE public.hyperbaric_chambers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chambers are viewable by everyone." ON public.hyperbaric_chambers FOR SELECT USING (true);

-- 4. Initial Seed of Critical Chambers
INSERT INTO public.hyperbaric_chambers (name, lat, lng, phone_24h, address, region)
VALUES 
('DAN America Emergency Hotline', 35.9940, -78.8986, '+1-919-684-9111', 'International Operations', 'Global'),
('Mariners Hospital Hyperbaric', 24.9626, -80.5307, '+1-305-434-3000', 'Tavernier, FL', 'USA South'),
('Cozumel SSS - International', 20.5083, -86.9472, '+52-987-872-1430', 'Cozumel, Mexico', 'Mexico'),
('Grand Cayman Health City', 19.3000, -81.3333, '+1-345-945-3111', 'Grand Cayman', 'Caribbean'),
('Jupiter Medical Center', 26.9342, -80.0942, '+1-561-263-2234', 'Jupiter, FL', 'USA South'),
('Roatan Anthony’s Key', 16.3267, -86.5367, '+504-2445-1212', 'Roatan, Honduras', 'Central America')
ON CONFLICT DO NOTHING;
