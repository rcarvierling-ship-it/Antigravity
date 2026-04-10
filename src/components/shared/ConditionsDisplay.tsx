"use client";

import { Confidence, ConditionMetric, SiteCategory } from "@/types/conditions";
import { ShieldCheck, ShieldAlert, Shield, Info, Waves, Thermometer, Wind, Gauge, Cloud, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MetricProps {
  label: string;
  metric: ConditionMetric;
  icon?: React.ReactNode;
  className?: string;
  hideMeta?: boolean;
}

export function ConditionsMetric({ label, metric, icon, className, hideMeta = false }: MetricProps) {
  const isUnavailable = metric.value === "Unavailable" || metric.value === null;

  return (
    <div className={cn("bg-ocean-900/40 border border-ocean-800/50 rounded-2xl p-4 flex flex-col gap-2 hover:border-white/10 transition-colors group", className)}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
           {icon && <div className="text-ocean-400 group-hover:text-brand-cyan transition-colors">{icon}</div>}
           <p className="text-[9px] text-ocean-400 uppercase tracking-widest font-black">{label}</p>
        </div>
        <ConfidenceBadge confidence={metric.confidence} />
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className={cn("text-xl font-black transition-colors", isUnavailable ? "text-ocean-700" : "text-white group-hover:text-brand-cyan")}>
          {isUnavailable ? "---" : metric.value}
        </span>
        {!isUnavailable && <span className="text-[10px] font-bold text-ocean-500 uppercase">{metric.unit}</span>}
      </div>

      {!hideMeta && !isUnavailable && (
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-ocean-800/20">
          <div className="flex items-center gap-1.5 font-bold">
            <span className={cn(
              "px-1 py-0.5 rounded-[3px] text-[7px] uppercase tracking-tighter leading-none",
              metric.isObserved ? "bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20" : "bg-ocean-900 text-ocean-500 border border-ocean-800"
            )}>
              {metric.isObserved ? "Observed" : "Model"}
            </span>
            {metric.distanceKm && metric.distanceKm > 0 && (
              <span className="text-[7px] text-ocean-500 uppercase tracking-tighter">{Math.round(metric.distanceKm)}km</span>
            )}
          </div>
          {metric.interpretationLabel && (
            <span className="text-[7px] text-ocean-700 font-black uppercase italic tracking-tighter">{metric.interpretationLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const styles = {
    High: "bg-green-500/10 text-green-500 border-green-500/20",
    Medium: "bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20",
    Low: "bg-orange-500/10 text-orange-500 border-orange-500/20"
  };

  const Icons = {
    High: ShieldCheck,
    Medium: Shield,
    Low: ShieldAlert
  };

  const Icon = Icons[confidence];

  return (
    <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-tighter", styles[confidence])}>
      <Icon className="w-2 h-2" />
      {confidence}
    </div>
  );
}

export function ConditionsGrid({ data }: { data: any }) {
  const { marine, weather, meta } = data;
  const isProtected = ['bridge', 'shore', 'inlet', 'muck'].includes(meta.siteCategory);

  return (
    <div className="flex flex-col gap-6">
      {/* Interpretation Header */}
      <div className="flex items-center justify-between p-3 bg-ocean-950/40 border border-ocean-800/30 rounded-2xl">
         <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", meta.confidenceSummary === 'High' ? 'bg-green-500' : 'bg-brand-cyan')} />
            <p className="text-[10px] text-ocean-300 font-bold uppercase tracking-widest">
               Primary Interpretation: <span className="text-white">{meta.interpretationLabel}</span>
            </p>
         </div>
         <div className="text-[9px] text-ocean-500 font-black uppercase">
            Unit: Metric
         </div>
      </div>

      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-2 gap-3">
        {isProtected ? (
          <>
            {/* Protected Sites: Tides and Temps first */}
            <ConditionsMetric label="Tide Level" metric={marine.tide} icon={<Gauge className="w-4 h-4" />} className="border-brand-teal/20" />
            <ConditionsMetric label="Sea Temp" metric={marine.seaSurfaceTemp} icon={<Thermometer className="w-4 h-4" />} />
            <ConditionsMetric label="Wind Speed" metric={weather.windSpeed} icon={<Wind className="w-4 h-4" />} />
            <ConditionsMetric label="Air Temp" metric={weather.airTemp} icon={<Thermometer className="w-4 h-4" />} />
            <ConditionsMetric label="Wave Height (Offshore)" metric={marine.waveHeight} icon={<Waves className="w-4 h-4" />} className="opacity-60" />
            <ConditionsMetric label="Cloud Cover" metric={weather.cloudCover} icon={<Cloud className="w-4 h-4" />} />
          </>
        ) : (
          <>
            {/* Offshore Sites: Waves and Wind first */}
            <ConditionsMetric label="Wave Height" metric={marine.waveHeight} icon={<Waves className="w-4 h-4" />} className="border-brand-cyan/20" />
            <ConditionsMetric label="Wave Period" metric={marine.wavePeriod} icon={<Clock className="w-4 h-4" />} />
            <ConditionsMetric label="Wind Speed" metric={weather.windSpeed} icon={<Wind className="w-4 h-4" />} />
            <ConditionsMetric label="Sea Temp" metric={marine.seaSurfaceTemp} icon={<Thermometer className="w-4 h-4" />} />
            <ConditionsMetric label="Current Velocity" metric={marine.currentSpeed} icon={<Waves className="w-4 h-4" />} />
            <ConditionsMetric label="Tide Level" metric={marine.tide} icon={<Gauge className="w-4 h-4" />} className="opacity-60" />
          </>
        )}
      </div>

      {/* Site-Specific Warnings / Advice */}
      {isProtected && (
        <div className="p-4 bg-brand-teal/5 border border-brand-teal/20 rounded-2xl flex items-start gap-3">
          <Info className="w-4 h-4 text-brand-teal mt-0.5" />
          <div className="flex flex-col gap-1">
             <p className="text-sm text-white font-bold tracking-tight leading-none italic">Protected Environment Telemetry</p>
             <p className="text-[11px] text-ocean-400 font-medium leading-relaxed">
                This site is tide-sensitive. Best conditions are typically around slack/high tide. 
                Wave height reflects offshore exposed water and may not represent the protected area.
             </p>
          </div>
        </div>
      )}

      {!isProtected && meta.confidenceSummary === 'Medium' && (
        <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-orange-500 mt-0.5" />
          <div className="flex flex-col gap-1">
             <p className="text-sm text-orange-200 font-bold tracking-tight leading-none italic">Model-Based Dashboard</p>
             <p className="text-[11px] text-ocean-400 font-medium leading-relaxed">
                Telemetry is currently based on regional model data. Remote site station mismatch may occur. 
                Verify conditions on-site before deployment.
             </p>
          </div>
        </div>
      )}

      <ConditionsFooter meta={meta} />
    </div>
  );
}

export function ConditionsFooter({ meta }: { meta: any }) {
  return (
    <div className="pt-4 border-t border-ocean-800/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={cn(
          "px-2 py-1 rounded bg-ocean-900 border border-ocean-800 text-[10px] font-black uppercase",
          meta.confidenceSummary === "High" ? "text-green-500" : "text-brand-cyan"
        )}>
          {meta.primarySource}
        </div>
        <p className="text-[10px] text-ocean-500 font-semibold italic">{meta.note}</p>
      </div>
      <div className="text-[9px] text-ocean-600 font-bold uppercase tracking-widest whitespace-nowrap">
        Last Sync: {new Date(meta.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
}

export function ConditionsPreview({ lat, lng, country, type }: { lat: number, lng: number, country: string, type?: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/weather?lat=${lat}&lng=${lng}&country=${encodeURIComponent(country)}&type=${encodeURIComponent(type || '')}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lat, lng, country, type]);

  if (loading || !data) {
    return (
      <div className="flex gap-2 animate-pulse">
        <div className="w-8 h-3 bg-ocean-800 rounded" />
        <div className="w-8 h-3 bg-ocean-800 rounded" />
        <div className="w-8 h-3 bg-ocean-800 rounded" />
      </div>
    );
  }

  const { marine, weather, meta } = data;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <Waves className="w-2.5 h-2.5 text-brand-cyan" />
        <span className="text-[10px] font-black text-white">{marine.waveHeight.value}{marine.waveHeight.unit}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Thermometer className="w-2.5 h-2.5 text-orange-500" />
        <span className="text-[10px] font-black text-white">{marine.seaSurfaceTemp.value}°</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Wind className="w-2.5 h-2.5 text-purple-400" />
        <span className="text-[10px] font-black text-white">{weather.windSpeed.value}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {meta.confidenceSummary === 'High' && <span className="text-[7px] text-green-500 font-black uppercase">Station</span>}
        <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", 
          meta.confidenceSummary === 'High' ? 'bg-green-500' : 'bg-brand-cyan'
        )} />
      </div>
    </div>
  );
}
