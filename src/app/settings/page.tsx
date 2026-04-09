"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, LogOut, Shield, Bell, Smartphone, Globe } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

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
              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-ocean-900/40 transition-colors group cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-ocean-800 flex items-center justify-center text-ocean-300 group-hover:text-brand-cyan transition-colors">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-white font-medium">Units</span>
                    <span className="text-xs text-ocean-500">U.S. Customary (Imperial)</span>
                  </div>
                </div>
                <span className="text-[10px] bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Locked</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-ocean-900/40 transition-colors group cursor-not-allowed">
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

              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-ocean-900/40 transition-colors group cursor-not-allowed">
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
            Abyss Scuba v1.0.4 • Built for the Depths
          </p>
        </div>
      </div>
    </main>
  );
}
