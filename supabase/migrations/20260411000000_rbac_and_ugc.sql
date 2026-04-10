-- Migration: RBAC and User-Generated Sites
-- Adds admin role and supports UGC dive sites

-- 1. Add role to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 2. Add UGC columns to dive_sites
ALTER TABLE public.dive_sites ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id);
ALTER TABLE public.dive_sites ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.dive_sites ADD COLUMN IF NOT EXISTS rating FLOAT DEFAULT 0.0;

-- 3. Admin Trigger for rcar.verling@gmail.com
-- This trigger will promote any user with this email to 'admin' automatically
CREATE OR REPLACE FUNCTION public.handle_admin_promotion()
RETURNS TRIGGER AS $$
BEGIN
  -- We check the email from auth.users via the id link
  IF (SELECT email FROM auth.users WHERE id = NEW.id) = 'rcar.verling@gmail.com' THEN
    NEW.role := 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_admin_check ON public.profiles;
CREATE TRIGGER on_profile_admin_check
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_promotion();

-- 4. Retroactive update for existing profile if it exists
-- This part might not execute in a standard migration if executed before users exist, 
-- but it's good for existing systems.
DO $$
BEGIN
  UPDATE public.profiles p
  SET role = 'admin'
  FROM auth.users u
  WHERE p.id = u.id AND u.email = 'rcar.verling@gmail.com';
END $$;

-- 5. Update RLS on dive_sites
-- DELETE: Only Admins
DROP POLICY IF EXISTS "Dive sites are deletable by admins." ON public.dive_sites;
CREATE POLICY "Dive sites are deletable by admins." 
ON public.dive_sites 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- INSERT: Authenticated users can create sites
DROP POLICY IF EXISTS "Authenticated users can create dive sites." ON public.dive_sites;
CREATE POLICY "Authenticated users can create dive sites." 
ON public.dive_sites 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- UPDATE: Owners or Admins
DROP POLICY IF EXISTS "Owners or admins can update dive sites." ON public.dive_sites;
CREATE POLICY "Owners or admins can update dive sites." 
ON public.dive_sites 
FOR UPDATE 
USING (
  auth.uid() = created_by OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
