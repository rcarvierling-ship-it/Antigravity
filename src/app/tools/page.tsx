"use client";

import { Activity, Clock3, ThermometerSun, AlertCircle, Phone, CheckCircle2, MapPin, Send, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ToolsPage() {
  const [activeChecklist, setActiveChecklist] = useState<string | null>(null);

  const checklists = {
    incident: [
      "Check Air/O2 supply for victim",
      "Verify consciousness and ABCs",
      "Contact Emergency Services / DAN",
      "Record depth and bottom time profiles",
      "Keep victim horizontal and warm",
    ],
    preDive: [
      "Verify O-rings and gas integrity",
      "Check computer battery levels",
      "Brief buddy on emergency plan",
      "Confirm local chamber location",
    ]
  };

  return (
    <main className="w-full min-h-screen px-4 md:px-8 py-8 pt-24 md:pt-12 pb-24 bg-deep-sea">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center gap-2 mb-2">
           <ShieldAlert className="w-5 h-5 text-brand-cyan" />
           <span className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.4em]">Support Systems</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-2">Dive Intelligence</h1>
        <p className="text-ocean-400 text-sm mb-12 font-medium uppercase tracking-widest">Safety, calculations, and emergency protocols.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* Surface Interval Timer */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden group border border-ocean-700/30 hover:border-brand-cyan/50 transition-all cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-brand-cyan/20 transition-all" />
            <Clock3 className="w-8 h-8 text-brand-cyan mb-4" />
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Nitrogen De-Saturation</h2>
            <p className="text-ocean-300 text-xs mb-6 font-medium leading-relaxed">Automatic surface interval tracking based on your last logged ascent.</p>
            <div className="text-4xl font-black text-white font-mono tracking-widest text-glow-cyan">01:45:00</div>
          </div>

          {/* Emergency Card - HIGHLIGHTED */}
          <div className="glass-card bg-red-950/10 border border-red-900/40 p-6 md:p-8 rounded-3xl group hover:border-red-500/60 transition-all relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/5 rounded-full blur-[40px]" />
            <div className="flex justify-between items-start mb-6">
              <AlertCircle className="w-10 h-10 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
              <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[9px] font-black text-red-400 uppercase tracking-widest">Critical Asset</div>
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Emergency Card</h2>
            <p className="text-ocean-400 text-xs mb-6 font-medium leading-relaxed">Offline access to BCD, insurance (DAN), and medical history.</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
               <button className="py-3 rounded-xl bg-red-500 text-deep-sea font-black uppercase tracking-widest text-[10px] hover:bg-red-400 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-3 h-3" /> Dial DAN
               </button>
               <button className="py-3 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-colors">
                  View Card
               </button>
            </div>
          </div>

          {/* New: Hyperbaric Locator */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-ocean-800/50 hover:border-brand-teal/50 transition-all group cursor-pointer">
             <MapPin className="w-8 h-8 text-brand-teal mb-4" />
             <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Chamber Locator</h2>
             <p className="text-ocean-400 text-xs mb-6 font-medium leading-relaxed">Scanning local infrastructure for technical support. Closest station: <span className="text-brand-teal">Jacksonville Memorial</span></p>
             <div className="h-1 bg-ocean-900 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="h-full bg-brand-teal shadow-[0_0_10px_#2dd4bf]" 
                />
             </div>
          </div>

          {/* New: SOS SOS generator */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-ocean-800/50 hover:border-brand-cyan/50 transition-all group cursor-pointer">
             <Send className="w-8 h-8 text-brand-cyan mb-4" />
             <h2 className="text-xl font-bold text-white mb-2 tracking-tight">SOS Telemetry Share</h2>
             <p className="text-ocean-400 text-xs mb-6 font-medium leading-relaxed">Instantly beam your GPS coordinates and last dive profile to emergency contacts.</p>
             <button className="w-full py-3 border border-brand-cyan/30 text-brand-cyan rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-cyan hover:text-deep-sea transition-all">
                Broadcast Location
             </button>
          </div>

        </div>

        {/* Section: Checklists */}
        <section className="space-y-6">
           <div className="flex items-center gap-2 px-2">
              <CheckCircle2 className="w-5 h-5 text-ocean-500" />
              <h2 className="text-[11px] font-black text-ocean-500 uppercase tracking-[0.3em]">Protocol Checklists</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['preDive', 'incident'].map((type) => (
                <div key={type} className={`glass-card p-6 rounded-3xl border transition-all ${activeChecklist === type ? "border-brand-cyan/50 bg-brand-cyan/5" : "border-ocean-800/50"}`}>
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white capitalize">{type === 'preDive' ? 'Pre-Mission Buffer' : 'Incident Management'}</h3>
                      <button 
                        onClick={() => setActiveChecklist(activeChecklist === type ? null : type)}
                        className="text-[10px] font-black text-brand-cyan uppercase tracking-widest underline decoration-brand-cyan/30"
                      >
                        {activeChecklist === type ? 'Hide' : 'Expand'}
                      </button>
                   </div>
                   
                   <div className={`space-y-4 ${activeChecklist === type ? "block" : "hidden"}`}>
                      {(checklists as any)[type].map((item: string, i: number) => (
                        <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-ocean-950/40 border border-ocean-800/30">
                           <div className="w-5 h-5 rounded border border-ocean-700 mt-0.5 flex-shrink-0 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 bg-brand-cyan rounded-sm opacity-0 group-hover:opacity-20 translate-y-2 opacity-0 group-hover:translate-y-0 transition-all" />
                           </div>
                           <p className="text-xs text-ocean-200 font-medium">{item}</p>
                        </div>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </section>

      </div>
    </main>
  );
}
