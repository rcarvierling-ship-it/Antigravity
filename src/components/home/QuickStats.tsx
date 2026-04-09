import { ShieldAlert, ShieldCheck, Activity, Award, Brain } from "lucide-react";
import Link from "next/link";

export function QuickStats({ profile, gearAlert }: { profile?: any; gearAlert?: boolean }) {
  const stats = [
    { 
      label: "Total Dives", 
      value: profile?.total_dives || "0", 
      subtitle: profile?.certification_level || "No Rank",
      icon: <Award className="w-4 h-4 text-brand-cyan" />
    },
    { 
      label: "Gear Status", 
      value: gearAlert ? "SERVICE DUE" : "HEALTHY", 
      subtitle: gearAlert ? "Check Vault" : "All Clear",
      alert: gearAlert,
      icon: gearAlert ? <ShieldAlert className="w-4 h-4 text-red-400" /> : <ShieldCheck className="w-4 h-4 text-brand-teal" />
    },
    { 
      label: "Avg SAC Rate", 
      value: "---", 
      subtitle: "cuft/min",
      icon: <Activity className="w-4 h-4 text-brand-cyan" />
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0 mb-12 z-20 relative -mt-8 md:mt-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, i) => {
          const content = (
            <div 
              className={`glass-card rounded-3xl p-6 h-full flex flex-col items-center justify-center text-center transform hover:-translate-y-1 transition-all duration-300 border ${
                stat.alert ? 'border-red-500/30 bg-red-500/5' : 'border-ocean-700/50 hover:border-brand-cyan/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {stat.icon}
                <span className="text-[10px] md:text-xs text-ocean-300 font-bold uppercase tracking-widest">{stat.label}</span>
              </div>
              <span className={`text-2xl md:text-3xl font-black ${stat.alert ? 'text-red-400' : 'text-white text-glow-cyan'}`}>
                {stat.value}
              </span>
              <span className={`text-[10px] md:text-xs mt-2 font-semibold ${stat.alert ? 'text-red-500/80 uppercase' : 'text-ocean-500'}`}>
                {stat.subtitle}
              </span>
              {stat.label === "Avg SAC Rate" && (
                <div className="mt-3 flex items-center gap-1 text-[8px] font-black text-brand-cyan uppercase tracking-tighter opacity-0 group-hover/btn:opacity-100 transition-opacity">
                   View Intel <Brain className="w-2 h-2" />
                </div>
              )}
            </div>
          );

          if (stat.label === "Avg SAC Rate") {
            return (
              <Link key={i} href="/analytics" className="group/btn block h-full">
                {content}
              </Link>
            );
          }

          return <div key={i}>{content}</div>;
        })}
      </div>
    </div>
  );
}
