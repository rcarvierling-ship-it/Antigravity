"use client";

import { motion } from "framer-motion";
import { Fish, MapPin } from "lucide-react";

export function MarineSightingsDistribution() {
  const data = [
    { species: "Reef Shark", count: 12, color: "bg-brand-cyan" },
    { species: "Green Turtle", count: 8, color: "bg-brand-teal" },
    { species: "Manta Ray", count: 3, color: "bg-ocean-400" },
    { species: "Lionfish", count: 15, color: "bg-red-500" },
  ];

  const max = Math.max(...data.map(d => d.count));

  return (
    <div className="glass-card p-6 rounded-3xl border border-ocean-800/50 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] font-black text-ocean-500 uppercase tracking-widest mb-1">Biological Distribution</h3>
          <p className="text-lg font-bold text-white tracking-tight">Sightings Frequency</p>
        </div>
        <Fish className="w-5 h-5 text-brand-teal" />
      </div>

      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={item.species} className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-ocean-300">{item.species}</span>
              <span className="text-white">{item.count} hits</span>
            </div>
            <div className="h-1.5 w-full bg-ocean-950 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(item.count / max) * 100}%` }}
                 transition={{ delay: i * 0.1, duration: 1 }}
                 className={`h-full ${item.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
               />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-4 border-t border-ocean-800/30">
        <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black text-ocean-400 uppercase tracking-widest transition-all">
          View Biodiversity Report
        </button>
      </div>
    </div>
  );
}
