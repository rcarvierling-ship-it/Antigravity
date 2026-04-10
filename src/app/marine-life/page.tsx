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
    <main className="w-full min-h-screen bg-deep-sea pt-24 pb-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Fish className="w-5 h-5 text-brand-teal" />
              <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em]">Biometric Database</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-none">Species Discovery</h1>
            <p className="text-ocean-400 mt-4 max-w-lg font-medium">
              Cataloging your encounters with the abyss. You have discovered <span className="text-brand-teal font-black">{seenIds.size}</span> out of {species.length} known species.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4">
             <div className="flex bg-ocean-950/50 p-1 rounded-2xl border border-ocean-800">
                <button 
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === "all" ? "bg-ocean-800 text-white" : "text-ocean-500 hover:text-white"}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveFilter("seen")}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === "seen" ? "bg-brand-teal text-deep-sea" : "text-ocean-500 hover:text-white"}`}
                >
                  Seen
                </button>
             </div>

             <div className="flex gap-3">
                <div className="relative group flex-1 min-w-[200px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-500 group-focus-within:text-brand-cyan transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search catalog..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-ocean-950/50 border border-ocean-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan transition-all w-full"
                  />
                </div>
                <button 
                  onClick={() => setShowLogModal(true)}
                  className="p-3.5 bg-brand-teal text-deep-sea rounded-2xl hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap font-black uppercase text-[10px] tracking-widest"
                >
                  <Plus className="w-4 h-4" /> Register Discovery
                </button>
             </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSpecies.map((s, index) => {
              const isSeen = seenIds.has(s.id);
              const sighting = sightings.find(sig => sig.species_id === s.id);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  key={s.id}
                  onClick={() => setSelectedSpecimen(s)}
                  className={`group relative aspect-[3/4] rounded-3xl overflow-hidden border transition-all duration-500 cursor-pointer ${isSeen ? "border-brand-teal/30 shadow-[0_0_30px_rgba(45,212,191,0.05)]" : "border-ocean-800 grayscale sepia hover:grayscale-0 hover:sepia-0 hover:border-ocean-600"}`}
                >
                  {/* Background Image / Placeholder */}
                  <div className="absolute inset-0 bg-ocean-950">
                    {s.image_url ? (
                      <img 
                        src={s.image_url} 
                        alt={s.name} 
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!isSeen ? "opacity-30 blur-sm" : "opacity-70"}`} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10">
                        <Fish className="w-16 h-16" />
                      </div>
                    )}
                  </div>

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${isSeen ? "from-deep-sea via-deep-sea/40 to-transparent" : "from-ocean-950/90 via-ocean-950/40 to-transparent opacity-80"}`} />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="space-y-1">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSeen ? "text-brand-teal" : "text-ocean-500"}`}>
                        {s.category}
                      </span>
                      <h3 className={`text-lg font-bold leading-tight tracking-tight ${isSeen ? "text-white" : "text-ocean-600 font-mono"}`}>
                        {isSeen ? s.name : "Unidentified"}
                      </h3>
                      {isSeen && s.scientific_name && (
                        <p className="text-[10px] text-ocean-400 italic truncate">{s.scientific_name}</p>
                      )}
                    </div>

                    {isSeen ? (
                      <div className="mt-4 pt-4 border-t border-ocean-400/10 flex items-center justify-between">
                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-ocean-300">
                            <Calendar className="w-3 h-3 text-brand-teal" />
                            {new Date(sighting?.date_seen).toLocaleDateString()}
                         </div>
                         <div className="p-2 bg-white/5 rounded-full text-ocean-400">
                            <Info className="w-3 h-3" />
                         </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center gap-2">
                        <div className="px-3 py-1 bg-ocean-800/50 rounded-lg text-[9px] font-black text-ocean-400 uppercase tracking-widest border border-ocean-700/50">
                          Classified
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Locked Overlay */}
                  {!isSeen && (
                    <div className="absolute top-4 right-4 group-hover:opacity-0 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-ocean-900/80 backdrop-blur-md flex items-center justify-center border border-ocean-800">
                        <Camera className="w-3 h-3 text-ocean-600" />
                      </div>
                    </div>
                  )}
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
          <div className="py-32 text-center">
            <Fish className="w-12 h-12 text-ocean-800 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-ocean-600">No matching specimens found</h3>
            <p className="text-ocean-700 text-sm mt-2 font-medium uppercase tracking-widest">Awaiting further exploration</p>
          </div>
        )}

      </div>
    </main>
  );
}
