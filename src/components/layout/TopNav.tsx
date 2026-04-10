"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookOpen, Users, Bell, User, Waves, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export function TopNav() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("display_name, certification_level, avatar_url, role")
          .eq("id", user.id)
          .single();
        
        if (data) {
          setProfile(data);
        }
      }
      setLoading(false);
    }

    getProfile();
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
          
          <Link href={profile ? "/profile" : "/auth/login"} className="flex items-center gap-3 glass py-1.5 px-3 rounded-full hover:border-brand-cyan/30 transition-colors cursor-pointer group">
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-1.5 justify-end">
                {profile?.role === 'admin' && (
                  <span className="text-[8px] font-black text-white bg-brand-cyan py-0.5 px-1.5 rounded-sm tracking-widest uppercase">Admin</span>
                )}
                <span className="text-xs font-bold text-white group-hover:text-brand-cyan transition-colors">
                  {loading ? "..." : profile?.display_name || "Guest Diver"}
                </span>
              </div>
              <span className="text-[10px] text-brand-cyan uppercase font-bold tracking-tight">
                {loading ? "..." : profile?.certification_level || "No Rank"}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-ocean-800 flex items-center justify-center border border-ocean-600 overflow-hidden group-hover:border-brand-cyan/50 transition-colors">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-ocean-300" />
              )}
            </div>
          </Link>
        </div>

      </div>
    </nav>
  );
}
