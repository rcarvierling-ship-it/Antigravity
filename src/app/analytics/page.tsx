"use client";

import { motion } from "framer-motion";
import { Brain, Zap, Gauge, History, Info, AlertTriangle } from "lucide-react";
import { TissueCompartments } from "@/components/analytics/TissueCompartments";
import { GasEfficiencyMap } from "@/components/analytics/GasEfficiencyMap";
import { DepthStratification } from "@/components/analytics/DepthStratification";
import Link from "next/link";

export default function AnalyticsPage() {
  return (
    <main className="w-full min-h-screen bg-deep-sea pt-12 pb-32 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-6">
          <div>
             <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-brand-cyan" />
                <span className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.4em]">Intelligence Hub</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-white leading-none">Mission Telemetry</h1>
          </div>
          <div className="flex gap-3">
             <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border-ocean-800">
                <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                <span className="text-[10px] font-bold text-ocean-300 uppercase">System Active</span>
             </div>
          </div>
        </div>

        {/* Physiological Module */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 px-2">
              <Zap className="w-4 h-4 text-brand-teal" />
              <h2 className="text-[11px] font-black text-ocean-500 uppercase tracking-widest leading-none">Physiological Resilience</h2>
           </div>
           <TissueCompartments />
        </section>

        {/* Technical Mastery Module */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                 <Gauge className="w-4 h-4 text-brand-cyan" />
                 <h2 className="text-[11px] font-black text-ocean-500 uppercase tracking-widest leading-none">Gas Dynamics</h2>
              </div>
              <GasEfficiencyMap />
           </div>
           <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                 <History className="w-4 h-4 text-ocean-400" />
                 <h2 className="text-[11px] font-black text-ocean-500 uppercase tracking-widest leading-none">Depth Stratification</h2>
              </div>
              <DepthStratification />
           </div>
        </section>

        {/* Safety Disclaimer */}
        <div className="glass-card rounded-2xl p-6 border-red-900/40 bg-red-950/10 flex items-start gap-4">
           <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
           <div>
              <h4 className="text-xs font-black text-red-200 uppercase tracking-widest mb-1">Physiological Warning</h4>
              <p className="text-[10px] text-red-300/80 font-medium leading-relaxed uppercase">
                Satellite-derived tissue models are theoretical simulations intended for visual training and historical analysis only. Do NOT use this data for actual decompression planning or dive safety decisions. Always refer to your primary dive computer for mission-critical telemetry.
              </p>
           </div>
        </div>

        <div className="flex justify-center pt-8">
           <Link 
             href="/dashboard"
             className="text-[10px] font-black text-ocean-500 hover:text-brand-cyan uppercase tracking-[0.2em] transition-colors border-b border-ocean-900 pb-1"
           >
             Return to Fleet Command
           </Link>
        </div>

      </div>
    </main>
  );
}
