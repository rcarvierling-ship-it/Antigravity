"use client";

import { MapPin, ShieldCheck, Zap, UserPlus, Check, MessageSquare, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DiverProfileCardProps {
  profile: any;
  compatibility?: number;
  onInvite: (id: string) => void;
  isInvited?: boolean;
}

export function DiverProfileCard({ profile, compatibility = 0, onInvite, isInvited }: DiverProfileCardProps) {
  const specialties = profile.specialties || [];
  
  return (
    <div className="glass-card p-6 rounded-[2.5rem] relative overflow-hidden group hover:border-brand-teal/40 transition-all active:scale-[0.98]">
      {/* Compatibility Badge */}
      <div className="absolute top-0 right-0 bg-brand-teal/10 text-brand-teal px-4 py-1.5 rounded-bl-[1.5rem] text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-md border-l border-b border-brand-teal/20 flex items-center gap-1.5">
        <Zap className="w-3 h-3 fill-brand-teal" />
        {Math.round(compatibility * 100)}% Match
      </div>

      <div className="flex items-start gap-5 mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-ocean-900 border-2 border-ocean-800 overflow-hidden group-hover:border-brand-teal/50 transition-colors">
             <img 
               src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
               alt={profile.display_name} 
               className="w-full h-full object-cover" 
             />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-deep-sea shadow-sm" />
        </div>
        
        <div className="pt-1">
          <h3 className="text-white font-black text-lg tracking-tight group-hover:text-brand-cyan transition-colors">
            {profile.display_name || profile.username}
          </h3>
          <p className="text-[10px] text-ocean-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
             <MapPin className="w-3 h-3 text-brand-teal" /> {profile.home_country || "Global"}
          </p>
        </div>
      </div>

      {/* Skills & Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
         <div className="bg-ocean-950/40 p-3 rounded-2xl border border-ocean-800/30">
            <p className="text-[8px] text-ocean-500 font-black uppercase tracking-widest mb-1">Rank</p>
            <p className="text-xs font-bold text-brand-cyan truncate">{profile.certification_level || "No Rank"}</p>
         </div>
         <div className="bg-ocean-950/40 p-3 rounded-2xl border border-ocean-800/30 text-right">
            <p className="text-[8px] text-ocean-500 font-black uppercase tracking-widest mb-1">Total Dives</p>
            <p className="text-xs font-bold text-white">{profile.total_dives || 0}</p>
         </div>
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-2 mb-8 min-h-[48px]">
        {specialties.length > 0 ? (
          specialties.slice(0, 3).map((s: string) => (
            <span key={s} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-white uppercase tracking-tighter">
              {s}
            </span>
          ))
        ) : (
          <span className="text-[8px] text-ocean-700 font-black uppercase tracking-widest flex items-center gap-1">
            <Star className="w-2.5 h-2.5" /> General Operations
          </span>
        )}
      </div>

      <button 
        onClick={() => onInvite(profile.id)}
        disabled={isInvited}
        className={cn(
          "w-full py-3.5 rounded-2xl font-black uppercase tracking-widest transition-all text-[10px] flex items-center justify-center gap-2",
          isInvited 
            ? "bg-ocean-800 text-ocean-500 cursor-default border border-ocean-700/30"
            : "bg-brand-teal text-deep-sea hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:scale-[1.02]"
        )}
      >
        {isInvited ? (
          <>
            <Check className="w-3 h-3" /> Transmitting Request
          </>
        ) : (
          <>
            <UserPlus className="w-3 h-3" /> Partner Discovery
          </>
        )}
      </button>

      {/* Hover Message Icon */}
      <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
         <MessageSquare className="w-3 h-3 text-brand-teal" />
      </div>
    </div>
  );
}
