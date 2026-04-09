# Abyss 🌊

A premium, mobile-first scuba diving companion. Built with Next.js, Supabase, TailwindCSS 4, and Framer Motion. 

## ✨ Features
- **Immersive Dashboards**: Glassmorphic, highly visual views for diver statistics and history.
- **Deep-sea Aesthetic**: Animated backgrounds, waves, glowing accents.
- **Interactive Logbook**: Custom logging system with graphical dive profiles.
- **Global Explorer**: 100+ global dive sites seeded mapped via Google Maps.
- **Social Connect**: Feed for dive updates and buddy finding.

## 🛠 Tech Stack
- Next.js 16 (App Router)
- React 19
- Supabase (Auth, DB, Storage)
- Tailwind CSS 4
- Framer Motion (Animations)
- Recharts (Stats & Profiling)

## 🚀 Quick Start Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Supabase Database Engine**
   - We assume you have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed.
   - Start Supabase locally:
     ```bash
     supabase start
     ```
   - Apply the initial schema and seed:
     ```bash
     supabase config push
     # Alternatively, manually run the sql found in supabase/migrations/20260409000000_init.sql and supabase/seed.sql
     ```

3. **Configure Environment**
   - Copy `.env.example` to `.env.local`
   - Fill in your Google Maps API Key:
     ```env
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
     ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🏗 Architecture
See `implementation_plan.md` for a complete breakdown of the schemas and Next.js routing structures.
