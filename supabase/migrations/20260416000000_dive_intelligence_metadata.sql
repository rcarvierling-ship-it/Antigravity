-- Migration: Dive Intelligence Metadata
-- Adding columns to support site-specific environmental interpretation

ALTER TABLE public.dive_sites 
ADD COLUMN IF NOT EXISTS shore_access_type TEXT, -- 'Beach Walk', 'Giant Stride from Rocks', 'Ladder'
ADD COLUMN IF NOT EXISTS reef_orientation TEXT,   -- 'North', 'East', 'South', 'West', 'Northeast' etc.
ADD COLUMN IF NOT EXISTS site_exposure TEXT CHECK (site_exposure IN ('exposed', 'semi-protected', 'protected')),
ADD COLUMN IF NOT EXISTS protection_level TEXT CHECK (protection_level IN ('low', 'medium', 'high'));

-- Backfill some defaults for the safety engine
UPDATE public.dive_sites SET site_exposure = 'exposed', protection_level = 'low' WHERE site_exposure IS NULL;
