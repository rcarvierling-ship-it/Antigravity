"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Fish, MapPin, Clock, ArrowUpRight, Anchor } from "lucide-react";
import { mToFt } from "@/lib/conversions";
import { motion } from "framer-motion";

export function ExpeditionFeed({ userId }: { userId?: string }) {
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
        .limit(4);
      
      if (data) {
        setDives(data.map(d => ({
          id: d.id,
          site: d.dive_sites?.name || d.custom_site_name || "Unknown Site",
          location: d.dive_sites?.country || "Earth",
          date: new Date(d.date).toLocaleDateString(),
          depth: d.max_depth_m,
          duration: d.bottom_time_min,
          gas: d.gas_mix || "AIR"
        })));
      }
      setLoading(false);
    }

    fetchDives();
  }, [userId]);

  if (loading) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-0 mb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
           <Anchor className="w-4 h-4 text-brand-cyan" />
           <h2 className="text-[10px] font-black text-ocean-500 uppercase tracking-[0.4em]">Expedition Timeline</h2>
        </div>
        <button className="text-[10px] font-black text-brand-cyan hover:text-brand-teal transition-colors tracking-widest uppercase border-b border-brand-cyan/20 pb-1">
          Access Archives
        </button>
      </div>

      <div className="relative border-l border-ocean-800/50 pl-8 ml-4 space-y-12">
        {dives.map((dive, i) => (
          <motion.div 
            key={dive.id} 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative"
          >
            {/* Timeline Connector Dot */}
            <div className="absolute -left-[41px] top-6 w-4 h-4 rounded-full bg-deep-sea border-2 border-brand-cyan shadow-[0_0_8px_rgba(0,229,255,0.4)]" />
            
            <div className="glass-card p-6 rounded-3xl group cursor-pointer hover:border-brand-cyan/20 transition-all grid grid-cols-1 md:grid-cols-12 gap-6 items-center scan-line">
               <div className="md:col-span-5 flex items-center gap-4">
                  <div className="p-3 rounded-full bg-ocean-900 border border-white/5 text-brand-cyan group-hover:scale-110 transition-transform">
                    <Fish className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-brand-cyan transition-colors">{dive.site}</h3>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[9px] font-bold text-ocean-500 uppercase tracking-widest flex items-center gap-1">
                         <MapPin className="w-3 h-3" /> {dive.location}
                       </span>
                       <span className="text-[9px] font-bold text-ocean-500 uppercase tracking-widest flex items-center gap-1">
                         <Clock className="w-3 h-3" /> {dive.date}
                       </span>
                    </div>
                  </div>
               </div>

               <div className="md:col-span-4 h-12 relative flex items-center">
                  {/* Depth Silhouette (Simplified Sparkline) */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/5 to-brand-teal/5 rounded-lg border border-white/5" />
                  <div className="absolute bottom-0 left-0 w-full h-px bg-white/10" />
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(dive.depth / 40) * 100}%` }}
                    className="absolute bottom-0 left-[20%] right-[20%] bg-gradient-to-t from-brand-cyan/40 to-transparent border-t border-brand-cyan opacity-40"
                  />
                  <div className="relative w-full text-center text-[10px] font-black text-ocean-400 uppercase tracking-tighter">
                    Max Depth Profile: {mToFt(dive.depth)}FT
                  </div>
               </div>

               <div className="md:col-span-3 text-right flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <span className="text-[8px] font-black bg-brand-cyan/10 text-brand-cyan px-2 py-1 rounded border border-brand-cyan/20 uppercase">
                      {dive.gas}
                    </span>
                    <span className="text-[8px] font-black bg-ocean-800 text-ocean-300 px-2 py-1 rounded border border-white/5 uppercase">
                      {dive.duration} MIN
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-teal text-[10px] font-black uppercase tracking-widest">
                    Telemetry Report <ArrowUpRight className="w-3 h-3" />
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
