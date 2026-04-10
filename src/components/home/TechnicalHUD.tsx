"use client";

import { motion } from "framer-motion";
import { Activity, Gauge, Battery, Share2, CornerRightUp } from "lucide-react";
import { NitrogenHUD } from "@/components/analytics/NitrogenHUD";

export function TechnicalHUD({ profile, gearAlert }: { profile?: any; gearAlert?: boolean }) {
  const hudData = [
    {
      id: "BT",
      label: "TOTAL IMMERSION",
      value: `${profile?.total_dives || 0 * 45}m`,
      subValue: `${profile?.total_dives || 0} Successful Missions`,
      icon: <Activity className="w-4 h-4" />,
      color: "text-brand-teal",
      progress: 65
    },
    {
      id: "GR",
      label: "GEAR HEALTH",
      value: gearAlert ? "FAIL" : "OPTIMAL",
      subValue: gearAlert ? "Maintenance Advised" : "Mission Ready",
      icon: <Battery className="w-4 h-4" />,
      color: gearAlert ? "text-red-500" : "text-brand-cyan",
      progress: gearAlert ? 20 : 100,
      alert: gearAlert
    },
    {
      id: "SAC",
      label: "EFFICIENCY: SAC",
      value: "0.62",
      subValue: "Avg cuft/min (Target: 0.55)",
      icon: <Share2 className="w-4 h-4" />,
      color: "text-brand-teal",
      progress: 88
    }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-0 mb-16 space-y-6">
      <div className="flex items-center gap-2 mb-6">
         <CornerRightUp className="w-4 h-4 text-brand-cyan" />
         <h2 className="text-[10px] font-black text-ocean-500 uppercase tracking-[0.4em]">Integrated Data HUD</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: High-Fidelity Nitrogen Visualization */}
        <div className="lg:col-span-2">
           <NitrogenHUD className="h-full" />
        </div>

        {/* Right Side: Telemetry Tiles */}
        <div className="flex flex-col gap-6">
          {hudData.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card p-6 rounded-2xl relative overflow-hidden group border border-ocean-800/50 hover:border-brand-cyan/20 transition-all flex-1 flex flex-col justify-between ${item.alert ? 'bg-red-500/5 border-red-500/20' : ''}`}
            >
              {/* HUD Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-cyan/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-brand-cyan/30 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-black/40 ${item.color} border border-white/5`}>
                    {item.icon}
                  </div>
                  <div className="text-[8px] font-black text-ocean-600 tracking-tighter uppercase whitespace-nowrap">
                    Cluster: {item.id}-00{i+1}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-ocean-400 uppercase tracking-widest">{item.label}</label>
                  <div className={`text-3xl font-black ${item.color} ${item.alert ? 'animate-flicker' : ''}`}>
                    {item.value}
                  </div>
                  <div className="text-[9px] text-ocean-500 font-medium tracking-tight">
                    {item.subValue}
                  </div>
                </div>
              </div>

              <div className="mt-6 h-0.5 w-full bg-ocean-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                  className={`h-full ${item.alert ? 'bg-red-500' : 'bg-gradient-to-r from-brand-cyan to-brand-teal'}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
