"use client";

import { motion } from "framer-motion";
import { Globe, BookOpen, Users, Compass, Activity, ShieldCheck } from "lucide-react";

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
    <section className="w-full bg-ocean-950 py-24 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Everything a Diver Needs</h2>
          <p className="text-ocean-400 max-w-2xl mx-auto text-lg">Leave the paper logbooks and outdated forums behind. Welcome to the future of dive tracking.</p>
        </div>

        <motion.div 
          variants={container} 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]"
        >
          
          {/* Large Card: Explorer */}
          <motion.div variants={item} className="glass-card md:col-span-2 md:row-span-2 rounded-3xl p-8 relative overflow-hidden group border border-ocean-800/50 hover:border-brand-cyan/40 transition-colors">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-brand-cyan/10 to-transparent pointer-events-none" />
            <Globe className="w-12 h-12 text-brand-cyan mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">Global Explorer</h3>
            <p className="text-ocean-300 text-lg leading-relaxed max-w-md">
              Access exactly 137 high-fidelity, world-class dive sites across the globe. Seamlessly pan across our deep-sea tactical map to locate the Blue Hole, Yonaguni, or Thistlegorm.
            </p>
            <div className="absolute bottom-[-10%] right-[-10%] opacity-20 group-hover:scale-110 transition-transform duration-700">
              <Compass className="w-64 h-64 text-brand-cyan" />
            </div>
          </motion.div>

          {/* Medium Card: Logs */}
          <motion.div variants={item} className="glass-card md:col-span-2 rounded-3xl p-8 relative overflow-hidden group border border-ocean-800/50 hover:border-brand-teal/40 transition-colors bg-ocean-900/40">
            <BookOpen className="w-8 h-8 text-brand-teal mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Mathematical Logbook</h3>
            <p className="text-ocean-300 text-sm md:text-base">
              Digital tracking of SAC rates, max depth graphing, dive times, and bottom temps perfectly graphed directly to your diver profile.
            </p>
          </motion.div>

          {/* Small Card: Social */}
          <motion.div variants={item} className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center group border border-ocean-800/50 hover:border-white/20 transition-colors">
            <Users className="w-8 h-8 text-white mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">Buddy Finder</h3>
            <p className="text-ocean-400 text-sm">Instantly connect with nearby certified divers.</p>
          </motion.div>

          {/* Small Card: Charts */}
          <motion.div variants={item} className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center group border border-ocean-800/50 hover:border-white/20 transition-colors">
            <Activity className="w-8 h-8 text-white mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">Advanced Stats</h3>
            <p className="text-ocean-400 text-sm">Visualize your depth history visually over time.</p>
          </motion.div>

          {/* Medium Card: Safety */}
          <motion.div variants={item} className="glass-card md:col-span-2 lg:col-span-4 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-ocean-800/50 hover:border-brand-cyan/30 transition-colors overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-900 to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <ShieldCheck className="w-10 h-10 text-brand-cyan mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Professional Utilities Built-In</h3>
              <p className="text-ocean-300">
                Calculators for surface intervals, gas mixtures, and High-Contrast Emergency Medical Cards that are instantly accessible anytime.
              </p>
            </div>
            <div className="relative z-10 w-full md:w-auto flex-shrink-0">
               <div className="px-6 py-3 rounded-xl bg-orange-600/20 border border-orange-500/50 text-orange-400 font-bold tracking-wide shadow-[0_0_20px_rgba(234,88,12,0.2)]">
                 Emergency Card Active
               </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
