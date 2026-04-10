import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HeroMission } from "@/components/home/HeroMission";
import { TechnicalHUD } from "@/components/home/TechnicalHUD";
import { ExpeditionFeed } from "@/components/home/ExpeditionFeed";
import { FeaturedSites } from "@/components/home/FeaturedSites";
import { LiveWeatherTile } from "@/components/home/LiveWeatherTile";

import diveSites from "@/lib/data/dive-sites.json";
import { Radio } from "lucide-react";

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

  // Fetch Gear Status for alerts
  const { data: gear } = await supabase
    .from("gear")
    .select("last_service_date, service_interval_months")
    .eq("user_id", user.id);

  let gearAlert = false;
  if (gear) {
    const today = new Date();
    gearAlert = gear.some(item => {
      const nextDate = new Date(item.last_service_date);
      nextDate.setMonth(nextDate.getMonth() + item.service_interval_months);
      return nextDate < today;
    });
  }

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
    <main className="w-full min-h-screen flex flex-col relative pb-20 bg-deep-sea">
      {/* Global Mission Background */}
      <div className="fixed inset-0 pointer-events-none hud-grid opacity-10 -z-10" />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-ocean-900/20 via-deep-sea to-deep-sea -z-20" />

      {/* Hero Header */}
      <HeroMission 
        displayName={profile.display_name} 
        certLevel={profile.certification_level} 
      />
      
      <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col space-y-16 px-4 md:px-0">
        
        {/* Main Telemetry Cluster */}
        <TechnicalHUD profile={profile} gearAlert={gearAlert} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Left Column: Timeline & Feed */}
           <div className="lg:col-span-8">
              <ExpeditionFeed userId={user.id} />
           </div>

           {/* Right Column: Environment & Meta Intelligence */}
           <div className="lg:col-span-4 space-y-12">
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Radio className="w-4 h-4 text-brand-cyan" />
                  <h2 className="text-[10px] font-black text-ocean-500 uppercase tracking-[0.4em]">Environmental Intel</h2>
                </div>
                <LiveWeatherTile />
              </section>

              <section className="pb-12 border-t border-ocean-800/30 pt-12">
                <FeaturedSites 
                  title={`Strategy: ${profile.preferred_diver_type}s`}
                  sites={recommendations.length > 0 ? recommendations : undefined} 
                />
              </section>
           </div>
        </div>
      </div>
    </main>
  );
}
