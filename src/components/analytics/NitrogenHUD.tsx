"use client";

import { motion } from "framer-motion";
import { Gauge, Info, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// Simulated 16-compartment ZHL-16C tissue loading
// For visual/entertainment purposes only
const TISSUE_COMPARTMENTS = [
  { id: 1, halfTime: 4.0, loading: 0.12 },
  { id: 2, halfTime: 8.0, loading: 0.18 },
  { id: 3, halfTime: 12.5, loading: 0.25 },
  { id: 4, halfTime: 18.5, loading: 0.35 },
  { id: 5, halfTime: 27.0, loading: 0.45 },
  { id: 6, halfTime: 38.3, loading: 0.55 },
  { id: 7, halfTime: 54.3, loading: 0.65 },
  { id: 8, halfTime: 77.0, loading: 0.72 },
  { id: 9, halfTime: 109.0, loading: 0.60 },
  { id: 10, halfTime: 146.0, loading: 0.50 },
  { id: 11, halfTime: 187.0, loading: 0.40 },
  { id: 12, halfTime: 239.0, loading: 0.30 },
  { id: 13, halfTime: 305.0, loading: 0.20 },
  { id: 14, halfTime: 390.0, loading: 0.15 },
  { id: 15, halfTime: 498.0, loading: 0.10 },
  { id: 16, halfTime: 635.0, loading: 0.08 },
];

export function NitrogenHUD({ className }: { className?: string }) {
  // Use a pseudo-random value representing surface interval washout
  const surfaceIntervalFactor = 0.6; // Simulating post-dive washout

  return (
    <div className={cn("glass-card p-6 rounded-3xl border border-ocean-800/50 bg-gradient-to-br from-ocean-1000 to-ocean-950 relative overflow-hidden group", className)}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
             <Gauge className="w-4 h-4 text-brand-cyan" />
             <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest leading-none">Tissue Loading</span>
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Nitrogen Saturation</h3>
          <p className="text-[9px] font-bold text-ocean-500 uppercase tracking-widest mt-1">ZHL-16C Algorithmic Model (Simulated)</p>
        </div>
        <div className="p-2 border border-brand-teal/20 bg-brand-teal/10 rounded-lg text-brand-teal group-hover:bg-brand-teal group-hover:text-deep-sea transition-all cursor-help relative group/tt">
          <Info className="w-4 h-4" />
          <div className="absolute -bottom-2 translate-y-full right-0 w-64 p-3 bg-ocean-900 border border-brand-cyan/30 rounded-xl opacity-0 invisible group-hover/tt:opacity-100 group-hover/tt:visible transition-all z-50 text-[10px] leading-relaxed text-ocean-300 font-mono">
            <strong>DISCLAIMER:</strong> This visualization of Buhlmann ZHL-16C tissue compartments is for entertainment and educational analysis only. Never use this for actual decompression calculations. Rely on certified dive computers.
          </div>
        </div>
      </div>

      {/* Compartment Graph */}
      <div className="h-48 w-full flex items-end justify-between gap-1 mt-8 pb-2 border-b border-ocean-800/50 relative">
        {/* M-Value Warning Line */}
        <div className="absolute top-[20%] left-0 w-full border-t border-red-500/30 border-dashed z-0 flex items-end">
           <span className="text-[8px] font-black text-red-500/50 pl-1 uppercase tracking-widest -translate-y-full absolute">M-Value Limit</span>
        </div>
        
        {TISSUE_COMPARTMENTS.map((comp, idx) => {
          const loadingHeight = Math.max(5, comp.loading * surfaceIntervalFactor * 100);
          const isHigh = loadingHeight > 60;
          return (
            <div key={comp.id} className="relative flex-1 flex flex-col justify-end items-center h-full z-10 group/bar">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${loadingHeight}%` }}
                transition={{ duration: 1.5, delay: idx * 0.05, ease: "easeOut" }}
                className={cn(
                  "w-full max-w-[12px] rounded-t-sm transition-colors",
                  isHigh ? "bg-yellow-500/80 shadow-[0_0_15px_rgba(234,179,8,0.4)]" : "bg-brand-cyan/60 hover:bg-brand-cyan shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                )}
              />
              {/* Tooltip on hover */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 rounded text-[8px] font-mono text-white opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                HT: {comp.halfTime}m
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Labels */}
      <div className="flex justify-between mt-2 px-1">
         <span className="text-[8px] font-black text-ocean-600 uppercase tracking-widest">Fast Tissues (5m)</span>
         <span className="text-[8px] font-black text-ocean-600 uppercase tracking-widest">Slow Tissues (635m)</span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-ocean-950/50 border border-ocean-800">
           <p className="text-[9px] font-black text-brand-teal uppercase tracking-widest mb-1">Lead Tissue</p>
           <p className="text-xl font-black text-white">Comp 08</p>
           <p className="text-xs text-ocean-500 font-bold tracking-tight mt-0.5">77.0m Half-Time</p>
        </div>
        <div className="p-4 rounded-xl bg-ocean-950/50 border border-ocean-800">
           <p className="text-[9px] font-black text-brand-cyan uppercase tracking-widest mb-1">Off-Gassing</p>
           <div className="flex items-center gap-2">
             <p className="text-xl font-black text-white">-4.2%</p>
             <Activity className="w-4 h-4 text-brand-cyan" />
           </div>
           <p className="text-xs text-ocean-500 font-bold tracking-tight mt-0.5">per hour</p>
        </div>
      </div>
    </div>
  );
}
