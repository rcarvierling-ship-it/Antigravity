"use client";

import Link from "next/link";
import { Anchor, Mail, Globe } from "lucide-react";

export function DarkFooter() {
  return (
    <footer className="w-full bg-deep-sea pt-20 pb-10 border-t border-ocean-900 overflow-hidden relative">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 relative z-10">
        
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-teal flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Anchor className="w-5 h-5 text-deep-sea transform -rotate-45" />
            </div>
            <span className="text-xl font-black text-white tracking-widest uppercase italic">Abyss</span>
          </div>
          <p className="text-ocean-400 text-sm leading-relaxed mb-8 font-medium">
            The definitive platform for technical divers. Precision tracking, global discovery, and community-driven safety protocols.
          </p>
          <div className="flex items-center gap-4">
          </div>
        </div>

        <div className="md:col-span-1">
          <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-6">Exploration</h4>
          <ul className="space-y-4">
            <li><Link href="/explore" className="text-ocean-400 text-sm font-medium hover:text-brand-cyan transition-colors">Global Map</Link></li>
            <li><Link href="/explore" className="text-ocean-400 text-sm font-medium hover:text-brand-cyan transition-colors">Popular Sites</Link></li>
            <li><Link href="/explore" className="text-ocean-400 text-sm font-medium hover:text-brand-cyan transition-colors">Wreck Discovery</Link></li>
            <li><Link href="/explore" className="text-ocean-400 text-sm font-medium hover:text-brand-cyan transition-colors">Marine Sanctuaries</Link></li>
          </ul>
        </div>

        <div className="md:col-span-1">
          <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-6">Mission Control</h4>
          <ul className="space-y-4">
            <li><Link href="/logbook" className="text-ocean-400 text-sm font-medium hover:text-brand-cyan transition-colors">My Logbook</Link></li>
            <li><Link href="/analytics" className="text-ocean-400 text-sm font-medium hover:text-brand-cyan transition-colors">Technical Charts</Link></li>
            <li><Link href="/profile/gear" className="text-ocean-400 text-sm font-medium hover:text-brand-cyan transition-colors">Gear Vault</Link></li>
            <li><Link href="/buddies" className="text-ocean-400 text-sm font-medium hover:text-brand-cyan transition-colors">Buddy Search</Link></li>
          </ul>
        </div>

        <div className="md:col-span-1">
          <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-6">Support Ops</h4>
          <div className="glass-card p-4 rounded-xl border-ocean-800/50 mb-4">
            <p className="text-[10px] text-ocean-400 font-black uppercase tracking-widest mb-3">Satellite Status: Active</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
              <span className="text-xs text-brand-teal font-black uppercase">Mission Node 1.0</span>
            </div>
          </div>
          <Link href="mailto:ops@abyss.com" className="flex items-center gap-2 text-ocean-300 hover:text-brand-cyan transition-colors text-sm font-medium">
            <Mail className="w-4 h-4" /> ops@abyss.com
          </Link>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 border-t border-ocean-900 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <p className="text-ocean-600 text-[10px] font-black uppercase tracking-[0.4em]">
           © 2026 ABYSS MISSION COMMAND. SECURE_PROTOCOL_V1
        </p>
        <div className="flex items-center gap-8">
          <Link href="#" className="text-ocean-700 text-[10px] font-black uppercase tracking-widest hover:text-ocean-400 transition-colors">Privacy Data</Link>
          <Link href="#" className="text-ocean-700 text-[10px] font-black uppercase tracking-widest hover:text-ocean-400 transition-colors">Deployment Terms</Link>
          <div className="flex items-center gap-1.5 text-ocean-700">
            <Globe className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-widest">Global Ops</span>
          </div>
        </div>
      </div>

      {/* Ambient Footer Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-brand-cyan/5 blur-[120px] pointer-events-none" />

    </footer>
  );
}
