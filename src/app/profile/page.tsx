"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Award, Activity, Settings, Edit3, Zap } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, AreaChart, Area, LineChart, Line } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stats");
  const [chartData, setChartData] = useState<any>({ sac: [], bottomTime: [] });

  useEffect(() => {
    async function getProfileData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch Profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profileData);

        // Fetch Badges
        const { data: badgeData } = await supabase
          .from("user_badges")
          .select("*, badges(*)")
          .eq("user_id", user.id);
        if (badgeData) setBadges(badgeData);

        // Fetch Analytics Data
        const { data: logData } = await supabase
          .from("dive_logs")
          .select("date, bottom_time_min, computed_sac")
          .eq("user_id", user.id)
          .order("date", { ascending: true });

        if (logData) {
          const sacPoints = logData
            .filter(l => l.computed_sac)
            .slice(-10) // Last 10 dives
            .map(l => ({ 
              name: new Date(l.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), 
              sac: l.computed_sac 
            }));
          
          const btMonthly = logData.reduce((acc: any, l: any) => {
            const month = new Date(l.date).toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + (l.bottom_time_min || 0);
            return acc;
          }, {});

          setChartData({
            sac: sacPoints,
            bottomTime: Object.entries(btMonthly).map(([name, val]) => ({ name, val }))
          });
        }
      }
      setLoading(false);
    }
    getProfileData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-deep-sea flex items-center justify-center text-ocean-300 font-bold tracking-widest uppercase">Initializing Satellite Link...</div>;
  }

  return (
    <main className="w-full min-h-screen px-4 md:px-8 py-8 pt-24 md:pt-12 pb-32 bg-deep-sea">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 text-center md:text-left">
          <div className="relative">
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-brand-cyan to-brand-teal">
              <div className="w-full h-full bg-ocean-950 rounded-full flex items-center justify-center border-4 border-deep-sea">
                <User className="w-12 h-12 text-ocean-400" />
              </div>
            </div>
            <Link href="/onboarding" className="absolute bottom-0 right-0 p-2 glass rounded-full bg-ocean-800 border-ocean-600 hover:bg-ocean-700 transition block">
              <Edit3 className="w-4 h-4 text-white" />
            </Link>
          </div>

          <div className="flex-1 mt-2 md:mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{profile?.display_name || "Guest Diver"}</h1>
                <p className="text-brand-cyan text-sm font-semibold tracking-widest uppercase">{profile?.certification_level || "No Rank"}</p>
                <div className="flex gap-2 mt-4">
                  <Link href="/profile/gear" className="px-4 py-2 rounded-xl bg-ocean-800/80 border border-ocean-700/50 text-ocean-300 text-xs font-bold hover:text-white hover:bg-ocean-700 transition">🤿 My Gear Vault</Link>
                  <Link href="/tools" className="px-4 py-2 rounded-xl bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-bold hover:bg-brand-teal/20 transition">🛠️ Abyss Tools</Link>
                </div>
              </div>
              <Link href="/settings" className="p-2 glass rounded-xl text-ocean-300 hover:text-white self-center md:self-start block">
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-ocean-900/50 p-1.5 rounded-2xl w-full max-w-lg mx-auto md:mx-0">
          <button onClick={() => setActiveTab("stats")} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "stats" ? "bg-ocean-800 text-white shadow-md" : "text-ocean-400 hover:text-white"}`}>Stats</button>
          <button onClick={() => setActiveTab("mission")} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "mission" ? "bg-brand-teal/20 text-brand-teal border border-brand-teal/30 shadow-md" : "text-ocean-400 hover:text-white"}`}>Mission</button>
          <button onClick={() => setActiveTab("badges")} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "badges" ? "bg-ocean-800 text-white shadow-md" : "text-ocean-400 hover:text-white"}`}>Badges</button>
          <button onClick={() => setActiveTab("certs")} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "certs" ? "bg-ocean-800 text-white shadow-md" : "text-ocean-400 hover:text-white"}`}>Certs</button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "stats" && (
            <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Dives", val: profile?.total_dives || "0", unit: "", icon: <Award className="w-3 h-3" /> },
                  { label: "Total Time", val: profile?.total_bottom_time_min || "0", unit: "min", icon: <User className="w-3 h-3" /> },
                  { label: "Max Depth", val: "---", unit: "ft", icon: <Activity className="w-3 h-3" /> },
                  { label: "Avg SAC", val: profile?.computed_sac || "---", unit: "L/m", icon: <Zap className="w-3 h-3" /> },
                ].map(s => (
                  <div key={s.label} className="glass-card p-5 rounded-3xl text-center border border-ocean-800/50 hover:border-brand-cyan/20 transition-all">
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                       <span className="text-ocean-500 opacity-50">{s.icon}</span>
                       <h3 className="text-[10px] text-ocean-400 uppercase tracking-widest font-black">{s.label}</h3>
                    </div>
                    <p className="text-2xl font-black text-white">{s.val} <span className="text-[10px] text-ocean-500 font-bold uppercase tracking-tight">{s.unit}</span></p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                <div className="glass-card p-8 rounded-[2rem] border border-ocean-800/30">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Activity className="w-4 h-4 text-brand-cyan" /> Bottom Time (Min)
                    </h3>
                    <span className="text-[10px] font-bold text-ocean-500 uppercase">Season Trend</span>
                  </div>
                  <div className="h-56 w-full -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData.bottomTime}>
                        <defs>
                          <linearGradient id="colorBt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" hide />
                        <Tooltip contentStyle={{ background: '#0a111a', border: '1px solid #2a4f6a', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="val" stroke="#00e5ff" strokeWidth={3} fillOpacity={1} fill="url(#colorBt)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card p-8 rounded-[2rem] border border-ocean-800/30">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-4 h-4 text-brand-teal" /> Air Efficiency (SAC)
                    </h3>
                    <span className="text-[10px] font-bold text-ocean-500 uppercase">L / Min</span>
                  </div>
                  <div className="h-56 w-full -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.sac}>
                        <XAxis dataKey="name" hide />
                        <Tooltip contentStyle={{ background: '#0a111a', border: '1px solid #2a4f6a', borderRadius: '12px' }} />
                        <Line type="monotone" dataKey="sac" stroke="#00ffcc" strokeWidth={4} dot={{ r: 4, fill: '#00ffcc' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "mission" && (
            <motion.div key="mission" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
               <div className="glass-card p-8 rounded-[2.5rem] border border-ocean-800/30">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-brand-teal" /> Deployment Preferences
                  </h3>
                  
                  <div className="space-y-8">
                    {/* Availability Toggle */}
                    <div className="flex items-center justify-between bg-ocean-950/40 p-5 rounded-2xl border border-ocean-800/30">
                       <div>
                          <p className="text-sm font-bold text-white mb-1">Open for Mission Invitations</p>
                          <p className="text-[10px] text-ocean-500 font-bold uppercase tracking-widest">Visible in Partner Explorer</p>
                       </div>
                       <button 
                         onClick={async () => {
                           const supabase = createClient();
                           const newVal = !profile.buddy_availability;
                           const { error } = await supabase.from('profiles').update({ buddy_availability: newVal }).eq('id', profile.id);
                           if (!error) setProfile({ ...profile, buddy_availability: newVal });
                         }}
                         className={cn(
                           "w-12 h-6 rounded-full p-1 transition-all duration-300",
                           profile.buddy_availability ? "bg-brand-teal" : "bg-ocean-800"
                         )}
                       >
                          <div className={cn("w-4 h-4 bg-white rounded-full transition-transform", profile.buddy_availability ? "translate-x-6" : "translate-x-0")} />
                       </button>
                    </div>

                    {/* Home Base */}
                    <div className="space-y-3">
                       <p className="text-[10px] text-ocean-500 font-black uppercase tracking-widest px-1">Home Operations Base</p>
                       <input 
                         type="text" 
                         placeholder="e.g. Florida, USA" 
                         value={profile.home_base || ""}
                         onChange={async (e) => {
                           const val = e.target.value;
                           setProfile({ ...profile, home_base: val });
                           const supabase = createClient();
                           await supabase.from('profiles').update({ home_base: val }).eq('id', profile.id);
                         }}
                         className="w-full bg-ocean-900/50 border border-ocean-800 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-teal focus:outline-none transition-all"
                       />
                    </div>

                     {/* Specialties */}
                    <div className="space-y-4">
                       <p className="text-[10px] text-ocean-500 font-black uppercase tracking-widest px-1">Technical Specialties</p>
                       <div className="flex flex-wrap gap-2">
                          {['Nitrox', 'Wreck', 'Deep', 'Tech', 'Cave', 'Photo', 'Rescue', 'Master'].map(spec => (
                            <button 
                              key={spec}
                              onClick={async () => {
                                let specs = profile.specialties || [];
                                if (specs.includes(spec)) {
                                  specs = specs.filter((s: string) => s !== spec);
                                } else {
                                  specs = [...specs, spec];
                                }
                                const supabase = createClient();
                                await supabase.from('profiles').update({ specialties: specs }).eq('id', profile.id);
                                setProfile({ ...profile, specialties: specs });
                              }}
                              className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                profile.specialties?.includes(spec) ? "bg-brand-teal text-deep-sea border-brand-teal shadow-[0_0_15px_rgba(45,212,191,0.2)]" : "bg-ocean-900 text-ocean-400 border-ocean-800 hover:border-ocean-600"
                              )}
                            >
                              {spec}
                            </button>
                          ))}
                       </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="space-y-4 pt-6 border-t border-ocean-800/30">
                       <h4 className="text-[10px] text-red-500 font-black uppercase tracking-widest px-1">Ground Ops (Emergency Contact)</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <p className="text-[9px] text-ocean-500 font-black uppercase tracking-widest px-1">Contact Name</p>
                             <input 
                               type="text" 
                               value={profile.emergency_contact_name || ""}
                               placeholder="Emergency Contact Name"
                               onChange={async (e) => {
                                 const val = e.target.value;
                                 setProfile({ ...profile, emergency_contact_name: val });
                                 const supabase = createClient();
                                 await supabase.from('profiles').update({ emergency_contact_name: val }).eq('id', profile.id);
                               }}
                               className="w-full bg-ocean-950/40 border border-ocean-800 rounded-xl px-4 py-3 text-xs text-white focus:border-red-500/50 focus:outline-none transition-all"
                             />
                          </div>
                          <div className="space-y-2">
                             <p className="text-[9px] text-ocean-500 font-black uppercase tracking-widest px-1">Contact Phone</p>
                             <input 
                               type="text" 
                               value={profile.emergency_contact_phone || ""}
                               placeholder="+1 (555) 000-0000"
                               onChange={async (e) => {
                                 const val = e.target.value;
                                 setProfile({ ...profile, emergency_contact_phone: val });
                                 const supabase = createClient();
                                 await supabase.from('profiles').update({ emergency_contact_phone: val }).eq('id', profile.id);
                               }}
                               className="w-full bg-ocean-950/40 border border-ocean-800 rounded-xl px-4 py-3 text-xs text-white focus:border-red-500/50 focus:outline-none transition-all"
                             />
                          </div>
                       </div>
                    </div>

                    {/* Medical Metadata */}
                    <div className="space-y-4 pt-4 border-t border-ocean-800/20">
                       <h4 className="text-[10px] text-brand-cyan font-black uppercase tracking-widest px-1 text-glow-cyan">Biometric Metadata</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                             <p className="text-[9px] text-ocean-500 font-black uppercase tracking-widest px-1">Blood Type</p>
                             <select 
                               value={profile.blood_type || ""}
                               onChange={async (e) => {
                                 const val = e.target.value;
                                 setProfile({ ...profile, blood_type: val });
                                 const supabase = createClient();
                                 await supabase.from('profiles').update({ blood_type: val }).eq('id', profile.id);
                               }}
                               className="w-full bg-ocean-950/40 border border-ocean-800 rounded-xl px-4 py-3 text-xs text-white focus:border-brand-cyan/50 focus:outline-none transition-all appearance-none"
                             >
                                <option value="" className="bg-ocean-950">Select Type</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
                                  <option key={t} value={t} className="bg-ocean-950">{t}</option>
                                ))}
                             </select>
                          </div>
                          <div className="sm:col-span-2 space-y-2">
                             <p className="text-[9px] text-ocean-500 font-black uppercase tracking-widest px-1">Critical Medical Notes</p>
                             <input 
                               type="text" 
                               value={profile.medical_notes || ""}
                               placeholder="Allergies, Medications, Insurance #"
                               onChange={async (e) => {
                                 const val = e.target.value;
                                 setProfile({ ...profile, medical_notes: val });
                                 const supabase = createClient();
                                 await supabase.from('profiles').update({ medical_notes: val }).eq('id', profile.id);
                               }}
                               className="w-full bg-ocean-950/40 border border-ocean-800 rounded-xl px-4 py-3 text-xs text-white focus:border-brand-cyan/50 focus:outline-none transition-all"
                             />
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === "badges" && (
            <motion.div key="badges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {badges.length === 0 ? (
                <div className="col-span-4 py-20 text-center text-ocean-500 font-bold uppercase tracking-widest bg-ocean-900/20 rounded-3xl">No badges earned yet.</div>
              ) : badges.map((ub) => (
                <div key={ub.id} className="glass p-6 rounded-3xl text-center border border-ocean-800/50 hover:border-brand-cyan/50 transition-all flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 flex items-center justify-center mb-4"><Award className="w-6 h-6 text-brand-cyan" /></div>
                  <h3 className="text-white font-bold text-sm mb-1">{ub.badges?.name}</h3>
                  <p className="text-[10px] text-ocean-500 leading-tight uppercase tracking-wider">{ub.badges?.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
