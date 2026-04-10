"use client";

import { Confidence, ConditionMetric } from "@/types/conditions";
import { ShieldCheck, ShieldAlert, Shield, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricProps {
  label: string;
  metric: ConditionMetric;
  icon?: React.ReactNode;
  className?: string;
}

export function ConditionsMetric({ label, metric, icon, className }: MetricProps) {
  const isUnavailable = metric.value === "Unavailable" || metric.value === null;

  return (
    <div className={cn("bg-ocean-900/40 border border-ocean-800/50 rounded-2xl p-4 flex flex-col gap-2 hover:border-white/10 transition-colors group", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           {icon && <div className="text-ocean-400 group-hover:text-brand-cyan transition-colors">{icon}</div>}
           <p className="text-[9px] text-ocean-400 uppercase tracking-widest font-black">{label}</p>
        </div>
        <ConfidenceBadge confidence={metric.confidence} />
      </div>
      
      <div className="flex flex-baseline gap-1 mt-1">
        <span className={cn("text-xl font-black transition-colors", isUnavailable ? "text-ocean-700" : "text-white group-hover:text-brand-cyan")}>
          {isUnavailable ? "---" : metric.value}
        </span>
        {!isUnavailable && <span className="text-[10px] font-bold text-ocean-500 uppercase">{metric.unit}</span>}
      </div>

      <div className="flex items-center gap-1 mt-auto">
        <Info className="w-2.5 h-2.5 text-ocean-600" />
        <span className="text-[8px] text-ocean-600 font-bold uppercase truncate max-w-full">
          {metric.source}
        </span>
      </div>
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

export function ConditionsFooter({ meta }: { meta: any }) {
  return (
    <div className="mt-6 pt-4 border-t border-ocean-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={cn(
          "px-2 py-1 rounded bg-ocean-900 border border-ocean-800 text-[10px] font-black uppercase",
          meta.confidenceSummary === "High" ? "text-green-500" : "text-brand-cyan"
        )}>
          {meta.primarySource}
        </div>
        <p className="text-[10px] text-ocean-500 font-semibold italic">{meta.note}</p>
      </div>
      <div className="text-[9px] text-ocean-600 font-bold uppercase tracking-widest">
        Last Sync: {new Date(meta.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
}

export function ConditionsPreview({ lat, lng, country }: { lat: number, lng: number, country: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/weather?lat=${lat}&lng=${lng}&country=${encodeURIComponent(country)}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lat, lng, country]);

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
      <div className="ml-auto">
        <ConfidenceIndicator confidence={meta.confidenceSummary} />
      </div>
    </div>
  );
}

function ConfidenceIndicator({ confidence }: { confidence: Confidence }) {
  const colors = {
    High: "bg-green-500",
    Medium: "bg-brand-cyan",
    Low: "bg-orange-500"
  };

  return (
    <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", colors[confidence])} />
  );
}

import { useEffect, useState } from "react";
import { Thermometer, Waves, Wind } from "lucide-react";
