"use client";

import { motion } from "framer-motion";
import { Globe, BookOpen, Users, Compass, Activity, ShieldCheck, Zap } from "lucide-react";

export function FeatureBento() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="w-full bg-deep-sea py-32 px-4 sm:px-8 relative overflow-hidden">
      {/* Background HUD Accents */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-4">
             <Zap className="w-4 h-4 text-brand-teal" />
             <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em]">Integrated Mission Modules</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 uppercase">
            Platform <span className="text-brand-cyan">Capabilities</span>
          </h2>
          <p className="text-ocean-400 max-w-2xl text-sm font-medium leading-relaxed uppercase tracking-wide">
            State-of-the-art technical infrastructure for global divers. Leave legacy logging behind and enter the tactical age of immersion.
          </p>
        </div>

        <motion.div 
          variants={container} 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[280px]"
        >
          
          {/* Module 01: Global Explorer */}
          <motion.div variants={item} className="glass-card md:col-span-8 md:row-span-2 rounded-2xl p-10 relative overflow-hidden group border-brand-cyan/10 hover:border-brand-cyan/30 transition-all scan-line">
            <div className="absolute top-6 right-6 text-[10px] font-black text-ocean-700 uppercase tracking-widest">Module: EXPL-01</div>
            <Globe className="w-16 h-16 text-brand-cyan mb-8 text-glow-cyan" />
            <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Global <span className="text-brand-cyan">Explorer</span></h3>
            <p className="text-ocean-300 text-lg leading-relaxed max-w-xl font-medium">
              Access 137+ high-fidelity, world-class mission sites. Seamlessly pan across our deep-sea tactical map with real-time satellite telemetry and site intelligence.
            </p>
            <div className="absolute bottom-[-10%] right-[-5%] opacity-10 group-hover:scale-105 transition-transform duration-700 pointer-events-none">
              <Compass className="w-[500px] h-[500px] text-brand-cyan" />
            </div>
          </motion.div>

          {/* Module 02: Mathematical Logs */}
          <motion.div variants={item} className="glass-card md:col-span-4 rounded-2xl p-8 relative overflow-hidden group border-brand-teal/10 hover:border-brand-teal/30 transition-all">
            <div className="absolute top-6 right-6 text-[10px] font-black text-ocean-700 uppercase tracking-widest">Module: LOGS-02</div>
            <BookOpen className="w-8 h-8 text-brand-teal mb-4 text-glow-teal" />
            <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">Data Logging</h3>
            <p className="text-ocean-400 text-xs leading-relaxed font-medium mb-6">
              Encrypted tracking of SAC rates, max depth graphing, and bottom temps perfectly synchronized to your profile.
            </p>
            <div className="h-1 w-full bg-ocean-900 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: "85%" }}
                 transition={{ duration: 1.5 }}
                 className="h-full bg-brand-teal" 
               />
            </div>
          </motion.div>

          {/* Module 03: Fleet Sync */}
          <motion.div variants={item} className="glass-card md:col-span-4 rounded-2xl p-8 flex flex-col justify-between group border-white/5 hover:border-brand-cyan/30 transition-all">
            <div className="flex justify-between items-start">
               <Users className="w-8 h-8 text-white text-glow-cyan" />
               <div className="text-[8px] font-black text-ocean-700 uppercase tracking-widest">ID: BUD-03</div>
            </div>
            <div>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Fleet Sync</h3>
              <p className="text-ocean-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">Instantly connect with the global fleet of certified divers.</p>
            </div>
          </motion.div>

          {/* Module 04: Safety Protocol */}
          <motion.div variants={item} className="glass-card md:col-span-12 lg:col-span-12 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-10 border-brand-cyan/10 hover:border-brand-cyan/30 transition-all overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="w-10 h-10 text-brand-cyan text-glow-cyan" />
                 <span className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.3em]">Module: SAFE-04</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">Professional Tactical Utilities</h3>
              <p className="text-ocean-400 text-sm font-medium leading-relaxed max-w-3xl">
                Calculators for surface intervals, gas mixtures, and high-fidelity emergency medical cards that are instantly accessible anytime, anywhere.
              </p>
            </div>
            <div className="relative z-10 w-full md:w-auto shrink-0">
               <div className="px-8 py-4 rounded bg-brand-cyan text-deep-sea font-black text-[10px] uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(0,229,255,0.4)] group-hover:scale-105 transition-transform">
                 Emergency Card Active
               </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
