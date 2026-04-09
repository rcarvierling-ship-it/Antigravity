export function QuickStats({ profile }: { profile?: any }) {
  const stats = [
    { label: "Total Dives", value: profile?.total_dives || "0", subtitle: profile?.certification_level || "No Rank" },
    { label: "Max Depth", value: "---", subtitle: "ft" },
    { label: "Avg View", value: "---", subtitle: "ft" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-6 w-full max-w-4xl mx-auto px-4 md:px-0 mb-8 z-20 relative -mt-12 md:mt-0">
      {stats.map((stat, i) => (
        <div key={i} className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center text-center transform hover:-translate-y-1 transition-transform border border-ocean-700/50">
          <span className="text-[10px] md:text-xs text-ocean-300 font-semibold uppercase tracking-wider mb-1">{stat.label}</span>
          <span className="text-2xl md:text-3xl font-bold text-white text-glow-cyan">{stat.value}</span>
          <span className="text-[9px] md:text-xs text-brand-teal mt-1">{stat.subtitle}</span>
        </div>
      ))}
    </div>
  );
}
