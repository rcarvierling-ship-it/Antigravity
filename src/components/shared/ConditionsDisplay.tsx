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
  const { marine, weather, analysis, meta } = data;
  const isProtected = meta.siteCategory === 'protected' || meta.siteCategory === 'semi-protected';

  const ratingColors = {
    Excellent: "text-green-500 border-green-500/20 bg-green-500/5",
    Good: "text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5",
    Fair: "text-yellow-500 border-yellow-500/20 bg-yellow-500/5",
    Poor: "text-orange-500 border-orange-500/20 bg-orange-500/5",
    Avoid: "text-red-500 border-red-500/20 bg-red-500/5"
  };

  const riskColors = {
    Low: "text-green-500",
    Moderate: "text-yellow-500",
    High: "text-red-500"
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Mission Intelligence Dashboard */}
      <div className="glass-card rounded-3xl p-6 border border-ocean-800/50 bg-ocean-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-brand-cyan" />
              <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest">Diver Intelligence Engine</span>
            </div>
            <h2 className="text-2xl font-black text-white leading-tight">{analysis.summary}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[9px] font-bold text-ocean-500 uppercase tracking-widest">Diveability Score</p>
              <p className="text-4xl font-black text-white tracking-tighter">{analysis.diveabilityScore}<span className="text-sm text-ocean-600">%</span></p>
            </div>
            <div className={cn("px-4 py-2 rounded-2xl border font-black uppercase tracking-widest text-xs h-fit", ratingColors[analysis.overallRating as keyof typeof ratingColors])}>
              {analysis.overallRating}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-ocean-800/30 pt-6">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-ocean-500 uppercase tracking-tighter leading-none mb-1">Current Risk</span>
            <span className={cn("text-xs font-bold", riskColors[analysis.currentRisk as keyof typeof riskColors])}>{analysis.currentRisk}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-ocean-500 uppercase tracking-tighter leading-none mb-1">Surge Risk</span>
            <span className={cn("text-xs font-bold", riskColors[analysis.surgeRisk as keyof typeof riskColors])}>{analysis.surgeRisk}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-ocean-500 uppercase tracking-tighter leading-none mb-1">Suitability</span>
            <span className={cn("text-xs font-bold", 
              analysis.beginnerSuitability === 'Good' ? 'text-brand-cyan' : 
              analysis.beginnerSuitability === 'Caution' ? 'text-yellow-500' : 'text-red-500'
            )}>
              {analysis.beginnerSuitability}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Primary Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ConditionsMetric label="Wave Height" metric={marine.waveHeight} icon={<Waves className="w-4 h-4" />} />
        <ConditionsMetric label="Water Temp" metric={marine.seaSurfaceTemp} icon={<Thermometer className="w-4 h-4" />} />
        <ConditionsMetric label="Current" metric={marine.currentSpeed} icon={<Gauge className="w-4 h-4" />} />
        <ConditionsMetric label="Wind" metric={weather.windSpeed} icon={<Wind className="w-4 h-4" />} />
      </div>

      {/* 3. Site-Specific Mission Notes */}
      <div className="space-y-2">
        {analysis.notes.map((note: string, i: number) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-ocean-900/30 border border-ocean-800/50">
            <Info className="w-3.5 h-3.5 text-ocean-500 mt-0.5" />
            <p className="text-[11px] text-ocean-300 font-medium leading-tight">{note}</p>
          </div>
        ))}
      </div>

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

  const { marine, weather, analysis, meta } = data;

  const ratingColors = {
    Excellent: "bg-green-500",
    Good: "bg-brand-cyan",
    Fair: "bg-yellow-500",
    Poor: "bg-orange-500",
    Avoid: "bg-red-500"
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-ocean-900 border border-ocean-800">
        <span className="text-[9px] font-black text-white">{analysis.diveabilityScore}%</span>
      </div>
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
        <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", 
          ratingColors[analysis.overallRating as keyof typeof ratingColors] || 'bg-brand-cyan'
        )} />
      </div>
    </div>
  );
}
