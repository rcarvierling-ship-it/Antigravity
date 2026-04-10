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
    <main className="w-full min-h-screen px-4 md:px-8 py-8 pt-24 md:pt-12 pb-24 bg-deep-sea">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile" className="p-2 glass rounded-xl text-ocean-300 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Preferences Section */}
          <section className="glass-card rounded-[2rem] p-6 border border-ocean-800/50">
            <h2 className="text-xs font-bold text-ocean-400 uppercase tracking-widest mb-6 px-2">Account Preferences</h2>
            
            <div className="space-y-2">
              <div 
                onClick={() => updatePreference('unit_system', profile.unit_system === 'metric' ? 'imperial' : 'metric')}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-ocean-900/40 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-ocean-800 flex items-center justify-center text-ocean-300 group-hover:text-brand-cyan transition-colors">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-white font-medium">Units</span>
                    <span className="text-xs text-ocean-500">{profile?.unit_system === 'metric' ? 'Metric (m, °C, bar)' : 'Imperial (ft, °F, psi)'}</span>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                  profile?.unit_system === 'metric' ? "bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30" : "bg-ocean-800 text-ocean-400 border-ocean-700"
                )}>
                  {profile?.unit_system}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-ocean-900/40 transition-colors group cursor-not-allowed opacity-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-ocean-800 flex items-center justify-center text-ocean-300 group-hover:text-brand-cyan transition-colors">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-white font-medium">Notifications</span>
                    <span className="text-xs text-ocean-500">Muted for depth deep focus</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-ocean-900/40 transition-colors group cursor-not-allowed opacity-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-ocean-800 flex items-center justify-center text-ocean-300 group-hover:text-brand-cyan transition-colors">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-white font-medium">Privacy</span>
                    <span className="text-xs text-ocean-500">Stealth mode active</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section className="glass-card rounded-[2rem] p-6 border border-ocean-800/50">
            <h2 className="text-xs font-bold text-ocean-400 uppercase tracking-widest mb-6 px-2">Support</h2>
            <div className="space-y-2">
              <Link href="mailto:support@abyss-app.com" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-ocean-900/40 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-ocean-800 flex items-center justify-center text-ocean-300 group-hover:text-brand-teal transition-colors">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-white font-medium">Contact Support</span>
                  <span className="text-xs text-ocean-500">Get help with your Abyss account</span>
                </div>
              </Link>
            </div>
          </section>

          {/* Logout Section */}
          <button 
            onClick={handleLogout}
            className="w-full p-6 rounded-[2rem] bg-red-950/20 border border-red-900/30 text-red-400 font-bold flex items-center justify-center gap-3 hover:bg-red-900/20 transition-all hover:border-red-500/50 group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Sign Out from Abyss
          </button>

          <p className="text-center text-ocean-600 text-[10px] tracking-widest uppercase mt-8">
            Abyss Scuba v1.1.0 • Built for the Depths
          </p>
        </div>
      </div>
    </main>
  );
}
