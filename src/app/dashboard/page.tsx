import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickStats } from "@/components/home/QuickStats";
import { RecentDives } from "@/components/home/RecentDives";
import { FeaturedSites } from "@/components/home/FeaturedSites";

import diveSites from "@/lib/data/dive-sites.json";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // If no profile or no certification, they haven't onboarded yet
  if (!profile || !profile.certification_level) {
    redirect("/onboarding");
  }

  // Get recommendations based on their preferred type from onboarding
  const preferenceMap: Record<string, string[]> = {
    "Reef Explorer": ["Reef", "Wall", "Animal Interaction"],
    "Wreck Diver": ["Wreck"],
    "Deep Diver": ["Wall", "Wreck", "Technical"],
    "Cave/Cavern": ["Cave"],
    "Macro Photography": ["Reef"],
    "Cold Water": ["Cold Water", "Kelp Forest"]
  };

  const allowedTypes = preferenceMap[profile.preferred_diver_type as string] || [];
  
  const recommendations = diveSites
    .filter(site => allowedTypes.includes(site.type))
    .sort((a, b) => ((b as any).rating || 0) - ((a as any).rating || 0))
    .slice(0, 3);

  return (
    <main className="w-full min-h-screen flex flex-col relative pb-8">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ocean-900 via-deep-sea to-deep-sea -z-10" />

      <HeroSection 
        displayName={profile.display_name} 
        certLevel={profile.certification_level} 
      />
      
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col items-center px-4 md:px-8">
        <QuickStats profile={profile} />
        <RecentDives userId={user.id} />
        <FeaturedSites 
          title={`Recommended for ${profile.preferred_diver_type}s`}
          sites={recommendations.length > 0 ? recommendations : undefined} 
        />
      </div>
    </main>
  );
}
