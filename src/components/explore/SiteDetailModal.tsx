"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Waves, Wind, Thermometer, ArrowRight, Gauge, Cloud, ChevronDown } from "lucide-react";
import Link from "next/link";
import { cToF, mToFt, msToMph, cloudCoverToCondition } from "@/lib/conversions";
import { createClient } from "@/lib/supabase/client";
import { ConditionsGrid } from "@/components/shared/ConditionsDisplay";

interface SiteDetailModalProps {
  site: any | null;
  onClose: () => void;
}

export function SiteDetailModal({ site, onClose }: SiteDetailModalProps) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [diveHistory, setDiveHistory] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!site) return;
    
    setLoading(true);
    setError(false);
    setDiveHistory(null);
    setWeatherData(null);
    
    // Fetch live weather data with country-aware overrides and site-type context
    fetch(`/api/weather?lat=${site.position.lat}&lng=${site.position.lng}&country=${encodeURIComponent(site.country || '')}&type=${encodeURIComponent(site.type || '')}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        setWeatherData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });

    // Fetch user's dive history at this site
    const fetchHistory = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from("dive_logs")
          .select("id, date")
          .eq("custom_site_name", site.name)
          .order("date", { ascending: false });
          
        if (data && data.length > 0) {
          setDiveHistory(data);
        }
      }
    };
    
    fetchHistory();
      
  }, [site]);

  return (
    <AnimatePresence>
      {site && (
        <>
          {/* Overlay for mobile */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] md:hidden"
          />
          
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed md:absolute bottom-0 md:bottom-auto md:top-4 right-0 md:right-4 z-[1001] w-full md:w-[420px] max-h-[90vh] md:max-h-[calc(100%-32px)] overflow-y-auto scrollbar-hide glass-card bottom-sheet md:rounded-3xl shadow-2xl flex flex-col pt-0 pb-safe"
          >
            {/* Mobile Handle */}
            <div className="w-12 h-1.5 bg-ocean-800 rounded-full mx-auto my-3 md:hidden shrink-0" />

            {/* Header Image Area */}
            <div className="relative h-44 md:h-52 bg-gradient-to-br from-ocean-800 to-ocean-950 overflow-hidden shrink-0">
              <div className="absolute inset-0 z-0">
                {(site.img || site.image_url) && (
                  <img 
                    src={site.img || site.image_url} 
                    alt={site.name} 
                    className="w-full h-full object-cover opacity-60" 
                  />
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ocean-950 to-transparent z-10" />
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-colors border border-white/10 z-20"
              >
                <X className="w-5 h-5 hidden md:block" />
                <ChevronDown className="w-5 h-5 md:hidden" />
              </button>

              <div className="absolute bottom-4 left-6 pr-6 z-20">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-2 py-1 bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    {site.type} • {site.skill || 'Intermediate'}
                  </span>
                  <span className="px-2 py-1 bg-brand-teal/20 border border-brand-teal/30 text-brand-teal text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    {site.depth}m / {Math.round(site.depth * 3.28)}ft
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md tracking-tight">{site.name}</h2>
                <p className="flex items-center gap-1 text-ocean-300 text-sm font-medium mt-1">
                  <MapPin className="w-3.5 h-3.5 text-ocean-500" /> {site.region || site.country}, {site.country}
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 pt-2 pb-32 md:pb-6 flex-1 bg-ocean-950/80">
              
              {/* User Dive History Section */}
              {diveHistory && diveHistory.length > 0 && (
                <div className="mb-6 bg-brand-cyan/10 border border-brand-cyan/20 rounded-2xl p-4 flex items-start gap-3">
                  <div className="p-2 bg-brand-cyan/20 text-brand-cyan rounded-full shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Site Visited</h4>
                    <p className="text-ocean-300 text-xs mt-1">Logged {diveHistory.length} {diveHistory.length === 1 ? 'dive' : 'dives'}. Last visit: <span className="text-ocean-100 font-semibold">{new Date(diveHistory[0].date).toLocaleDateString()}</span>.</p>
                  </div>
                </div>
              )}

              <h3 className="text-[10px] font-bold text-ocean-400 uppercase tracking-widest mb-4 border-b border-ocean-800/30 pb-2">Live Marine Conditions</h3>
              
              {loading ? (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-20 bg-ocean-800/20 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : error ? (
                <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-2xl text-red-300 text-xs mb-8 flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-red-400" /> Telemetry link offline. Check connection.
                </div>
              ) : weatherData ? (
                <div className="mb-8">
                   <ConditionsGrid data={weatherData} />
                </div>
              ) : null}

              <Link 
                href={`/logbook/new?site_name=${encodeURIComponent(site.name)}`}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-cyan to-brand-teal text-deep-sea font-black text-center flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all active:scale-95 shadow-lg mb-4"
              >
                LOG DIVE HERE <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
