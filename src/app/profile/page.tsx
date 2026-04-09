"use client";

import { useState } from "react";
import { User, Award, Activity, Settings, Edit3 } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, AreaChart, Area } from "recharts";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("stats");

  const monthlyDives: any[] = [];

  const depthHistory: any[] = [];

  return (
    <main className="w-full min-h-screen px-4 md:px-8 py-8 pt-24 md:pt-12 pb-24">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 text-center md:text-left">
          <div className="relative">
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-brand-cyan to-brand-teal">
              <div className="w-full h-full bg-ocean-950 rounded-full flex items-center justify-center border-4 border-deep-sea">
                <User className="w-12 h-12 text-ocean-400" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 p-2 glass rounded-full bg-ocean-800 border-ocean-600 hover:bg-ocean-700 transition">
              <Edit3 className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="flex-1 mt-2 md:mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Guest Diver</h1>
                <p className="text-brand-cyan text-sm font-semibold tracking-widest uppercase">Advanced Open Water</p>
                <p className="text-ocean-400 text-sm mt-2 max-w-sm">Passionate wreck diver aiming for technical trimix certification. Based in Miami, FL.</p>
              </div>
              <button className="p-2 glass rounded-xl text-ocean-300 hover:text-white self-center md:self-start">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-ocean-900/50 p-1.5 rounded-2xl w-full max-w-md mx-auto md:mx-0">
          <button 
            onClick={() => setActiveTab("stats")}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "stats" ? "bg-ocean-800 text-white shadow-md" : "text-ocean-400 hover:text-white"}`}
          >
            Statistics
          </button>
          <button 
            onClick={() => setActiveTab("certs")}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "certs" ? "bg-ocean-800 text-white shadow-md" : "text-ocean-400 hover:text-white"}`}
          >
            Certifications
          </button>
        </div>

        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Dives", val: "42" },
                { label: "Hours UW", val: "34" },
                { label: "Max Depth", val: "40m" },
                { label: "Coldest Temp", val: "18°C" },
              ].map(s => (
                <div key={s.label} className="glass-card p-4 rounded-2xl text-center">
                  <h3 className="text-[10px] text-ocean-400 uppercase tracking-widest mb-1">{s.label}</h3>
                  <p className="text-2xl font-bold text-white">{s.val}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-3xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-cyan" /> Dives per Month
                </h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyDives} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#6296b4" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: 'rgba(0,0,0,0.2)' }} contentStyle={{ backgroundColor: '#0a111a', border: '1px solid #2a4f6a' }} />
                      <Bar dataKey="dives" fill="#00e5ff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-6 rounded-3xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-teal" /> Depth History
                </h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={depthHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorDepth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00ffcc" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#6296b4" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ stroke: '#00ffcc', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ backgroundColor: '#0a111a', border: '1px solid #2a4f6a' }} />
                      <Area type="monotone" dataKey="depth" stroke="#00ffcc" strokeWidth={2} fillOpacity={1} fill="url(#colorDepth)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "certs" && (
          <div className="space-y-4 relative">
            {/* Simple timeline line */}
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-brand-cyan to-ocean-800 rounded-full" />
            
            {[
              { title: "Advanced Open Water", org: "PADI", date: "Jul 2025", number: "1905E51" },
              { title: "Open Water Diver", org: "PADI", date: "May 2024", number: "1802E39" }
            ].map((c, i) => (
              <div key={i} className="flex gap-4 relative z-10 items-center">
                <div className="w-12 h-12 rounded-full bg-ocean-950 border-2 border-brand-cyan flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-brand-cyan" />
                </div>
                <div className="glass-card p-5 rounded-2xl flex-1 flex justify-between items-center group cursor-pointer hover:bg-ocean-900/50 transition">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">{c.title}</h3>
                    <p className="text-brand-cyan text-sm font-semibold">{c.org} • {c.date}</p>
                    <p className="text-ocean-400 text-xs mt-1">Num: {c.number}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
