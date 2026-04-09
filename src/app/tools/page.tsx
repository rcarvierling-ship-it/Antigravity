"use client";

import { Activity, Clock3, ThermometerSun, AlertCircle, Phone } from "lucide-react";

export default function ToolsPage() {
  return (
    <main className="w-full min-h-screen px-4 md:px-8 py-8 pt-24 md:pt-12 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Dive Tools</h1>
        <p className="text-ocean-300 text-sm mb-8">Calculators, timers, and safety resources.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Surface Interval Timer */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden group border border-ocean-700/50 hover:border-brand-cyan/30 transition-all cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-brand-cyan/20 transition-all" />
            <Clock3 className="w-8 h-8 text-brand-cyan mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Surface Interval Timer</h2>
            <p className="text-ocean-300 text-sm mb-4">Track your nitrogen off-gassing time between dives automatically.</p>
            <div className="text-3xl font-black text-white font-mono tracking-widest text-glow-cyan">01:45:00</div>
          </div>

          {/* SAC / RMV Calculator */}
          <div className="glass-card p-6 md:p-8 rounded-3xl group border border-ocean-700/50 hover:border-brand-teal/30 transition-all cursor-pointer">
            <Activity className="w-8 h-8 text-brand-teal mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">SAC Rate Calculator</h2>
            <p className="text-ocean-300 text-sm">Calculate your Surface Air Consumption rate to plan future dives.</p>
          </div>

          {/* Partial Pressure / MOD */}
          <div className="glass-card p-6 md:p-8 rounded-3xl group border border-ocean-700/50 hover:border-brand-cyan/30 transition-all cursor-pointer">
            <ThermometerSun className="w-8 h-8 text-brand-cyan mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Nitrox MOD Calculator</h2>
            <p className="text-ocean-300 text-sm">Determine your Maximum Operating Depth and Contingency Depth for Enriched Air.</p>
          </div>

          {/* Emergency Card */}
          <div className="glass-card bg-red-950/20 border border-red-900/50 p-6 md:p-8 rounded-3xl group hover:border-red-500/50 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <AlertCircle className="w-8 h-8 text-red-500 box-glow-cyan drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              <button className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">View Card</button>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Emergency Info Card</h2>
            <p className="text-ocean-300 text-sm mb-4">Crucial medical information, DAN membership, and emergency contacts accessible offline.</p>
            
            <button className="w-full py-3 rounded-xl bg-red-500/20 text-red-400 font-bold hover:bg-red-500/30 transition-colors flex justify-center items-center gap-2">
              <Phone className="w-4 h-4" /> Dial Local Emergency
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
