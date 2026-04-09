"use client";

import { motion } from "framer-motion";

const categories = ["All", "Reef", "Wreck", "Wall", "Animal Interaction", "Cave", "Technical"];

interface SiteFilterBarProps {
  activeCategory: string;
  onSelect: (category: string) => void;
}

export function SiteFilterBar({ activeCategory, onSelect }: SiteFilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 pt-1 scrollbar-hide px-1">
      {categories.map((cat) => (
        <motion.button
          key={cat}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeCategory === cat 
              ? "bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)]" 
              : "bg-ocean-900/50 border-ocean-700/50 text-ocean-400 hover:border-ocean-500 hover:text-white"
          }`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  );
}
