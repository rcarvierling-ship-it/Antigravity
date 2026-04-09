"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function DepthStratification({ data = [] }: { data?: any[] }) {
  // Simulated cumulative time in zones over months
  const simulatedData = [
    { month: "Jan", shallow: 120, medium: 40, deep: 10 },
    { month: "Feb", shallow: 150, medium: 60, deep: 15 },
    { month: "Mar", shallow: 110, medium: 80, deep: 35 },
    { month: "Apr", shallow: 180, medium: 120, deep: 45 },
    { month: "May", shallow: 210, medium: 150, deep: 60 },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 border border-brand-cyan/20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Depth Stratification</h3>
          <p className="text-[10px] text-ocean-400 font-bold uppercase mt-1">Cumulative Time Distribution</p>
        </div>
      </div>

      <div className="h-64 w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={simulatedData}>
            <defs>
              <linearGradient id="colorShallow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#00ffcc" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDeep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6296b4" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6296b4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#6296b4" fontSize={10} tick={{ fontWeight: 700 }} />
            <YAxis stroke="#6296b4" fontSize={10} tick={{ fontWeight: 700 }} unit="m" />
            <Tooltip 
              contentStyle={{ 
                background: '#0a111a', 
                border: '1px solid #2a4f6a', 
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 800,
                color: '#fff'
              }}
            />
            <Area type="monotone" dataKey="deep" stackId="1" stroke="#6296b4" fill="url(#colorDeep)" />
            <Area type="monotone" dataKey="medium" stackId="1" stroke="#00e5ff" fill="url(#colorMedium)" />
            <Area type="monotone" dataKey="shallow" stackId="1" stroke="#00ffcc" fill="url(#colorShallow)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
         <div className="text-center">
            <span className="block text-[8px] text-ocean-500 font-black uppercase">Shallow</span>
            <span className="text-xs font-black text-brand-teal tracking-tighter">&lt; 30ft</span>
         </div>
         <div className="text-center border-x border-ocean-800/50">
            <span className="block text-[8px] text-ocean-500 font-black uppercase">Recreational</span>
            <span className="text-xs font-black text-brand-cyan tracking-tighter">30-100ft</span>
         </div>
         <div className="text-center">
            <span className="block text-[8px] text-ocean-500 font-black uppercase">Advanced</span>
            <span className="text-xs font-black text-white tracking-tighter">100ft+</span>
         </div>
      </div>
    </div>
  );
}
