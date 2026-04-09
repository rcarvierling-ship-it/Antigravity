# Antigravity Scuba App Implementation Plan

We are building a premium, mobile-first scuba diving web application. The platform will serve as a comprehensive underwater companion, featuring dive site discovery, personal logging, certification tracking, social networking, and safety tools. The UI will prominently feature an deep-sea aesthetic utilizing dark navy/blue palettes, glassmorphism, glowing accents, and smooth Framer Motion animations.

## User Review Required

> [!IMPORTANT]
> Please review the proposed **Supabase Database Schema** and the **Phased Implementation Execution Plan**. Let me know if you would like any adjustments to the domain models or if you want to prioritize certain features (like the AI Chat Assistant or the Google Maps integration) earlier in the build process.

## Architecture & Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Premium deep sea theme, glassmorphism, glows)
- **Animations**: Framer Motion
- **Database, Auth & Storage**: Supabase (PostgreSQL, Row Level Security)
- **Maps**: `@vis.gl/react-google-maps` (Google Maps API)
- **Charts**: Recharts (for diver statistics and dive profile visualization)
- **Weather/Tides**: Open-Meteo & Stormglass APIs
- **Icons**: `lucide-react`

## Database Schema (Supabase)

The database will be fully relational with strict Row-Level Security (RLS) to ensure user data remains private.

### Core Tables

1. **`profiles`**
   - `id` (uuid, refs auth.users)
   - `display_name`, `username`, `avatar_url`, `bio`
   - `home_country`, `preferred_diver_type`
   - `total_dives`, `certification_level` (cached copy)
   - `created_at`, `updated_at`

2. **`dive_sites`**
   - `id` (uuid)
   - `name`, `region`, `country`, `latitude`, `longitude`
   - `short_description`, `full_description`
   - `max_depth_m`, `avg_depth_m`, `visibility_range_m`
   - `water_type` (salt/fresh), `dive_type` (reef, wreck, wall, etc.)
   - `skill_level` (beginner, advanced, etc.)
   - `tags` (jsonb array)
   - `created_at`

3. **`dive_logs`**
   - `id` (uuid)
   - `user_id` (refs profiles)
   - `dive_site_id` (refs dive_sites, nullable for custom spots)
   - `date`, `time_in`, `time_out`
   - `max_depth_m`, `avg_depth_m`, `bottom_time_min`
   - `water_temp_c`, `visibility_m`
   - `gas_mix`, `start_pressure_bar`, `end_pressure_bar`, `weight_kg`
   - `notes`, `rating`, `conditions_summary`
   - `created_at`

4. **`dive_log_profiles`** (Time/Depth chart data)
   - `id`, `dive_log_id`, `time_min`, `depth_m`

5. **`media_library`**
   - `id`, `user_id`, `file_url`, `media_type` (image/video)
   - `dive_log_id` (refs dive_logs, nullable)
   - `dive_site_id` (refs dive_sites, nullable)
   - `marine_life_id` (nullable)

6. **`marine_life_species`** (Global dictionary)
   - `id`, `name`, `scientific_name`, `category`, `rarity`

7. **`user_marine_life_sightings`**
   - `id`, `user_id`, `species_id`
   - `dive_log_id`, `dive_site_id`, `date_seen`

8. **`certifications`** (Global definitions)
   - `id`, `agency` (PADI, SSI, etc.), `name`, `level`, `type`

9. **`user_certifications`**
   - `id`, `user_id`, `certification_id`
   - `issue_date`, `instructor_name`, `cert_number`

10. **`buddy_posts`** & **`buddy_post_responses`**
    - `id`, `user_id`, `dive_site_id`, `planned_date`
    - `experience_required`, `goals`, `status`

11. **`emergency_cards`**
    - `id`, `user_id`
    - `full_name`, `dob`, `blood_type`, `allergies`, `medications`
    - `emergency_contacts` (jsonb), `insurance_info`, `dan_membership`

## Project Folder Structure

```
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── (auth)/         # Login, Register
│   │   ├── (dashboard)/    # Authenticated app shell
│   │   │   ├── page.tsx    # Home Screen (Immersive Dashboard)
│   │   │   ├── explore/    # Global Dive Site Map
│   │   │   ├── logbook/    # Dive Logs
│   │   │   ├── stats/      # Diver Statistics
│   │   │   ├── ...         # Other modules (certifications, buddy, etc.)
│   ├── components/
│   │   ├── ui/             # Reusable base components (buttons, inputs)
│   │   ├── layout/         # Navigation, Sidebar, Mobile Nav
│   │   ├── map/            # Google Maps wrappers
│   │   ├── charts/         # Recharts implementations
│   ├── lib/
│   │   ├── supabase/       # Supabase client & types
│   │   ├── utils/          # Tailwind helpers, formatters
│   ├── types/              # TS interface definitions
├── supabase/
│   ├── migrations/         # SQL schema definitions
│   ├── seed.sql            # Core seed data for 100+ sites & species
```

## Phased Implementation Plan

### Phase 1: Foundation & Theming
- Initialize Next.js project with Tailwind CSS.
- Configure deep sea/ocean theme colors, typography, and Framer Motion variants.
- Setup Supabase local development, schemas, and `seed.sql` for 100+ dive sites.
- Build the persistent Mobile Bottom Navigation and responsive App Shell.

### Phase 2: Core Discovery & Home Screen
- Implement the highly visual Home Screen with underwater heroic animations (particles, gradients).
- Build the Dive Site Explorer leveraging `@vis.gl/react-google-maps`.
- Construct individual Dive Site Detail pages with weather/tides integrations (Open-Meteo & Stormglass APIs).

### Phase 3: Diver Identity & Logistics
- Develop the Dive Log system (CRUD) including the Time/Depth Profile Visualizer.
- Build the User Profile and Diver Statistics Dashboard using Recharts.
- Implement the Certification Tracker and Marine Life Tracker systems.

### Phase 4: Social, Tools & Media
- Develop the Media Library gallery.
- Build the Buddy Finder and Social Feed.
- Implement Dive Calculators, Surface Interval Timers, and the Emergency Card.
- Set up scaffolding for the AI Chat Assistant.

## Open Questions

1. **Mapping Provider**: I'll be using Google Maps API as requested. I'll need you to supply an API Key locally or configure it as an environment variable (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) when we begin.
2. **Weather/Tides API**: Open-Meteo is free for basic usage, but StormGlass requires an API key for tides. Will you provide a StormGlass key, or should we mock this data during development?
3. **Seeding Strategy**: For the 100+ global dive sites, would you prefer the sample data hardcoded into a SQL seed file, or generated via a separate script? A comprehensive SQL `seed.sql` inside the Supabase folder is standard practice.

## Verification Plan

### Automated Tests
- Build verification via `npm run build`.
- Linter verification via `npm run lint`.

### Manual Verification
- Visual inspection of the UI across mobile and desktop viewports, focusing on Framer Motion fluidity and premium CSS treatment.
- Testing of Supabase connections, querying seed data for Dive Sites, and end-to-end testing of user interactions (logging a dive, opening calculators, using the map).
