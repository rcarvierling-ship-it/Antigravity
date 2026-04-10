"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Search, Filter, ShieldCheck, Zap, ArrowRight, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DiverProfileCard } from "@/components/buddies/DiverProfileCard";

export default function BuddiesPage() {
  const supabase = createClient();
  const [me, setMe] = useState<any>(null);
  const [divers, setDivers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [invitingIds, setInvitingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, diversRes, invitesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("profiles").select("*").eq("buddy_availability", true).neq("id", user.id).limit(20),
        supabase.from("buddy_invitations").select("*").eq("sender_id", user.id)
      ]);

      if (profileRes.data) setMe(profileRes.data);
      if (diversRes.data) setDivers(diversRes.data);
      if (invitesRes.data) {
        setInvitingIds(new Set(invitesRes.data.map((inv: any) => inv.receiver_id)));
      }
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  const calculateCompatibility = (other: any) => {
    if (!me) return 0.5;
    
    // Dive count similarity (30%)
    const diveDiff = Math.abs((me.total_dives || 0) - (other.total_dives || 0));
    const maxDives = Math.max((me.total_dives || 0), (other.total_dives || 0), 1);
    const diveScore = 1 - (diveDiff / maxDives);

    // Cert level match (40%)
    const certScore = me.certification_level === other.certification_level ? 1 : 0.6;

    // Specialties overlap (30%)
    const mySpecs = me.specialties || [];
    const otherSpecs = other.specialties || [];
    const common = mySpecs.filter((s: string) => otherSpecs.includes(s));
    const specScore = otherSpecs.length > 0 ? (common.length / Math.max(otherSpecs.length, 1)) : 0.5;

    return (diveScore * 0.3) + (certScore * 0.4) + (specScore * 0.3);
  };

  const handleInvite = async (receiverId: string) => {
    if (invitingIds.has(receiverId)) return;

    setInvitingIds(prev => new Set(prev).add(receiverId));
    
    const { error } = await supabase
      .from("buddy_invitations")
      .insert({
        sender_id: me.id,
        receiver_id: receiverId,
        message: `Mission Request: Let's dive together!`
      });

    if (error) {
      console.error(error);
      setInvitingIds(prev => {
        const next = new Set(prev);
        next.delete(receiverId);
        return next;
      });
    }
  };

  const filteredDivers = divers.filter(d => 
    (d.display_name || d.username).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.home_country || "").toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => calculateCompatibility(b) - calculateCompatibility(a));

  return (
    <main className="w-full min-h-screen bg-deep-sea pt-24 pb-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-brand-teal fill-brand-teal" />
              <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em]">Compatibility Engine v2.0</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">Mission Partner Explorer</h1>
            <p className="text-ocean-400 mt-4 max-w-xl font-medium leading-relaxed">
              Find mission-compatible divers based on technical certification, depth experience, and regional deployment sensors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <div className="relative group min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-500 group-focus-within:text-brand-cyan transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by sector or callsign..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-ocean-950/50 border border-ocean-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-cyan transition-all w-full"
                />
             </div>
             <button className="p-3.5 bg-ocean-900 border border-ocean-800 rounded-2xl text-ocean-400 hover:text-white transition-all">
                <Filter className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Discovery Feed */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-[4/3] bg-ocean-900/40 rounded-[2.5rem] animate-pulse border border-ocean-800/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredDivers.map((diver) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={diver.id}
                >
                  <DiverProfileCard 
                    profile={diver} 
                    compatibility={calculateCompatibility(diver)} 
                    onInvite={handleInvite}
                    isInvited={invitingIds.has(diver.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty States */}
        {!loading && filteredDivers.length === 0 && (
          <div className="py-32 text-center bg-ocean-950/20 border-2 border-dashed border-ocean-800 rounded-[3rem]">
            <Users className="w-16 h-16 text-ocean-800 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-ocean-600">No Mission Partners Available</h3>
            <p className="text-ocean-700 text-sm mt-2 max-w-sm mx-auto uppercase tracking-widest font-black">
              Ensure your Mission Status is set to "Active Discovery" in your profile to find and be found.
            </p>
          </div>
        )}

        {/* Active Requests Sidebar Hint (Placeholder logic) */}
        {!loading && invitingIds.size > 0 && (
          <div className="fixed bottom-12 right-8 flex flex-col gap-2 z-[60]">
             <div className="bg-brand-teal text-deep-sea px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
                <Users className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {invitingIds.size} Pending Linked Requests
                </span>
             </div>
          </div>
        )}

      </div>
    </main>
  );
}
