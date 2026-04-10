"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Check, X, Bell, Zap, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function MissionAlerts() {
  const supabase = createClient();
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvites() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("buddy_invitations")
        .select(`
          *,
          sender:profiles!sender_id (
            display_name,
            username,
            avatar_url,
            certification_level,
            home_base
          )
        `)
        .eq("receiver_id", user.id)
        .eq("status", "pending");

      if (data) setInvites(data);
      setLoading(false);
    }

    fetchInvites();

    // Subscribe to changes
    const channel = supabase
      .channel("mission-alerts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "buddy_invitations" },
        () => fetchInvites()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleAction = async (inviteId: string, status: 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from("buddy_invitations")
      .update({ status })
      .eq("id", inviteId);

    if (!error) {
      setInvites(prev => prev.filter(i => i.id !== inviteId));
    }
  };

  if (invites.length === 0) return null;

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4 px-2">
         <h2 className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em] flex items-center gap-2">
           <Bell className="w-3 h-3 animate-pulse" /> Incoming Mission Requests
         </h2>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {invites.map((invite) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={invite.id}
              className="glass-card p-5 rounded-3xl border border-brand-teal/20 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-brand-teal/40 transition-all shadow-[0_0_30px_rgba(45,212,191,0.05)]"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-ocean-900 border border-ocean-800 overflow-hidden">
                    <img 
                      src={invite.sender?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${invite.sender?.username}`} 
                      alt="Sender" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-teal rounded-full flex items-center justify-center border-2 border-deep-sea">
                    <Zap className="w-2 h-2 text-deep-sea fill-deep-sea" />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-black text-white">{invite.sender?.display_name || invite.sender?.username}</h4>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[9px] text-brand-cyan font-black uppercase tracking-widest">{invite.sender?.certification_level}</span>
                    <span className="text-ocean-800">•</span>
                    <span className="text-[9px] text-ocean-500 font-bold uppercase flex items-center gap-1">
                      <MapPin className="w-2 h-2" /> {invite.sender?.home_base || "Global"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => handleAction(invite.id, 'rejected')}
                  className="flex-1 sm:flex-none p-3 rounded-xl bg-ocean-900/50 hover:bg-black/40 text-ocean-500 hover:text-red-400 border border-ocean-800 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleAction(invite.id, 'accepted')}
                  className="flex-[2] sm:flex-none py-3 px-6 rounded-xl bg-brand-teal text-deep-sea font-black uppercase text-[10px] tracking-widest hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> LINK PROFILE
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
