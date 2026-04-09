"use client";

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

export function GasEfficiencyMap({ data = [] }: { data?: any[] }) {
  // Simulating data points for cooler visual effect
  // Real app would fetch: { depth: number, sac: number, rating: number }
  const simulatedPoints = Array.from({ length: 24 }).map((_, i) => ({
    depth: 30 + Math.random() * 90,
    sac: 0.5 + Math.random() * 0.4,
    size: 1 + Math.random() * 4,
    id: i
  }));

  return (
    <div className="glass-card rounded-3xl p-6 border border-brand-teal/20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Efficiency Matrix</h3>
          <p className="text-[10px] text-ocean-400 font-bold uppercase mt-1">Correlation: Avg Depth vs. SAC Rate</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">Imperial ft/cuft</span>
        </div>
      </div>

      <div className="h-64 w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a4f6a" vertical={false} />
            <XAxis 
              type="number" 
              dataKey="depth" 
              name="Depth" 
              unit="ft" 
              stroke="#6296b4" 
              fontSize={10} 
              tick={{ fontWeight: 700 }}
              axisLine={{ stroke: '#2a4f6a' }}
            />
            <YAxis 
              type="number" 
              dataKey="sac" 
              name="SAC" 
              unit="cfm" 
              stroke="#6296b4" 
              fontSize={10} 
              tick={{ fontWeight: 700 }}
              axisLine={{ stroke: '#2a4f6a' }}
              domain={[0.4, 1.0]}
            />
            <ZAxis type="number" dataKey="size" range={[100, 400]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                background: '#0a111a', 
                border: '1px solid #2a4f6a', 
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 800,
                color: '#fff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            />
            <Scatter name="Dives" data={simulatedPoints}>
              {simulatedPoints.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.sac < 0.6 ? "#00ffcc" : entry.sac < 0.8 ? "#00e5ff" : "#6296b4"} 
                  fillOpacity={0.6}
                  stroke={entry.sac < 0.6 ? "#00ffcc" : "#00e5ff"}
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-teal" />
            <span className="text-[9px] font-bold text-ocean-400 uppercase tracking-widest">Peak Calm</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-cyan" />
            <span className="text-[9px] font-bold text-ocean-400 uppercase tracking-widest">Standard</span>
        </div>
      </div>
    </div>
  );
}
