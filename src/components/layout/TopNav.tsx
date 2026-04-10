"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookOpen, Users, Bell, User, Waves, AlertTriangle, Settings, LogOut, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/auth/actions";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";

export function TopNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const fetchProfileData = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, certification_level, avatar_url, role")
        .eq("id", userId)
        .single();
      
      if (data) {
        setProfile(data);
      }
      setLoading(false);
    };

    // 1. Initial Check
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        fetchProfileData(user.id);
      } else {
        setLoading(false);
      }
    });

    // 2. Real-time Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session?.user) {
          setUser(session.user);
          fetchProfileData(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const links = [
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/logbook", label: "Logs", icon: BookOpen },
    { href: "/marine-life", label: "Marine Life", icon: Waves },
    { href: "/social", label: "Social", icon: Users },
  ];

  return (
    <nav className="hidden md:block sticky top-0 z-50 glass border-b border-ocean-800/30 w-full py-4 px-6 md:px-12">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* LOGO */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-cyan to-brand-teal flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-deep-sea rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-brand-cyan rounded-full box-glow-cyan shadow-sm" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-glow-cyan transition-all duration-300">
            Abyss
          </span>
        </Link>
        
        {/* MIDDLE LINKS */}
        <div className="flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isActive ? "text-brand-cyan text-glow-cyan" : "text-ocean-300 hover:text-white"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          <Link 
            href="/safety"
            className="p-2 text-red-500 hover:text-white hover:bg-red-600/20 transition-all rounded-full glass border border-red-900/30 group"
          >
            <AlertTriangle className="w-5 h-5 group-hover:animate-pulse" />
          </Link>
          <button className="p-2 text-ocean-300 hover:text-brand-cyan transition-colors rounded-full glass hover:bg-ocean-800/50">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="relative" ref={dropdownRef}>
            {loading && !user ? (
              <div className="flex items-center gap-3 glass py-1.5 px-3 rounded-full border-ocean-800/50">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-ocean-500 font-bold animate-pulse uppercase tracking-tight">Initializing...</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-ocean-950 flex items-center justify-center border border-ocean-800/50">
                  <div className="w-3 h-3 border-2 border-brand-cyan/30 border-t-brand-cyan rounded-full animate-spin" />
                </div>
              </div>
            ) : user ? (
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                  "flex items-center gap-3 glass py-1.5 px-3 rounded-full hover:border-brand-cyan/30 transition-all cursor-pointer group",
                  isDropdownOpen && "border-brand-cyan/50 bg-ocean-800/80"
                )}
              >
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    {profile?.role === 'admin' && (
                      <span className="text-[8px] font-black text-white bg-brand-cyan py-0.5 px-1.5 rounded-sm tracking-widest uppercase">Admin</span>
                    )}
                    <span className="text-xs font-bold text-white group-hover:text-brand-cyan transition-colors">
                      {profile?.display_name || user?.email?.split('@')[0] || "Authenticated"}
                    </span>
                  </div>
                  <span className="text-[10px] text-brand-cyan uppercase font-bold tracking-tight">
                    {profile?.certification_level || "Initial Access"}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-ocean-800 flex items-center justify-center border border-ocean-600 overflow-hidden group-hover:border-brand-cyan/50 transition-colors">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-ocean-300" />
                  )}
                </div>
              </button>
            ) : (
              <Link href="/auth/login" className="flex items-center gap-3 glass py-1.5 px-3 rounded-full hover:border-brand-cyan/30 transition-colors cursor-pointer group">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-white group-hover:text-brand-cyan transition-colors">Guest Diver</span>
                  <span className="text-[10px] text-brand-cyan uppercase font-bold tracking-tight text-glow-cyan">Sign In</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-ocean-800 flex items-center justify-center border border-ocean-600 overflow-hidden group-hover:border-brand-cyan/50 transition-colors">
                  <User className="w-4 h-4 text-ocean-300" />
                </div>
              </Link>
            )}

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 glass-card rounded-2xl border border-ocean-800/80 bg-ocean-950/90 backdrop-blur-xl shadow-2xl p-2 z-[100]"
                >
                  <div className="px-3 py-2 mb-2 border-b border-ocean-800/30">
                    <p className="text-[9px] font-black text-ocean-500 uppercase tracking-widest">Active Mission</p>
                    <p className="text-xs font-bold text-white truncate">{profile?.display_name || user?.email}</p>
                  </div>

                  <div className="space-y-0.5">
                    {!profile && (
                      <Link 
                        href="/onboarding"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-black text-brand-cyan bg-brand-cyan/5 border border-brand-cyan/20 hover:bg-brand-cyan/10 transition-all group mb-2"
                      >
                        <Zap className="w-4 h-4 animate-pulse" />
                        Complete Profile
                      </Link>
                    )}
                    {[
                      { href: "/profile", label: "Profile Hub", icon: User },
                      { href: "/profile/gear", label: "Gear Vault", icon: Activity },
                      { href: "/tools", label: "Abyss Tools", icon: Compass },
                      { href: "/settings", label: "Fleet Settings", icon: Settings },
                    ].map(item => (
                      <Link 
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-ocean-300 hover:text-white hover:bg-white/5 transition-all group"
                      >
                        <item.icon className="w-4 h-4 group-hover:text-brand-cyan transition-colors" />
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-ocean-800/30">
                    <button 
                      onClick={() => logout()}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all group"
                    >
                      <LogOut className="w-4 h-4" />
                      Abort Mission (Sign Out)
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </nav>
  );
}
