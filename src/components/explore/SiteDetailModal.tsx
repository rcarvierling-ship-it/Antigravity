"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Waves, Wind, Thermometer, ArrowRight, Gauge, Cloud, Eye } from "lucide-react";
import Link from "next/link";
import { cToF, mToFt, msToMph, cloudCoverToCondition } from "@/lib/conversions";

import { createClient } from "@/lib/supabase/client";

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
    
    // Fetch live StormGlass weather data
    fetch(`/api/weather?lat=${site.position.lat}&lng=${site.position.lng}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        setWeatherData(data.data);
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
          .from("logs")
          .select("id, date, rating")
          .eq("site_id", site.key)
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
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute top-4 right-4 z-[1000] w-[360px] md:w-[420px] max-h-[calc(100%-32px)] overflow-y-auto scrollbar-hide glass-card rounded-3xl shadow-2xl border border-ocean-800/80 flex flex-col"
        >
          {/* Header Image Area */}
          <div className="relative h-40 bg-gradient-to-br from-ocean-800 to-ocean-950 overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-brand-cyan/10 mix-blend-overlay" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ocean-950 to-transparent" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-6 pr-6">
              <div className="flex gap-2 mb-2">
                <span className="px-2 py-1 bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan text-[10px] font-bold uppercase tracking-wider rounded-lg">
                  {site.type} • {site.skill || 'Intermediate'}
                </span>
                <span className="px-2 py-1 bg-brand-teal/20 border border-brand-teal/30 text-brand-teal text-[10px] font-bold uppercase tracking-wider rounded-lg">
                  {mToFt(site.depth)} ft
                </span>
              </div>
              <h2 className="text-2xl font-black text-white leading-tight drop-shadow-md">{site.name}</h2>
              <p className="flex items-center gap-1 text-ocean-300 text-sm font-medium mt-1">
                <MapPin className="w-3.5 h-3.5" /> {site.region}, {site.country}
              </p>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 flex-1 bg-ocean-950/80">
            
            {/* User Dive History Section */}
            {diveHistory && diveHistory.length > 0 && (
              <div className="mb-6 bg-brand-cyan/10 border border-brand-cyan/20 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2 bg-brand-cyan/20 text-brand-cyan rounded-full shrink-0 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">You've Dove Here Before!</h4>
                  <p className="text-ocean-300 text-xs mt-1">Logged {diveHistory.length} {diveHistory.length === 1 ? 'dive' : 'dives'}, last visited on <span className="text-ocean-100 font-semibold">{new Date(diveHistory[0].date).toLocaleDateString()}</span>.</p>
                </div>
              </div>
            )}

            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 border-b border-ocean-800/50 pb-2">Live Conditions (Imperial)</h3>
            
            {loading ? (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-20 bg-ocean-800/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-2xl text-red-200 text-sm mb-8">
                Unable to reach satellite telemetry for current conditions.
              </div>
            ) : weatherData ? (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {/* Air Temp */}
                <div className="bg-ocean-900/50 border border-ocean-800 rounded-2xl p-4 flex gap-3 items-center group hover:border-yellow-500/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-ocean-400 uppercase tracking-widest font-bold">Air Temp</p>
                    <p className="text-lg font-black text-white">{cToF(weatherData.airTemperature)}<span className="text-sm text-ocean-500 font-medium tracking-normal">°F</span></p>
                  </div>
                </div>

                {/* Water Temp */}
                <div className="bg-ocean-900/50 border border-ocean-800 rounded-2xl p-4 flex gap-3 items-center group hover:border-orange-500/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-ocean-400 uppercase tracking-widest font-bold">Sea Temp</p>
                    <p className="text-lg font-black text-white">{cToF(weatherData.waterTemperature)}<span className="text-sm text-ocean-500 font-medium tracking-normal">°F</span></p>
                  </div>
                </div>

                {/* Sky Condition */}
                <div className="bg-ocean-900/50 border border-ocean-800 rounded-2xl p-4 flex gap-3 items-center group hover:border-blue-500/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-ocean-400 uppercase tracking-widest font-bold">Sky</p>
                    <p className="text-xs font-black text-white uppercase tracking-tight">{cloudCoverToCondition(weatherData.cloudCover)}</p>
                  </div>
                </div>

                {/* Wave Height */}
                <div className="bg-ocean-900/50 border border-ocean-800 rounded-2xl p-4 flex gap-3 items-center group hover:border-brand-cyan/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-ocean-400 uppercase tracking-widest font-bold">Waves</p>
                    <p className="text-lg font-black text-white">{mToFt(weatherData.waveHeight).slice(0, 3)} <span className="text-sm text-ocean-500 font-medium tracking-normal">ft</span></p>
                  </div>
                </div>

                {/* Wind Speed */}
                <div className="bg-ocean-900/50 border border-ocean-800 rounded-2xl p-4 flex gap-3 items-center group hover:border-purple-500/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-ocean-400 uppercase tracking-widest font-bold">Wind</p>
                    <p className="text-lg font-black text-white">{msToMph(weatherData.windSpeed)} <span className="text-sm text-ocean-500 font-medium tracking-normal">mph</span></p>
                  </div>
                </div>

                {/* Current Speed */}
                <div className="bg-ocean-900/50 border border-ocean-800 rounded-2xl p-4 flex gap-3 items-center group hover:border-brand-teal/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-ocean-400 uppercase tracking-widest font-bold">Current</p>
                    <p className="text-lg font-black text-white">{msToMph(weatherData.currentSpeed)} <span className="text-sm text-ocean-500 font-medium tracking-normal">mph</span></p>
                  </div>
                </div>
              </div>
            ) : null}

            <Link 
              href={`/logbook/new?site_id=${site.key}`}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-cyan to-brand-teal text-deep-sea font-bold text-center flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all hover:-translate-y-0.5"
            >
              Log Dive Here <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
