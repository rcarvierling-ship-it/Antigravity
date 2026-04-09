"use client";

import { motion } from "framer-motion";
import { Map, List } from "lucide-react";

interface MapListToggleProps {
  view: "map" | "list";
  onToggle: (view: "map" | "list") => void;
}

export function MapListToggle({ view, onToggle }: MapListToggleProps) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[1001] md:hidden">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggle(view === "map" ? "list" : "map")}
        className="flex items-center gap-2 bg-ocean-800/100 border border-brand-cyan/40 text-white px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl font-bold text-sm tracking-wide"
      >
        {view === "map" ? (
          <>
            <List className="w-4 h-4 text-brand-cyan" /> View List
          </>
        ) : (
          <>
            <Map className="w-4 h-4 text-brand-teal" /> View Map
          </>
        )}
      </motion.button>
    </div>
  );
}
