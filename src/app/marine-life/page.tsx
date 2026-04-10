"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Fish, MapPin, Calendar, Info, Search, Filter, Camera, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SpeciesDossier } from "@/components/marine-life/SpeciesDossier";
import { EncounterLogModal } from "@/components/marine-life/EncounterLogModal";

export default function MarineLifeTracker() {
  const supabase = createClient();
  const [species, setSpecies] = useState<any[]>([]);
  const [sightings, setSightings] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedSpecimen, setSelectedSpecimen] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [speciesRes, sightingsRes, sitesRes] = await Promise.all([
        supabase.from("marine_life_species").select("*"),
        supabase.from("user_marine_life_sightings").select("*").eq("user_id", user.id),
        supabase.from("dive_sites").select("id, name")
      ]);

      if (speciesRes.data) setSpecies(speciesRes.data);
      if (sightingsRes.data) setSightings(sightingsRes.data);
      if (sitesRes.data) setSites(sitesRes.data);
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  const seenIds = new Set(sightings.map(s => s.species_id));
  
  const filteredSpecies = species.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || 
                         (activeFilter === "seen" && seenIds.has(s.id)) ||
                         (activeFilter === "unseen" && !seenIds.has(s.id));
    return matchesSearch && matchesFilter;
  });

  const handleEncounterSaved = (newSighting?: any) => {
    setShowLogModal(false);
    if (newSighting) {
      setSightings(prev => [...prev, newSighting]);
    }
  };

  return (
    <main className="w-full min-h-screen bg-deep-sea pt-24 pb-32 px-4 md:px-8 relative overflow-hidden">
      {/* HUD Background Grid */}
      <div className="absolute inset-0 hud-grid opacity-10 pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 scan-line">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-brand-teal" />
              <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.5em]">Biometric Database // Link_0x44</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase">Species <span className="text-brand-teal">Discovery</span></h1>
            <p className="text-ocean-500 mt-6 max-w-xl font-black uppercase text-[10px] tracking-widest leading-relaxed">
              Cataloging encounters within the abyss. Telemetry status: <span className="text-brand-teal">{seenIds.size}</span> species verified / {species.length} known specimens.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
             <div className="flex bg-ocean-1000 p-1.5 rounded-lg border border-ocean-900 shadow-inner">
                <button 
                  onClick={() => setActiveFilter("all")}
                  className={`px-6 py-2.5 rounded text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeFilter === "all" ? "bg-ocean-800 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "text-ocean-700 hover:text-white"}`}
                >
                  All_Data
                </button>
                <button 
                  onClick={() => setActiveFilter("seen")}
                  className={`px-6 py-2.5 rounded text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeFilter === "seen" ? "bg-brand-teal/20 text-brand-teal border border-brand-teal/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]" : "text-ocean-700 hover:text-white"}`}
                >
                  Verified
                </button>
             </div>

             <div className="flex gap-4">
                <div className="relative group flex-1 min-w-[240px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-700 group-focus-within:text-brand-cyan transition-colors" />
                  <input 
                    type="text" 
                    placeholder="QUERY BIOMETRIC DATABASE..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-ocean-1000 border border-ocean-900 rounded-lg pl-12 pr-4 py-4 text-[10px] font-black text-white placeholder-ocean-800 focus:outline-none focus:border-brand-cyan/50 transition-all w-full uppercase tracking-widest"
                  />
                </div>
                <button 
                  onClick={() => setShowLogModal(true)}
                  className="px-8 bg-brand-teal text-deep-sea rounded-lg hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all active:scale-95 flex items-center gap-3 whitespace-nowrap font-black uppercase text-[10px] tracking-[0.2em]"
                >
                  <Plus className="w-5 h-5" /> NEW_DISCOVERY
                </button>
             </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredSpecies.map((s, index) => {
              const isSeen = seenIds.has(s.id);
              const sighting = sightings.find(sig => sig.species_id === s.id);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.03 }}
                  key={s.id}
                  onClick={() => setSelectedSpecimen(s)}
                  className={`group relative aspect-[4/5] rounded-none overflow-hidden border transition-all duration-700 cursor-pointer ${isSeen ? "border-brand-teal/20 bg-ocean-1000 shadow-[0_0_40px_rgba(45,212,191,0.03)]" : "border-white/5 grayscale saturate-50 brightness-50 hover:grayscale-0 hover:saturate-100 hover:brightness-100 hover:border-ocean-700"}`}
                >
                  {/* Background Image / Placeholder */}
                  <div className="absolute inset-0 bg-ocean-1000">
                    {s.image_url ? (
                      <img 
                        src={s.image_url} 
                        alt={s.name} 
                        className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${!isSeen ? "opacity-20 blur-sm" : "opacity-60"}`} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-5">
                        <Fish className="w-20 h-20" />
                      </div>
                    )}
                  </div>

                  {/* HUD Overlays */}
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-deep-sea via-deep-sea/80 to-transparent pointer-events-none" />
                  
                  {/* Scanning Line Effect */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand-cyan/20 blur-[2px] animate-scan pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Content */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <div className="space-y-1 relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                         <div className={`w-1 h-1 rounded-full ${isSeen ? "bg-brand-teal" : "bg-ocean-800"}`} />
                         <span className={`text-[8px] font-black uppercase tracking-[0.4em] ${isSeen ? "text-brand-teal" : "text-ocean-600"}`}>
                           {isSeen ? s.category : "Classified_Specimen"}
                         </span>
                      </div>
                      <h3 className={`text-xl font-black leading-none tracking-tighter uppercase mb-0.5 ${isSeen ? "text-white text-glow-cyan" : "text-ocean-800"}`}>
                        {isSeen ? s.name : "X_IDENTIFIED"}
                      </h3>
                      {isSeen && s.scientific_name && (
                        <p className="text-[8px] text-ocean-500 font-black tracking-widest uppercase italic opacity-60 truncate">{s.scientific_name}</p>
                      )}
                    </div>

                    {isSeen ? (
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                         <div className="flex items-center gap-2 text-[8px] font-black text-ocean-400 uppercase tracking-widest">
                            <Calendar className="w-3 h-3 text-brand-teal opacity-50" />
                            {new Date(sighting?.date_seen).toLocaleDateString()}
                         </div>
                         <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5 text-ocean-600 border border-white/5 group-hover:text-brand-teal group-hover:border-brand-teal/30 transition-all">
                            <Info className="w-3 h-3" />
                         </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center gap-2 relative z-10">
                        <div className="px-2 py-1 bg-ocean-950/80 rounded border border-ocean-800 text-[6px] font-black text-ocean-700 uppercase tracking-[0.5em]">
                          Restricted_Data
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showLogModal && (
            <EncounterLogModal 
              speciesList={species} 
              sitesList={sites} 
              onClose={handleEncounterSaved} 
            />
          )}

          {selectedSpecimen && (
            <SpeciesDossier 
              species={selectedSpecimen} 
              sighting={sightings.find(s => s.species_id === selectedSpecimen.id)}
              onClose={() => setSelectedSpecimen(null)}
            />
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredSpecies.length === 0 && !loading && (
          <div className="py-32 text-center opacity-20">
            <Activity className="w-12 h-12 text-ocean-700 mx-auto mb-6 animate-pulse" />
            <h3 className="text-[10px] font-black text-ocean-500 uppercase tracking-[0.5em]">Query_Failed: No_Specimens_Matched</h3>
          </div>
        )}

      </div>
    </main>
  );
}
