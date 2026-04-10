"use client";

import { motion } from "framer-motion";
import { Radio, Shield, Map, Activity } from "lucide-react";

export function HeroMission({ displayName, certLevel }: { displayName?: string; certLevel?: string }) {
  const missionTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

  return (
    <section className="relative w-full pt-16 pb-8 md:pt-24 md:pb-12 px-4">
      {/* Background HUD Grid */}
      <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative">
        {/* Top HUD Line */}
        <div className="flex items-center gap-4 mb-4">
           <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-cyan/30 to-brand-cyan/50" />
           <div className="flex items-center gap-2 text-[8px] font-black text-brand-cyan tracking-[0.2em] uppercase">
             <Radio className="w-3 h-3 animate-pulse" />
             Live Satellite Link Status: Optimal
           </div>
           <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-brand-cyan/30 to-brand-cyan/50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-bold uppercase tracking-tighter">
                  Mission User Ident: {displayName || "Unknown Diver"}
                </span>
                <span className="px-2 py-0.5 rounded bg-ocean-800 text-ocean-400 text-[10px] font-bold uppercase tracking-tighter">
                  Level: {certLevel || "Initial Access"}
                </span>
              </div>

              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                MISSION <span className="text-glow-cyan text-brand-cyan">COMMAND</span>
              </h1>

              <div className="flex flex-wrap gap-6 text-ocean-300 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-brand-teal" />
                  System Secure
                </div>
                <div className="flex items-center gap-2">
                  <Map className="w-3 h-3 text-brand-teal" />
                  Fleet Sync: Active
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-brand-teal" />
                  Telemetry: Encrypted
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass p-6 rounded-2xl border-brand-cyan/20 w-full lg:w-auto min-w-[280px] scan-line"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="text-[10px] font-black text-ocean-400 uppercase tracking-tighter">
                  Local Mission Time
                </div>
                <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
              </div>
              
              <div className="text-3xl font-mono font-bold text-white mb-4">
                {missionTimestamp.split(' ')[1]}
              </div>

              <div className="space-y-2">
                <div className="h-1 w-full bg-ocean-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="h-full bg-brand-cyan" 
                  />
                </div>
                <div className="flex justify-between text-[8px] font-black text-ocean-500 uppercase tracking-widest">
                  <span>Sat Uplink</span>
                  <span>75% Capacity</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
