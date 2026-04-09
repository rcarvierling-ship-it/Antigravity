"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Fish, MapPin, Clock } from "lucide-react";
import { mToFt } from "@/lib/conversions";
import Link from "next/link";

export function RecentDives({ userId }: { userId?: string }) {
  const [dives, setDives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchDives() {
      const supabase = createClient();
      const { data } = await supabase
        .from("dive_logs")
        .select(`
          *,
          dive_sites (name, region, country)
        `)
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(3);
      
      if (data) {
        setDives(data.map(d => ({
          id: d.id,
          site: d.dive_sites?.name || d.custom_site_name || "Unknown Site",
          location: d.dive_sites?.country || "Earth",
          date: new Date(d.date).toLocaleDateString(),
          depth: d.max_depth_m,
          duration: d.bottom_time_min,
          tags: d.gas_mix ? [d.gas_mix] : []
        })));
      }
      setLoading(false);
    }

    fetchDives();
  }, [userId]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0 mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Recent Dives</h2>
        <button className="text-sm text-brand-cyan hover:text-brand-teal transition-colors">View All</button>
      </div>

      <div className="space-y-3">
        {dives.map(dive => (
          <div key={dive.id} className="glass p-4 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-ocean-800 flex items-center justify-center border border-ocean-600 group-hover:border-brand-cyan/50 transition-colors">
                <Fish className="w-5 h-5 text-brand-cyan" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{dive.site}</h3>
                <p className="text-ocean-300 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {dive.location} • <Clock className="w-3 h-3 ml-1" /> {dive.date}
                </p>
              </div>
            </div>
            
            <div className="text-right hidden sm:block">
              <div className="flex gap-2 mb-1 justify-end">
                {dive.tags.map((t: string) => (
                  <span key={t} className="text-[10px] bg-ocean-800 text-ocean-200 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <p className="text-xs text-brand-teal font-medium">{mToFt(dive.depth)} ft max • {dive.duration} min</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
