"use client";

import { useEffect, useState } from "react";
import { Thermometer, Waves, Wind, Cloud, Droplets, MapPin, Loader2 } from "lucide-react";
import { cToF, msToMph, cloudCoverToCondition } from "@/lib/conversions";

export function LiveWeatherTile() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Default to Honolulu coordinates for the demo if geo fails
    const lat = 21.3069;
    const lng = -157.8583;

    fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      .then(res => res.json())
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="w-full glass-card rounded-3xl p-6 flex items-center justify-center h-48">
      <Loader2 className="w-6 h-6 text-brand-cyan animate-spin" />
    </div>
  );

  if (!data) return null;

  return (
    <div className="w-full glass-card rounded-3xl p-6 border border-brand-cyan/20 group hover:border-brand-cyan/40 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blend-overlay bg-brand-cyan/10 flex items-center justify-center">
            <Cloud className="w-4 h-4 text-brand-cyan" />
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Oahu Coast Telemetry</h3>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-bold text-ocean-400 uppercase tracking-tight">
          <MapPin className="w-3 h-3 text-ocean-600" /> Live Nearby
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <span className="text-[9px] text-ocean-500 font-black uppercase mb-1 flex items-center gap-1">
            <Thermometer className="w-3 h-3" /> Air Temp
          </span>
          <span className="text-xl font-black text-white">{cToF(data.airTemperature)}°F</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-ocean-500 font-black uppercase mb-1 flex items-center gap-1">
            <Waves className="w-3 h-3" /> Sea Temp
          </span>
          <span className="text-xl font-black text-white text-glow-teal">{cToF(data.waterTemperature)}°F</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-ocean-500 font-black uppercase mb-1 flex items-center gap-1">
            <Wind className="w-3 h-3" /> Wind
          </span>
          <span className="text-xl font-black text-white">{msToMph(data.windSpeed)}<span className="text-xs text-ocean-500 ml-0.5">mph</span></span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-ocean-500 font-black uppercase mb-1 flex items-center gap-1">
            <Droplets className="w-3 h-3" /> Sky
          </span>
          <span className="text-sm font-black text-brand-cyan uppercase pt-1">{cloudCoverToCondition(data.cloudCover)}</span>
        </div>
      </div>
    </div>
  );
}
