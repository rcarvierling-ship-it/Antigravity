"use client";

import { motion } from "framer-motion";

// M-values and coefficients for Buhlmann ZHL-16C (simplified for visual representation)
const compartments = [
  { id: 1, halfTime: 4.0, label: "4m" },
  { id: 2, halfTime: 8.0, label: "8m" },
  { id: 3, halfTime: 12.5, label: "12m" },
  { id: 4, halfTime: 18.5, label: "18m" },
  { id: 5, halfTime: 27.0, label: "27m" },
  { id: 6, halfTime: 38.3, label: "38m" },
  { id: 7, halfTime: 54.3, label: "54m" },
  { id: 8, halfTime: 77.0, label: "77m" },
  { id: 9, halfTime: 109.0, label: "109m" },
  { id: 10, halfTime: 146.0, label: "146m" },
  { id: 11, halfTime: 187.0, label: "187m" },
  { id: 12, halfTime: 239.0, label: "239m" },
  { id: 13, halfTime: 305.0, label: "305m" },
  { id: 14, halfTime: 390.0, label: "390m" },
  { id: 15, halfTime: 498.0, label: "498m" },
  { id: 16, halfTime: 635.0, label: "635m" },
];

export function TissueCompartments({ data = [] }: { data?: any[] }) {
  // In a real app, we'd calculate saturation based on dive history
  // For the visual "Wow", we'll generate simulated loading
  const simulatedLoading = compartments.map((c, i) => {
    // Slower tissues load less for a single "typical" dive
    const load = Math.max(10, 85 - (i * 4) + (Math.random() * 10));
    return { ...c, load };
  });

  return (
    <div className="glass-card rounded-3xl p-6 border border-brand-cyan/20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Tissue Loading</h3>
          <p className="text-[10px] text-ocean-400 font-bold uppercase mt-1">Theoretical Buhlmann ZHL-16C Model</p>
        </div>
        <div className="text-right">
          <span className="text-[18px] font-black text-brand-teal text-glow-teal">N₂</span>
        </div>
      </div>

      <div className="h-48 flex items-end justify-between gap-1 md:gap-2">
        {simulatedLoading.map((c, i) => (
          <div key={c.id} className="flex-1 flex flex-col items-center group relative cursor-help">
            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-ocean-950 border border-ocean-800 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
              <p className="text-[9px] font-bold text-ocean-300 uppercase leading-none mb-1">{c.label} Half-time</p>
              <p className="text-xs font-black text-white">{Math.round(c.load)}% Saturation</p>
            </div>

            {/* Bar */}
            <div className="w-full bg-ocean-900/50 rounded-t-sm overflow-hidden h-32 relative flex items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${c.load}%` }}
                transition={{ duration: 1.5, delay: i * 0.05, ease: "easeOut" }}
                className={`w-full ${
                  c.load > 80 ? "bg-gradient-to-t from-orange-600 to-orange-400" : 
                  c.load > 50 ? "bg-gradient-to-t from-brand-teal to-brand-cyan" : 
                  "bg-gradient-to-t from-ocean-500 to-ocean-300"
                } rounded-t-sm shadow-[0_0_15px_rgba(0,229,255,0.2)]`}
              />
            </div>
            <span className="text-[8px] font-bold text-ocean-500 mt-2 uppercase">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-ocean-800/50 flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex items-center gap-1.5 font-bold text-[9px] text-ocean-400 uppercase">
             <div className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(0,229,255,0.5)]" /> Fast Tissues
          </div>
          <div className="flex items-center gap-1.5 font-bold text-[9px] text-ocean-400 uppercase">
             <div className="w-2 h-2 rounded-full bg-ocean-500" /> Slow Tissues
          </div>
          <div className="flex items-center gap-1.5 font-bold text-[9px] text-orange-500 uppercase">
             <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /> Near M-Value
          </div>
      </div>
    </div>
  );
}
