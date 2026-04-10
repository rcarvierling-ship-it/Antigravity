"use client";

import { motion } from "framer-motion";
import { ArrowRight, Radio, Shield, Globe } from "lucide-react";
import Link from "next/link";

export function MarketingHero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-deep-sea scan-line">
      {/* HUD Background Grid */}
      <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />
      
      {/* Satellite Imagery / Atmospheric Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-cyan/10 via-deep-sea to-deep-sea pointer-events-none" />
      
      {/* Edge HUD Accents */}
      <div className="absolute top-10 left-10 hidden lg:block">
        <div className="flex flex-col gap-1 border-l border-brand-cyan/30 pl-4 py-2">
           <span className="text-[8px] font-black text-brand-cyan uppercase tracking-[0.3em]">Satellite Link: Established</span>
           <span className="text-[8px] font-black text-ocean-500 uppercase tracking-[0.3em]">Orbit: 22,236 MI</span>
        </div>
      </div>
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="flex flex-col gap-1 border-r border-brand-cyan/30 pr-4 py-2 text-right">
           <span className="text-[8px] font-black text-brand-cyan uppercase tracking-[0.3em]">Identity Protocol: Abyss-1.0</span>
           <span className="text-[8px] font-black text-ocean-500 uppercase tracking-[0.3em]">Secure Node: Washington IAD</span>
        </div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex items-center gap-4 mb-12"
        >
           <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-brand-cyan" />
           <div className="px-4 py-1.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-black uppercase tracking-[0.4em] animate-flicker">
             Worldwide Deployment Active
           </div>
           <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-brand-cyan" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white tracking-tighter leading-[0.85] mb-8"
        >
          DEFY <br />
          <span className="text-glow-cyan text-brand-cyan">GRAVITY</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mb-16 text-left max-w-4xl"
        >
           <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-brand-teal">
                <Radio className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Live Intel</span>
              </div>
              <p className="text-xs text-ocean-400 font-medium leading-relaxed">Access real-time satellite telemetry, oceanic weather mapping, and marine life distribution.</p>
           </div>
           <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-brand-teal">
                <Shield className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Logs</span>
              </div>
              <p className="text-xs text-ocean-400 font-medium leading-relaxed">Mathematically encrypted dive profiling with physiological tissue saturation modeling.</p>
           </div>
           <div className="flex items-center gap-2 text-brand-teal">
               <Globe className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Global Fleet</span>
           </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
        >
          <Link 
            href="/dashboard" 
            className="group relative flex items-center justify-center gap-3 bg-brand-cyan text-deep-sea font-black text-sm uppercase tracking-[0.2em] px-12 py-5 rounded group overflow-hidden"
          >
            <span className="z-10 flex items-center gap-2">Enter Mission Command <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          </Link>
          <Link 
            href="/explore" 
            className="flex items-center justify-center gap-2 glass border border-ocean-700 hover:border-brand-teal text-white font-black text-sm uppercase tracking-[0.2em] px-12 py-5 rounded transition-all"
          >
            Tactical Map
          </Link>
        </motion.div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-deep-sea to-transparent z-0 pointer-events-none" />
    </section>
  );
}
