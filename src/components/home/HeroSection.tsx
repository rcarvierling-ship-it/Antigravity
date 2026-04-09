"use client";

import { motion } from "framer-motion";
import { ArrowRight, Thermometer, Droplets } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cToF } from "@/lib/conversions";

export function HeroSection({ displayName, certLevel }: { displayName?: string; certLevel?: string }) {
  const [bubbles, setBubbles] = useState<{ id: number; size: number; left: number; duration: number; delay: number }[]>([]);

  // Generate random bubbles on mount to avoid hydration mismatch
  useEffect(() => {
    const newBubbles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 10 + 4,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <section className="relative w-full h-[400px] md:h-[500px] rounded-b-[40px] md:rounded-3xl overflow-hidden mb-6 mt-[-16px] md:mt-6 glass-card border-none shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Deep water gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-800 via-deep-sea to-ocean-950" />
      
      {/* Light rays from top */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-brand-cyan/20 to-transparent mix-blend-overlay opacity-60" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
      <div className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-white/10 to-transparent mix-blend-overlay rotate-12 blur-2xl transform origin-top" />
      <div className="absolute top-0 right-1/3 w-48 h-full bg-gradient-to-b from-brand-cyan/10 to-transparent mix-blend-overlay -rotate-12 blur-3xl transform origin-top" />

      {/* Animated Bubbles */}
      {bubbles.map(b => (
        <motion.div
          key={b.id}
          className="absolute bottom-0 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
          style={{ width: b.size, height: b.size, left: `${b.left}%` }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: -600, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end p-6 pb-20 md:pb-12 text-white max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-brand-teal/20 text-brand-teal text-xs px-2 py-1 rounded-full font-semibold tracking-wider uppercase border border-brand-teal/30">
              {certLevel || "Diver"} Status
            </span>
            <span className="text-sm font-medium text-ocean-200">Ready for your next adventure?</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2 drop-shadow-lg">
            Hello, {displayName || "Diver"}
          </h1>
          <p className="text-ocean-200 flex items-center gap-4 text-sm md:text-base mb-6">
            <span className="flex items-center gap-1"><Droplets className="w-4 h-4 text-brand-cyan" /> Discover the Deep</span>
            <span className="flex items-center gap-1"><Thermometer className="w-4 h-4 text-brand-cyan" /> 72°F (Air)</span>
          </p>

          <div className="flex gap-4">
            <Link 
              href="/explore" 
              className="bg-gradient-to-r from-brand-cyan to-brand-teal text-deep-sea font-bold px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all hover:scale-105"
            >
              Explore Map <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/logbook/new" 
              className="glass px-6 py-3 rounded-full font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2"
            >
              Start Log
            </Link>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
