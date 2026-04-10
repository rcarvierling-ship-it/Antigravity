-- Migration: Abyss Advanced Analytics
-- Infrastructure for gas consumption telemetry, unit system preferences, and mission efficiency tracking

-- 1. Deployment Preferences (Unit System)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS unit_system TEXT DEFAULT 'imperial' CHECK (unit_system IN ('imperial', 'metric'));

-- 2. Enhanced Dive Telemetry
ALTER TABLE public.dive_logs 
ADD COLUMN IF NOT EXISTS start_pressure FLOAT8, -- PSI or BAR
ADD COLUMN IF NOT EXISTS end_pressure FLOAT8,   -- PSI or BAR
ADD COLUMN IF NOT EXISTS tank_size_vol FLOAT8,  -- CUFT or Liters
ADD COLUMN IF NOT EXISTS gas_mix_pct FLOAT8 DEFAULT 21,
ADD COLUMN IF NOT EXISTS computed_sac FLOAT8,   -- Normalized to BAR/L (Metric) for global comparison
ADD COLUMN IF NOT EXISTS visibility_m FLOAT8,
ADD COLUMN IF NOT EXISTS current_strength TEXT CHECK (current_strength IN ('none', 'mild', 'strong', 'extreme')),
ADD COLUMN IF NOT EXISTS rating_score INTEGER CHECK (rating_score >= 1 AND rating_score <= 5);

-- 3. Lifetime Biometric Totals
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS total_bottom_time_min INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_air_used_l FLOAT8 DEFAULT 0;

-- 4. Automatically Update Profiling Totals on Log Insertion (Optional Trigger)
CREATE OR REPLACE FUNCTION public.update_diver_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET total_bottom_time_min = total_bottom_time_min + COALESCE(NEW.bottom_time_min, 0),
        total_dives = total_dives + 1
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_diver_stats
AFTER INSERT ON public.dive_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_diver_totals();
