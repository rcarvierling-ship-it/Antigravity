"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, LogOut, Shield, Bell, Smartphone, Globe } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSettings() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    }
    getSettings();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const updatePreference = async (field: string, value: any) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ [field]: value })
      .eq("id", profile.id);
    
    if (!error) {
      setProfile({ ...profile, [field]: value });
    }
  };

  if (loading) return <div className="min-h-screen bg-deep-sea flex items-center justify-center text-ocean-300 font-bold tracking-widest uppercase">Fetching Mission Config...</div>;

  return (
    <main className="w-full min-h-screen px-4 md:px-8 py-8 pt-24 md:pt-12 pb-24 bg-deep-sea relative overflow-hidden">
      {/* HUD Background Grid */}
      <div className="absolute inset-0 hud-grid opacity-10 pointer-events-none z-0" />
      
      <div className="max-w-2xl mx-auto relative z-10 scan-line">
        
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <Link href="/profile" className="p-3 glass rounded-lg text-ocean-400 hover:text-brand-cyan transition-all border border-ocean-800/50">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
             <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-flicker" />
                <span className="text-[8px] font-black text-brand-cyan uppercase tracking-[0.4em]">Config Node: 0x92f</span>
             </div>
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Settings</h1>
          </div>
        </div>

        <div className="space-y-8">
          {/* Preferences Section */}
          <section className="glass-card rounded-2xl p-8 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-cyan/20" />
            <h2 className="text-[10px] font-black text-ocean-500 uppercase tracking-[0.4em] mb-8">Mission_Parameters</h2>
            
            <div className="space-y-4">
              <div 
                onClick={() => updatePreference('unit_system', profile.unit_system === 'metric' ? 'imperial' : 'metric')}
                className="flex items-center justify-between p-6 rounded-xl hover:bg-brand-cyan/5 transition-all group cursor-pointer border border-white/5 active:scale-[0.98]"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded bg-ocean-1000 flex items-center justify-center text-ocean-300 group-hover:text-brand-cyan transition-all border border-ocean-800 shadow-inner">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-white font-black uppercase tracking-widest text-sm mb-1">Unit Protocol</span>
                    <span className="text-[10px] text-ocean-500 font-bold uppercase tracking-widest">{profile?.unit_system === 'metric' ? 'Metric (m, °C, bar)' : 'Imperial (ft, °F, psi)'}</span>
                  </div>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded font-black text-[10px] uppercase tracking-widest border transition-all",
                  profile?.unit_system === 'metric' ? "bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30 shadow-[0_0_15px_rgba(0,229,255,0.1)]" : "bg-ocean-1000 text-ocean-600 border-ocean-900"
                )}>
                   {profile?.unit_system || 'protocol_error'}
                </div>
              </div>

              <div className="flex items-center justify-between p-6 rounded-xl opacity-30 cursor-not-allowed border border-white/5">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded bg-ocean-1000 flex items-center justify-center text-ocean-700">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-ocean-600 font-black uppercase tracking-widest text-sm mb-1">Neural Links</span>
                    <span className="text-[10px] text-ocean-700 font-bold uppercase tracking-widest">Encrypted Silence</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 rounded-xl opacity-30 cursor-not-allowed border border-white/5">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded bg-ocean-1000 flex items-center justify-center text-ocean-700">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-ocean-600 font-black uppercase tracking-widest text-sm mb-1">Cloak Active</span>
                    <span className="text-[10px] text-ocean-700 font-bold uppercase tracking-widest">Stealth Configuration</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Biometric & Emergency Section */}
          <section className="glass-card rounded-2xl p-8 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20" />
            <h2 className="text-[10px] font-black text-ocean-500 uppercase tracking-[0.4em] mb-8">Bio_Safety_Override</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-ocean-600 uppercase tracking-widest block ml-1">Emergency_Contact</label>
                  <input 
                    type="text"
                    placeholder="NAME..."
                    defaultValue={profile?.emergency_contact_name}
                    onBlur={(e) => updatePreference("emergency_contact_name", e.target.value)}
                    className="w-full bg-ocean-1000 border border-ocean-900 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-red-500/50 transition-all uppercase placeholder:opacity-20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-ocean-600 uppercase tracking-widest block ml-1">Kin_Relay</label>
                  <input 
                    type="text"
                    placeholder="PHONE..."
                    defaultValue={profile?.emergency_contact_phone}
                    onBlur={(e) => updatePreference("emergency_contact_phone", e.target.value)}
                    className="w-full bg-ocean-1000 border border-ocean-900 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-red-500/50 transition-all uppercase placeholder:opacity-20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-ocean-600 uppercase tracking-widest block ml-1">Blood_Group</label>
                  <select 
                    defaultValue={profile?.blood_type}
                    onChange={(e) => updatePreference("blood_type", e.target.value)}
                    className="w-full bg-ocean-1000 border border-ocean-900 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-brand-teal/50 transition-all uppercase appearance-none"
                  >
                    <option value="">SCANNING...</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-ocean-600 uppercase tracking-widest block ml-1">Medical_Dossier</label>
                  <input 
                    type="text"
                    placeholder="ALLERGIES / NOTES..."
                    defaultValue={profile?.medical_notes}
                    onBlur={(e) => updatePreference("medical_notes", e.target.value)}
                    className="w-full bg-ocean-1000 border border-ocean-900 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-brand-teal/50 transition-all uppercase placeholder:opacity-20"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section className="glass-card rounded-2xl p-8 border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-brand-teal/20" />
            <h2 className="text-[10px] font-black text-ocean-500 uppercase tracking-[0.4em] mb-8">Base_Support</h2>
            <div className="space-y-4">
              <Link href="mailto:support@abyss-app.com" className="flex items-center gap-6 p-6 rounded-xl hover:bg-brand-teal/5 transition-all group border border-white/5">
                <div className="w-12 h-12 rounded bg-ocean-1000 flex items-center justify-center text-ocean-300 group-hover:text-brand-teal transition-all border border-ocean-800">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-white font-black uppercase tracking-widest text-sm mb-1">Command Comms</span>
                  <span className="text-[10px] text-ocean-500 font-bold uppercase tracking-widest">Direct link to mission control</span>
                </div>
              </Link>
            </div>
          </section>

          {/* Logout Section */}
          <button 
            onClick={handleLogout}
            className="w-full p-8 rounded-2xl bg-red-950/10 border border-red-900/20 text-red-500 font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:bg-red-900/20 transition-all hover:border-red-500/50 group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Decommission Session
          </button>

          <div className="text-center mt-12">
             <p className="text-ocean-700 text-[8px] font-black uppercase tracking-[0.5em] mb-2">ABYSS_PROTOCOL // VER_1.1.0</p>
             <p className="text-ocean-800 text-[8px] font-black uppercase tracking-[0.2em]">SECURE COMMUNICATION LINE • ENCRYPTED_DEPLOYMENT</p>
          </div>
        </div>
      </div>
    </main>
  );
}
