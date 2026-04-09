"use client";

import { motion } from "framer-motion";
import { ArrowRight, Waves } from "lucide-react";
import Link from "next/link";

export function MarketingHero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-deep-sea">
      
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ocean-900/40 via-deep-sea to-deep-sea pointer-events-none" />
      
      {/* Light Rays */}
      <div className="absolute top-[-20%] left-[20%] w-[60%] h-[150%] bg-gradient-to-b from-brand-cyan/20 to-transparent mix-blend-overlay rotate-[25deg] blur-3xl pointer-events-none" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)' }} />
      <div className="absolute top-[-10%] right-[10%] w-[40%] h-[120%] bg-gradient-to-b from-brand-teal/15 to-transparent mix-blend-overlay rotate-[-15deg] blur-3xl pointer-events-none" />

      {/* Floating Orbs representing bubbles */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[15%] w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-[20%] w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ocean-700/50 bg-ocean-900/30 backdrop-blur-xl mb-8 group cursor-pointer hover:border-brand-cyan/30 transition-colors"
        >
          <Waves className="w-4 h-4 text-brand-cyan" />
          <span className="text-sm text-ocean-200 font-medium tracking-wide">Enter the Abyss. Version 1.0 Live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-ocean-400 tracking-tight leading-[1.1] mb-6 drop-shadow-2xl"
        >
          Defy Gravity. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-teal">Dive Deeper.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-ocean-300 max-w-2xl font-light leading-relaxed mb-10"
        >
          The ultimate digital companion for scuba divers. Discover global sites, mathematically log your depth profiles, and connect with the international scuba community in unparalleled fidelity.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link 
            href="/dashboard" 
            className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-brand-cyan to-brand-teal text-deep-sea font-bold text-lg px-8 py-4 rounded-full hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <span className="z-10 flex items-center gap-2">Enter Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          <Link 
            href="/explore" 
            className="flex items-center justify-center gap-2 glass border border-ocean-700 hover:bg-ocean-800 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-1"
          >
            Explore Map
          </Link>
        </motion.div>
      </div>

      {/* Decorative Wave Bottom Edge */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-ocean-950 to-transparent z-0 pointer-events-none" />
    </section>
  );
}
