-- Migration: Mission Partner Intelligence
-- Infrastructure for connecting divers based on skill and mission preferences

-- 1. Enhance Profiles for Matching
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS buddy_availability BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS specialties JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS home_base TEXT;

-- 2. Partner Invitations
CREATE TABLE IF NOT EXISTS public.buddy_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT no_self_invite CHECK (sender_id <> receiver_id)
);

-- 3. Confirmed Connections
CREATE TABLE IF NOT EXISTS public.buddy_connections (
    user_id_1 UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    user_id_2 UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id_1, user_id_2),
    CONSTRAINT connections_ordered CHECK (user_id_1 < user_id_2)
);

-- 4. Enable RLS
ALTER TABLE public.buddy_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own invitations." ON public.buddy_invitations 
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send invitations." ON public.buddy_invitations 
FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received invitations." ON public.buddy_invitations 
FOR UPDATE USING (auth.uid() = receiver_id);

ALTER TABLE public.buddy_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own connections." ON public.buddy_connections 
FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- 5. Auto-Link on Acceptance
CREATE OR REPLACE FUNCTION public.handle_invitation_acceptance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        INSERT INTO public.buddy_connections (user_id_1, user_id_2)
        VALUES (
            LEAST(NEW.sender_id, NEW.receiver_id),
            GREATEST(NEW.sender_id, NEW.receiver_id)
        )
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_invitation_accepted
AFTER UPDATE ON public.buddy_invitations
FOR EACH ROW
EXECUTE FUNCTION handle_invitation_acceptance();
