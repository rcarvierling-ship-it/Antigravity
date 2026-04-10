"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Info, MapPin, Calendar, Heart, Share2, ShieldCheck, Fish } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpeciesDossierProps {
  species: any;
  sighting?: any;
  onClose: () => void;
}

export function SpeciesDossier({ species, sighting, onClose }: SpeciesDossierProps) {
  if (!species) return null;

  const isSeen = !!sighting;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-ocean-950 border border-ocean-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Action Header (Mobile) */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-colors border border-white/10 z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Visual Asset */}
          <div className="w-full md:w-1/2 relative h-64 md:h-auto bg-ocean-900 overflow-hidden">
            {species.image_url ? (
              <img 
                src={species.image_url} 
                alt={species.name} 
                className={cn(
                  "w-full h-full object-cover transition-all duration-1000",
                  !isSeen && "grayscale blur-sm opacity-20"
                )}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-10">
                <Fish className="w-32 h-32" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-transparent to-transparent md:bg-gradient-to-r" />
            
            {!isSeen && (
              <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                <div>
                   <div className="w-16 h-16 rounded-full bg-ocean-800/50 backdrop-blur-xl border border-brand-cyan/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <ShieldCheck className="w-8 h-8 text-brand-cyan/40" />
                   </div>
                   <h4 className="text-brand-cyan font-black uppercase tracking-widest text-sm">Biometric Lock</h4>
                   <p className="text-ocean-400 text-xs mt-2 font-medium">Log an encounter to unlock full laboratory analysis and field notes.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Intel Report */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto scrollbar-hide flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-brand-teal/20 border border-brand-teal/30 text-brand-teal text-[10px] font-black uppercase tracking-widest rounded">
                  {species.category}
                </span>
                <span className="px-2 py-0.5 bg-ocean-900 border border-ocean-800 text-ocean-400 text-[10px] font-black uppercase tracking-widest rounded">
                  {species.rarity}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                {isSeen ? species.name : "Unidentified Specimen"}
              </h2>
              <p className="text-sm font-mono text-ocean-500 mt-2 italic">
                {isSeen ? species.scientific_name : "Classification Pending"}
              </p>
            </div>

            <div className="space-y-8">
              {/* Personal Encounter Data */}
              {isSeen && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-ocean-900/40 border border-ocean-800/40 p-4 rounded-2xl">
                    <p className="text-[9px] text-ocean-500 font-black uppercase tracking-widest mb-1">First Discovery</p>
                    <div className="flex items-center gap-2 text-white">
                      <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                      <span className="text-sm font-bold">{new Date(sighting.date_seen).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="bg-ocean-900/40 border border-ocean-800/40 p-4 rounded-2xl">
                    <p className="text-[9px] text-ocean-500 font-black uppercase tracking-widest mb-1">Primary Habitat</p>
                    <div className="flex items-center gap-2 text-white">
                      <MapPin className="w-3.5 h-3.5 text-brand-teal" />
                      <span className="text-sm font-bold truncate">Unknown Site</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Lab Analysis / Field Notes */}
              <div>
                <h3 className="text-[10px] font-black text-ocean-400 uppercase tracking-widest mb-4 border-b border-ocean-800 pb-2 flex items-center gap-2">
                  <Info className="w-3 h-3" /> Field Dossier
                </h3>
                <p className={cn(
                  "text-sm leading-relaxed",
                  isSeen ? "text-ocean-200" : "text-ocean-700 blur-[2px] select-none"
                )}>
                  {isSeen ? (species.description || "No field notes available for this specimen yet.") : "The specimen description is redacted until biometric verification is complete. Detailed analysis requires at least one confirmed sighting in a natural habitat."}
                </p>
              </div>

              {isSeen && species.habitat_notes && (
                <div>
                  <h3 className="text-[10px] font-black text-ocean-400 uppercase tracking-widest mb-4 border-b border-ocean-800 pb-2">Habitat Intelligence</h3>
                  <p className="text-sm text-ocean-300 leading-relaxed italic border-l-2 border-brand-teal/20 pl-4">
                    {species.habitat_notes}
                  </p>
                </div>
              )}

              {/* Status & Stats */}
              <div className="pt-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] text-ocean-600 font-black uppercase tracking-widest mb-1">Conservation_Status</span>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full animate-flicker",
                      species.conservation_status?.includes('Endangered') ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : 
                      species.conservation_status?.includes('Vulnerable') ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-brand-teal shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                    )} />
                    <span className={cn(
                      "text-xs font-black uppercase tracking-[0.2em]",
                      species.conservation_status?.includes('Endangered') ? "text-red-400" : 
                      species.conservation_status?.includes('Vulnerable') ? "text-orange-400" : "text-brand-teal"
                    )}>
                      {species.conservation_status || 'Data_Deficient'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                   <button className="p-4 bg-ocean-1000 hover:bg-red-500/10 border border-ocean-800 rounded-2xl transition-all group active:scale-95 shadow-inner">
                      <Heart className="w-5 h-5 text-ocean-700 group-hover:text-red-500 transition-colors" />
                   </button>
                   <button className="p-4 bg-brand-cyan text-deep-sea border border-brand-cyan/20 rounded-2xl transition-all group active:scale-95 shadow-lg shadow-brand-cyan/20 hover:shadow-brand-cyan/40">
                      <Share2 className="w-5 h-5" />
                   </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
