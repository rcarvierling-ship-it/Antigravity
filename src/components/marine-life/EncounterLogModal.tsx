"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, MapPin, Calendar, Check, Wind, Waves, Fish, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface EncounterLogModalProps {
  speciesList: any[];
  sitesList: any[];
  onClose: (newSighting?: any) => void;
}

export function EncounterLogModal({ speciesList, sitesList, onClose }: EncounterLogModalProps) {
  const [step, setStep] = useState(1);
  const [selectedSpecies, setSelectedSpecies] = useState<any>(null);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [speciesSearch, setSpeciesSearch] = useState("");
  const [siteSearch, setSiteSearch] = useState("");

  const filteredSpecies = speciesList.filter(s => 
    s.name.toLowerCase().includes(speciesSearch.toLowerCase()) ||
    s.category.toLowerCase().includes(speciesSearch.toLowerCase())
  );

  const filteredSites = sitesList.filter(s => 
    s.name.toLowerCase().includes(siteSearch.toLowerCase())
  );

  const handleLog = async () => {
    if (!selectedSpecies || !selectedSite) return;
    
    setIsSubmitting(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("user_marine_life_sightings")
      .insert({
        user_id: user.id,
        species_id: selectedSpecies.id,
        dive_site_id: selectedSite.id,
        date_seen: date,
        public_visibility: true
      })
      .select()
      .single();

    if (!error) {
      onClose(data);
    } else {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose()}
          className="absolute inset-0 bg-deep-sea/90 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-ocean-950 border border-ocean-800 rounded-[2rem] shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-white">Log Encounter</h2>
                <p className="text-[10px] text-ocean-500 font-bold uppercase tracking-widest mt-1">Biometric Field Registry</p>
              </div>
              <button 
                onClick={() => onClose()}
                className="p-2 hover:bg-ocean-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-ocean-400" />
              </button>
            </div>

            {/* Stepper Header */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? "bg-brand-teal" : "bg-ocean-900"}`} />
              ))}
            </div>

            {/* Step 1: Species Selection */}
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-500" />
                  <input 
                    type="text" 
                    placeholder="Search species..." 
                    value={speciesSearch}
                    onChange={(e) => setSpeciesSearch(e.target.value)}
                    className="w-full bg-ocean-900/50 border border-ocean-800 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto scrollbar-hide space-y-2">
                  {filteredSpecies.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => {
                        setSelectedSpecies(s);
                        setStep(2);
                      }}
                      className={cn(
                        "w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all",
                        selectedSpecies?.id === s.id ? "bg-brand-teal/10 border-brand-teal text-white" : "bg-ocean-900/30 border-ocean-800/50 text-ocean-400 hover:border-ocean-700"
                      )}
                    >
                      <div className="w-10 h-10 rounded-xl bg-ocean-900 flex items-center justify-center overflow-hidden shrink-0">
                         {s.image_url ? <img src={s.image_url} className="w-full h-full object-cover" /> : <Fish className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight">{s.name}</p>
                        <p className="text-[9px] uppercase tracking-widest font-black opacity-60">{s.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Location & Date */}
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-6"
              >
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-ocean-400 uppercase tracking-widest px-1">Encounter Context</p>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-500" />
                    <input 
                      type="text" 
                      placeholder="Search mission site..." 
                      value={siteSearch}
                      onChange={(e) => setSiteSearch(e.target.value)}
                      className="w-full bg-ocean-900/50 border border-ocean-800 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-brand-teal"
                    />
                  </div>
                  <div className="max-h-[200px] overflow-y-auto scrollbar-hide space-y-2">
                    {filteredSites.map(site => (
                      <button 
                        key={site.id}
                        onClick={() => setSelectedSite(site)}
                        className={cn(
                          "w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all",
                          selectedSite?.id === site.id ? "bg-brand-cyan/10 border-brand-cyan text-white" : "bg-ocean-900/30 border-ocean-800/50 text-ocean-400 hover:border-ocean-700"
                        )}
                      >
                        <span className="text-sm font-bold">{site.name}</span>
                        {selectedSite?.id === site.id && <Check className="w-4 h-4 text-brand-cyan" />}
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-ocean-400 uppercase tracking-widest px-1">Mission Clock</p>
                     <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-500" />
                        <input 
                          type="date" 
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-ocean-900/50 border border-ocean-800 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-brand-teal"
                        />
                     </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-2xl bg-ocean-900 text-ocean-400 font-black uppercase text-[10px] tracking-widest hover:bg-ocean-800 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    disabled={!selectedSite}
                    onClick={() => setStep(3)}
                    className="flex-[2] py-4 rounded-2xl bg-brand-teal text-deep-sea font-black uppercase text-[10px] tracking-widest hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all disabled:opacity-50"
                  >
                    Final Review
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center text-center gap-6"
              >
                <div className="w-24 h-24 rounded-full bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center relative">
                   <Fish className="w-12 h-12 text-brand-teal" />
                   <div className="absolute inset-0 rounded-full border border-brand-teal animate-ping opacity-20" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-white">{selectedSpecies?.name}</h3>
                   <p className="text-ocean-400 text-sm font-medium mt-1">Confirmed at {selectedSite?.name}</p>
                </div>
                <div className="w-full p-4 bg-ocean-900/50 rounded-3xl border border-ocean-800 flex justify-center gap-8">
                   <div className="text-center">
                      <p className="text-[8px] text-ocean-600 font-black uppercase">Specimen</p>
                      <p className="text-xs font-bold text-white uppercase">{selectedSpecies?.category}</p>
                   </div>
                   <div className="border-r border-ocean-800" />
                   <div className="text-center">
                      <p className="text-[8px] text-ocean-600 font-black uppercase">Date</p>
                      <p className="text-xs font-bold text-white uppercase">{new Date(date).toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-2xl bg-ocean-900 text-ocean-400 font-black uppercase text-[10px] tracking-widest hover:bg-ocean-800 transition-all"
                  >
                    Edit
                  </button>
                  <button 
                    disabled={isSubmitting}
                    onClick={handleLog}
                    className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-brand-teal to-brand-cyan text-deep-sea font-black uppercase text-[10px] tracking-widest hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Syncing..." : "TRANSMIT LOG"}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
