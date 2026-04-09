"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, BookOpen, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Abyss", icon: Home },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/logbook", label: "Logs", icon: BookOpen },
    { href: "/profile/gear", label: "Gear", icon: Zap },
    { href: "/profile", label: "Me", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-card rounded-t-[2.5rem] border-t border-brand-cyan/20 px-6 pb-6 pt-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className="relative flex flex-col items-center justify-center p-2 min-w-[60px]"
            >
              <div className={cn(
                "p-2 rounded-2xl transition-all duration-300 relative",
                isActive ? "bg-brand-cyan/10" : "hover:bg-white/5"
              )}>
                {isActive && (
                  <motion.div 
                    layoutId="navTab"
                    className="absolute inset-0 border border-brand-cyan/30 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <link.icon 
                  className={cn(
                    "w-6 h-6 transition-all duration-300", 
                    isActive ? "text-brand-cyan drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]" : "text-ocean-500"
                  )} 
                />
              </div>
              <span 
                className={cn(
                  "text-[9px] mt-1 font-black uppercase tracking-widest transition-colors duration-300 scale-90",
                  isActive ? "text-brand-cyan" : "text-ocean-600"
                )}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
