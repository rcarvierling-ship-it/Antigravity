-- Migration: Marine Life Intelligence Hub
-- Adds descriptive data and visibility controls for sightings

-- 1. Enhance Species Catalog
ALTER TABLE public.marine_life_species 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS habitat_notes TEXT,
ADD COLUMN IF NOT EXISTS conservation_status TEXT DEFAULT 'Data Deficient';

-- 2. Update Sightings Control
ALTER TABLE public.user_marine_life_sightings 
ADD COLUMN IF NOT EXISTS public_visibility BOOLEAN DEFAULT true;

-- 3. Seed High-Fidelity Dossiers
UPDATE public.marine_life_species 
set description = 'The largest known fish species, these gentle giants are filter feeders found in open waters of the tropical oceans.',
    habitat_notes = 'Pelagic/Open Ocean. Often found near reefs during seasonal plankton blooms.',
    conservation_status = 'Endangered'
where name = 'Whale Shark';

UPDATE public.marine_life_species 
set description = 'Majestic filter-feeding rays known for their large triangular pectoral fins and cephalic fins.',
    habitat_notes = 'Reef slopes and cleaning stations in tropical and subtropical waters.',
    conservation_status = 'Vulnerable'
where name = 'Manta Ray';

UPDATE public.marine_life_species 
set description = 'Found primarily in the tropical Pacific and Indian Oceans, these turtles are known for their heart-shaped shells.',
    habitat_notes = 'Shallow coastal waters with abundant sea grass and algae.',
    conservation_status = 'Endangered'
where name = 'Green Sea Turtle';

UPDATE public.marine_life_species 
set description = 'A venomous marine fish native to the Indo-Pacific, now an invasive species in the Atlantic and Caribbean.',
    habitat_notes = 'Coral reefs, rocky crevices, and shipwrecks at varied depths.',
    conservation_status = 'Least Concern'
where name = 'Lionfish';
