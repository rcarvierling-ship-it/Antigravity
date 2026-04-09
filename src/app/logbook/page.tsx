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
    <main className="w-full min-h-screen px-4 md:px-8 py-8 pt-24 md:pt-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My Logbook</h1>
            <p className="text-ocean-300 text-sm">{stats.totalDives} total dives • {Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m bottom time</p>
          </div>
          
          <Link 
            href="/logbook/new"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-cyan to-brand-teal text-deep-sea font-bold px-6 py-3 rounded-full hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5" /> Log a Dive
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-400" />
            <input 
              type="text" 
              placeholder="Search dives..." 
              className="w-full bg-ocean-950/50 border border-ocean-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-cyan transition-colors"
            />
          </div>
          <button className="p-2 glass rounded-xl text-ocean-300 hover:text-white transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-ocean-400 font-bold uppercase tracking-widest animate-pulse">Syncing Logbook...</div>
          ) : logs.length === 0 ? (
            <div className="glass p-12 rounded-[2rem] text-center border border-ocean-800/50">
               <Fish className="w-12 h-12 text-ocean-700 mx-auto mb-4" />
               <p className="text-ocean-300 font-medium">Your logbook is currently empty.</p>
               <p className="text-ocean-500 text-sm mt-2">Time to get wet and log your first dive!</p>
            </div>
          ) : logs.map((log, i) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-4 md:p-6 rounded-2xl border border-ocean-800/50 hover:bg-ocean-900/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-ocean-800/80 flex items-center justify-center border border-ocean-700/50 text-xl font-black text-brand-cyan/80 group-hover:text-brand-cyan transition-colors">
                    #{logs.length - i}
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-brand-cyan transition-colors">{log.dive_sites?.name || log.custom_site_name || "Unknown Site"}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ocean-300">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {log.dive_sites?.country || "Earth"}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(log.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right hidden sm:flex flex-col items-end">
                  <div className="flex">
                    {Array.from({length: 5}).map((_, j) => (
                      <Anchor key={j} className={`w-4 h-4 ${j < (log.rating || 0) ? 'text-brand-cyan fill-brand-cyan' : 'text-ocean-800'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] bg-ocean-800/60 text-ocean-200 px-2 py-0.5 rounded-full mt-2 font-medium">
                    {log.gas_mix || "Air"}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-ocean-800/30 flex items-center justify-between md:justify-start md:gap-12">
                <div className="flex items-center gap-2">
                  <Anchor className="w-4 h-4 text-brand-cyan" />
                  <div>
                    <span className="block text-[10px] text-ocean-400 uppercase tracking-wide">Max Depth</span>
                    <span className="font-bold text-white">{mToFt(log.max_depth_m)} ft</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-cyan" />
                  <div>
                    <span className="block text-[10px] text-ocean-400 uppercase tracking-wide">Time</span>
                    <span className="font-bold text-white">{log.bottom_time_min} min</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Fish className="w-4 h-4 text-brand-cyan" />
                  <div>
                    <span className="block text-[10px] text-ocean-400 uppercase tracking-wide">Water Temp</span>
                    <span className="font-bold text-white">{cToF(log.water_temp_c)} °F</span>
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
