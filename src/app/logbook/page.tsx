"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Anchor, MapPin, Calendar, Clock, Fish } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { cToF, mToFt } from "@/lib/conversions";

export default function LogbookPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalDives: 0, totalTime: 0 });

  useEffect(() => {
    async function fetchLogs() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("dive_logs")
          .select("*, dive_sites(name, country)")
          .eq("user_id", user.id)
          .order("date", { ascending: false });

        if (data) {
          setLogs(data);
          const totalTime = data.reduce((acc, log) => acc + (log.bottom_time_min || 0), 0);
          setStats({ totalDives: data.length, totalTime });
        }
      }
      setLoading(false);
    }
    fetchLogs();
  }, []);

  return (
    <main className="w-full min-h-screen px-4 md:px-8 py-8 pt-24 md:pt-12 bg-deep-sea relative overflow-hidden">
      {/* HUD Background Grid */}
      <div className="absolute inset-0 hud-grid opacity-10 pointer-events-none z-0" />
      
      <div className="max-w-5xl mx-auto relative z-10 scan-line">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-brand-cyan" />
              <span className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.4em]">Fleet Log: Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-4">Expedition <span className="text-brand-cyan">History</span></h1>
            <p className="text-[10px] font-black text-ocean-500 uppercase tracking-[0.3em]">
              {stats.totalDives} VERIFIED MISSIONS • {Math.floor(stats.totalTime / 60)}H {stats.totalTime % 60}M BOTTOM TIME
            </p>
          </div>
          
          <Link 
            href="/logbook/new"
            className="flex items-center justify-center gap-3 bg-brand-cyan text-deep-sea font-black text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:scale-105 transition-all group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Log New Mission
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-600" />
            <input 
              type="text" 
              placeholder="SEARCH MISSIONS BY SITE OR REGION..." 
              className="w-full bg-ocean-950/50 border border-ocean-800/30 rounded py-3 pl-12 pr-4 text-[10px] font-black text-white placeholder-ocean-700 uppercase tracking-widest focus:outline-none focus:border-brand-cyan/50 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="text-center py-24 text-ocean-500 font-black uppercase tracking-[0.4em] animate-pulse">Synchronizing Log Data...</div>
          ) : logs.length === 0 ? (
            <div className="glass-card p-20 rounded-2xl text-center border-white/5">
                <Fish className="w-12 h-12 text-ocean-800 mx-auto mb-6" />
                <p className="text-ocean-400 font-black uppercase tracking-widest">Global Logbook Null</p>
                <p className="text-ocean-600 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Initialize your first mission to begin data capture.</p>
            </div>
          ) : logs.map((log, i) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 rounded-xl border border-white/5 hover:border-brand-cyan/30 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-brand-cyan/5 to-transparent pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded bg-ocean-1000 flex items-center justify-center border border-ocean-800 text-xl font-black text-brand-cyan group-hover:text-glow-cyan transition-all">
                    {String(logs.length - i).padStart(3, '0')}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white group-hover:text-brand-cyan transition-colors uppercase tracking-tighter leading-none mb-2">{log.dive_sites?.name || log.custom_site_name || "Unknown Site"}</h2>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                       <span className="flex items-center gap-2 text-[10px] font-black text-ocean-400 uppercase tracking-widest">
                         <MapPin className="w-3.5 h-3.5 text-ocean-600" /> {log.dive_sites?.country || "Earth Core"}
                       </span>
                       <span className="flex items-center gap-2 text-[10px] font-black text-ocean-400 uppercase tracking-widest">
                         <Calendar className="w-3.5 h-3.5 text-ocean-600" /> {new Date(log.date).toLocaleDateString()}
                       </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-12 md:text-right">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-ocean-500 uppercase tracking-widest mb-1">Max Depth</span>
                    <span className="text-lg font-black text-brand-cyan text-glow-cyan leading-none uppercase">{mToFt(log.max_depth_m)} FT</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-ocean-500 uppercase tracking-widest mb-1">Duration</span>
                    <span className="text-lg font-black text-white leading-none uppercase">{log.bottom_time_min} MIN</span>
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="text-[8px] font-black text-ocean-500 uppercase tracking-widest mb-1">Gas Mix</span>
                    <span className="text-lg font-black text-brand-teal leading-none uppercase">{log.gas_mix || "AIR"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
