-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis"; -- Needed if we want to do complex bounding box queries for google maps later, but for now we can just use float8 for lat/lon for simplicity.

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  username text unique,
  avatar_url text,
  bio text,
  home_country text,
  preferred_diver_type text,
  total_dives integer default 0,
  certification_level text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone
);

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- 2. Dive Sites Table
create table public.dive_sites (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  region text,
  country text not null,
  latitude double precision not null,
  longitude double precision not null,
  short_description text,
  full_description text,
  max_depth_m integer,
  avg_depth_m integer,
  visibility_range_m integer,
  water_type text,
  dive_type text,
  skill_level text,
  tags jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.dive_sites enable row level security;
create policy "Dive sites are viewable by everyone." on public.dive_sites for select using (true);

-- 3. Dive Logs Table
create table public.dive_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  dive_site_id uuid references public.dive_sites(id) on delete set null,
  custom_site_name text,
  date date not null,
  time_in time,
  time_out time,
  max_depth_m double precision,
  avg_depth_m double precision,
  bottom_time_min integer,
  water_temp_c double precision,
  visibility_m integer,
  gas_mix text,
  start_pressure_bar integer,
  end_pressure_bar integer,
  weight_kg double precision,
  notes text,
  rating integer check(rating >= 1 and rating <= 5),
  conditions_summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.dive_logs enable row level security;
create policy "Dive logs are viewable by owner." on public.dive_logs for select using (auth.uid() = user_id);
create policy "Dive logs are insertable by owner." on public.dive_logs for insert with check (auth.uid() = user_id);
create policy "Dive logs are updatable by owner." on public.dive_logs for update using (auth.uid() = user_id);
create policy "Dive logs are deletable by owner." on public.dive_logs for delete using (auth.uid() = user_id);

-- 4. Dive Log Profiles (Depth over time graphs)
create table public.dive_log_profiles (
  id uuid default uuid_generate_v4() primary key,
  dive_log_id uuid references public.dive_logs(id) on delete cascade not null,
  time_min integer not null,
  depth_m double precision not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.dive_log_profiles enable row level security;
create policy "Dive log profiles are viewable by owner." on public.dive_log_profiles for select using (
  exists (select 1 from public.dive_logs where id = dive_log_profiles.dive_log_id and user_id = auth.uid())
);
create policy "Dive log profiles insertable by owner." on public.dive_log_profiles for insert with check (
  exists (select 1 from public.dive_logs where id = dive_log_id and user_id = auth.uid())
);

-- 5. Marine Life Dictionary
create table public.marine_life_species (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  scientific_name text,
  category text,
  rarity text,
  image_url text
);

alter table public.marine_life_species enable row level security;
create policy "Marine species viewable by everyone." on public.marine_life_species for select using (true);

-- 6. User Marine Life Sightings
create table public.user_marine_life_sightings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  species_id uuid references public.marine_life_species(id) on delete restrict not null,
  dive_log_id uuid references public.dive_logs(id) on delete set null,
  dive_site_id uuid references public.dive_sites(id) on delete set null,
  date_seen date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_marine_life_sightings enable row level security;
create policy "Sightings viewable by owner." on public.user_marine_life_sightings for select using (auth.uid() = user_id);
create policy "Sightings insertable by owner." on public.user_marine_life_sightings for insert with check (auth.uid() = user_id);

-- Storage bucket for Media Library
insert into storage.buckets (id, name, public) values ('dive_media', 'dive_media', true) on conflict do nothing;

create policy "Media readable by everyone" on storage.objects for select using (bucket_id = 'dive_media');
create policy "Users can upload their own media" on storage.objects for insert with check (bucket_id = 'dive_media' and auth.uid() = owner);
