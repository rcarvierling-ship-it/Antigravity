"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, BookOpen, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/logbook", label: "Logs", icon: BookOpen },
    { href: "/social", label: "Social", icon: Users },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-card rounded-t-3xl border-t border-ocean-800/30 safe-area-bottom">
      <div className="flex items-center justify-around p-3">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className="relative flex flex-col items-center justify-center w-16 h-12"
            >
              {isActive && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-brand-cyan/10 rounded-2xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <link.icon 
                className={cn(
                  "w-6 h-6 mb-1 z-10 transition-colors duration-300", 
                  isActive ? "text-brand-cyan drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" : "text-ocean-400"
                )} 
              />
              <span 
                className={cn(
                  "text-[10px] z-10 font-medium transition-colors duration-300",
                  isActive ? "text-brand-cyan" : "text-ocean-400"
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
