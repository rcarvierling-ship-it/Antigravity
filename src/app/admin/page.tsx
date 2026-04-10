"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Shield, 
  Users, 
  MapPin, 
  Activity, 
  Zap, 
  Globe, 
  Radio, 
  AlertCircle,
  Clock,
  ChevronRight,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDivers: 0,
    totalMissions: 0,
    activeSites: 0,
    marineSightings: 0
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== 'admin') {
        router.push("/dashboard");
        return;
      }

      setIsAdmin(true);
      fetchGlobalTelemetry();
    }

    async function fetchGlobalTelemetry() {
      // 1. Fetch Stats
      const [divers, missions, sites, sightings] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("dive_logs").select("id", { count: "exact", head: true }),
        supabase.from("dive_sites").select("id", { count: "exact", head: true }),
        supabase.from("user_marine_life_sightings").select("id", { count: "exact", head: true })
      ]);

      setStats({
        totalDivers: divers.count || 0,
        totalMissions: missions.count || 0,
        activeSites: sites.count || 0,
        marineSightings: sightings.count || 0
      });

      // 2. Fetch Recent Logs (Global Stream)
      const { data: logs } = await supabase
        .from("dive_logs")
        .select(`
          *,
          profiles(display_name, certification_level),
          dive_sites(name, country)
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (logs) setRecentLogs(logs);
      setLoading(false);
    }

    checkAuth();
  }, [supabase, router]);

  if (!isAdmin) return null;

  return (
    <main className="w-full min-h-screen bg-deep-sea text-white pt-24 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* HUD Background Grid */}
      <div className="absolute inset-0 hud-grid opacity-10 pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 scan-line">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-brand-cyan animate-pulse" />
              <span className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.5em]">System_Override: Level_4_Access</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none italic">
               Fleet <span className="text-brand-cyan">Command</span>
            </h1>
          </div>
          <div className="bg-ocean-950/50 border border-ocean-800 p-4 rounded-2xl flex items-center gap-8 backdrop-blur-md">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-ocean-500 uppercase tracking-widest">Master Link Status</span>
                <span className="text-xs font-bold text-green-500 flex items-center gap-1.5">
                   <Zap className="w-3 h-3 fill-green-500" /> SECURE_ENCRYPTED
                </span>
             </div>
             <div className="w-px h-8 bg-ocean-800/50" />
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-ocean-500 uppercase tracking-widest">Global Timestamp</span>
                <span className="text-xs font-mono font-bold text-white uppercase">{new Date().toLocaleTimeString()} UTC</span>
             </div>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Active Personnel", value: stats.totalDivers, icon: Users, color: "text-brand-cyan", bg: "bg-brand-cyan/10" },
            { label: "Missions Recorded", value: stats.totalMissions, icon: Activity, color: "text-brand-teal", bg: "bg-brand-teal/10" },
            { label: "Satellite Anchors", value: stats.activeSites, icon: MapPin, color: "text-purple-500", bg: "bg-purple-500/10" },
            { label: "Species Classified", value: stats.marineSightings, icon: Database, color: "text-yellow-500", bg: "bg-yellow-500/10" }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-3xl border-white/5 relative overflow-hidden group hover:border-white/10 transition-all"
            >
               <div className={stat.bg + " w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"}>
                  <stat.icon className={"w-6 h-6 " + stat.color} />
               </div>
               <p className="text-[10px] font-black text-ocean-500 uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
               <div className="absolute top-4 right-4 text-[8px] font-black text-white/5 uppercase tracking-[0.5em]">Fleet_Metrics</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Global Mission Stream */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[11px] font-black text-ocean-400 uppercase tracking-[0.4em] flex items-center gap-2">
                 <Radio className="w-4 h-4 text-brand-cyan" /> Global_Mission_Stream_Alpha
              </h2>
              <button className="text-[9px] font-black text-brand-cyan hover:text-white transition-colors uppercase tracking-widest underline decoration-brand-cyan/30 underline-offset-4">Export_Batch_Log</button>
            </div>

            <div className="glass-card rounded-[2rem] border-white/5 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b border-ocean-800/50 bg-ocean-1000/50">
                          <th className="px-6 py-4 text-[9px] font-black text-ocean-500 uppercase tracking-widest">Personnel</th>
                          <th className="px-6 py-4 text-[9px] font-black text-ocean-500 uppercase tracking-widest">Satellite Anchor</th>
                          <th className="px-6 py-4 text-[9px] font-black text-ocean-500 uppercase tracking-widest">Max_Depth</th>
                          <th className="px-6 py-4 text-[9px] font-black text-ocean-500 uppercase tracking-widest">SAC_Efficiency</th>
                          <th className="px-6 py-4 text-[9px] font-black text-ocean-500 uppercase tracking-widest">TS_Index</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-ocean-800/30">
                       {recentLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-brand-cyan/5 transition-colors group">
                             <td className="px-6 py-5">
                                <div className="flex flex-col">
                                   <span className="text-xs font-bold text-white uppercase group-hover:text-brand-cyan transition-colors">{log.profiles?.display_name || "REDACTED"}</span>
                                   <span className="text-[9px] font-black text-ocean-500 uppercase tracking-tighter">{log.profiles?.certification_level}</span>
                                </div>
                             </td>
                             <td className="px-6 py-5">
                                <div className="flex flex-col">
                                   <span className="text-xs font-bold text-ocean-200">{log.dive_sites?.name}</span>
                                   <span className="text-[9px] font-black text-ocean-500 uppercase tracking-widest">{log.dive_sites?.country}</span>
                                </div>
                             </td>
                             <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                                   <span className="text-xs font-mono font-bold text-white">{log.max_depth_m}M</span>
                                </div>
                             </td>
                             <td className="px-6 py-5">
                                <span className={log.computed_sac < 15 ? "text-brand-cyan font-bold text-xs" : "text-ocean-400 font-bold text-xs"}>
                                   {log.computed_sac || "0.00"} L/MIN
                                </span>
                             </td>
                             <td className="px-6 py-5 text-[10px] font-mono text-ocean-600">
                                {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>

          {/* Catalog & Maintenance */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h2 className="text-[11px] font-black text-ocean-400 uppercase tracking-[0.4em] px-2 flex items-center gap-2">
                 <Globe className="w-4 h-4 text-brand-teal" /> Global_Catalog_Status
              </h2>
              
              <div className="space-y-3">
                 {[
                   { label: "Mission Sites", count: stats.activeSites, path: "/explore" },
                   { label: "Marine Dossier", count: stats.marineSightings, path: "/marine-life" },
                   { label: "Technical Gear", count: "84 Items", path: "/profile/gear" }
                 ].map(item => (
                   <button 
                     key={item.label}
                     onClick={() => router.push(item.path)}
                     className="w-full glass-card p-4 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all"
                   >
                      <div className="text-left">
                         <p className="text-[10px] font-black text-ocean-500 uppercase tracking-widest mb-0.5">{item.label}</p>
                         <p className="text-sm font-bold text-white">{item.count}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-ocean-700 group-hover:text-brand-cyan group-hover:translate-x-1 transition-all" />
                   </button>
                 ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-[11px] font-black text-ocean-400 uppercase tracking-[0.4em] px-2 flex items-center gap-2">
                 <AlertCircle className="w-4 h-4 text-red-500" /> Sector_Alerts
              </h2>
              
              <div className="glass-card p-6 rounded-[2rem] border-red-500/20 bg-red-500/5">
                 <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-4 h-4 text-red-500 animate-pulse fill-red-500" />
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Anomalous Activity Detected</span>
                 </div>
                 <p className="text-xs text-ocean-400 leading-relaxed font-medium mb-4 italic">
                    "Elevated gas consumption reported in Caribbean Sector-A. Cross-referencing current logs with historical SAC rates..."
                 </p>
                 <button className="w-full py-2.5 rounded-xl bg-red-500/20 text-red-500 border border-red-500/30 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/30 transition-all">Dismiss_Alert</button>
              </div>
            </div>

            {/* System Resources */}
            <div className="bg-ocean-1000/50 rounded-3xl p-6 border border-white/5">
               <div className="flex justify-between items-center mb-6">
                  <span className="text-[9px] font-black text-ocean-500 uppercase tracking-widest">Network_Load</span>
                  <span className="text-[9px] font-mono text-brand-cyan">42.8 ms</span>
               </div>
               <div className="h-1 w-full bg-ocean-900 rounded-full overflow-hidden mb-8">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    className="h-full bg-gradient-to-r from-brand-cyan to-brand-teal" 
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[8px] font-black text-ocean-600 uppercase mb-1">Satellite_Links</p>
                    <p className="text-xs font-bold text-white">12 ACTIVE</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-ocean-600 uppercase mb-1">Memory_Usage</p>
                    <p className="text-xs font-bold text-white">4.2 GB / 8GB</p>
                  </div>
               </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
