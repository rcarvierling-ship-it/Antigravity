"use client";

import { motion } from "framer-motion";
import { Waves, Thermometer } from "lucide-react";

export function EnvironmentalTrends() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const temps = [22, 23, 25, 27, 28, 29];
  const vis = [15, 18, 25, 30, 28, 24];

  return (
    <div className="glass-card p-6 rounded-3xl border border-ocean-800/50 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] font-black text-ocean-500 uppercase tracking-widest mb-1">Ocean State Trends</h3>
          <p className="text-lg font-bold text-white tracking-tight">Environmental Correlation</p>
        </div>
        <Waves className="w-5 h-5 text-brand-cyan" />
      </div>

      <div className="h-40 flex items-end gap-2 mb-6">
        {temps.map((t, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="relative w-full flex items-end justify-center h-full">
               {/* Visibility bar */}
               <motion.div 
                 initial={{ height: 0 }}
                 animate={{ height: `${(vis[i] / 40) * 100}%` }}
                 className="w-full bg-brand-cyan/20 rounded-t-lg border-x border-t border-brand-cyan/20"
               />
               {/* Temperature line peak */}
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="absolute w-2 h-2 bg-brand-teal rounded-full shadow-[0_0_10px_#2dd4bf]"
                 style={{ bottom: `${(t / 35) * 100}%` }}
               />
            </div>
            <span className="text-[9px] font-black text-ocean-500 uppercase tracking-tighter">{months[i]}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
         <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-brand-teal" />
            <span className="text-[9px] font-black text-ocean-300 uppercase tracking-widest">Water Temp (°C)</span>
         </div>
         <div className="flex items-center gap-1.5">
            <div className="w-2 h-0.5 bg-brand-cyan/40" />
            <span className="text-[9px] font-black text-ocean-300 uppercase tracking-widest">Visibility (m)</span>
         </div>
      </div>
    </div>
  );
}
