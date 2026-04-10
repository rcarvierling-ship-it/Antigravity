"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Heart, Share2, MapPin, Calendar, Users, Camera, UserPlus, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function SocialPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('feed');
  const [buddies, setBuddies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBuddies() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Suggest buddies: same country or same cert level, not already binned
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id)
        .limit(10);
      
      if (profiles) setBuddies(profiles);
      setLoading(false);
    }
    fetchBuddies();
  }, [supabase]);

  const feedPosts = [
    {
      id: 1,
      user: "Reese Vierling",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Reese",
      time: "2h ago",
      location: "Great Blue Hole, Belize",
      content: "Descending into the abyss today. Visibility was crystal clear at 30m. Saw a massive group of reef sharks hanging near the rim.",
      image: "https://images.unsplash.com/photo-1544551763-47a0159291f2?auto=format&fit=crop&q=80&w=2070",
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      user: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      time: "5h ago",
      location: "Molasses Reef, Florida",
      content: "Perfect conditions for a night dive. The bioluminescence was incredible!",
      likes: 18,
      comments: 2
    }
  ];

  return (
    <main className="w-full min-h-screen px-4 md:px-8 py-8 pt-24 md:pt-12 pb-24 bg-deep-sea">
      <div className="max-w-2xl mx-auto">
        
        {/* Header & Tabs */}
        <div className="flex items-center justify-between mb-8 sticky top-20 z-40 bg-deep-sea/80 backdrop-blur-md py-4 rounded-3xl px-2">
          <div className="flex bg-ocean-900/50 p-1.5 rounded-2xl w-full border border-ocean-800/50">
            <button 
              onClick={() => setActiveTab('feed')}
              className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === "feed" ? "bg-ocean-800 text-brand-cyan shadow-lg shadow-brand-cyan/10" : "text-ocean-400 hover:text-white"}`}
            >
              Mission Feed
            </button>
            <button 
              onClick={() => setActiveTab('buddy')}
              className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === "buddy" ? "bg-ocean-800 text-brand-teal shadow-lg shadow-brand-teal/10" : "text-ocean-400 hover:text-white"}`}
            >
              Squad Discovery
            </button>
          </div>
        </div>

        {/* FEED CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === 'feed' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Create Post */}
              <div className="glass-card p-4 rounded-3xl flex items-center gap-4 border-ocean-700/30">
                <div className="w-10 h-10 rounded-full bg-ocean-800 flex-shrink-0 ml-1 border border-ocean-700/50" />
                <input type="text" placeholder="Share your latest telemetry..." className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-ocean-500 text-sm font-medium" />
                <button className="p-2 text-brand-cyan hover:bg-brand-cyan/10 rounded-full transition">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              {feedPosts.map(post => (
                <div key={post.id} className="glass-card border-ocean-800/20 rounded-3xl overflow-hidden group">
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full border border-ocean-700" />
                      <div>
                        <h3 className="text-white font-bold text-sm tracking-wide group-hover:text-brand-cyan transition-colors">{post.user}</h3>
                        <p className="text-[10px] text-ocean-500 font-bold uppercase tracking-widest flex items-center gap-1">
                          {post.time} <span className="text-ocean-800">•</span> <MapPin className="w-3 h-3 text-brand-teal" /> {post.location}
                        </p>
                      </div>
                    </div>
                    <button className="text-ocean-600 hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="px-5 pb-4 text-ocean-100/90 text-[13px] leading-relaxed">{post.content}</p>
                  
                  {post.image && (
                    <div className="w-full h-72 md:h-96 relative overflow-hidden">
                      <img src={post.image} alt="Dive photo" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-sea/40 to-transparent" />
                    </div>
                  )}
                  
                  <div className="p-4 bg-ocean-950/30 border-t border-ocean-800/10 flex items-center justify-between">
                    <div className="flex gap-6">
                      <button className="flex items-center gap-2 text-ocean-400 hover:text-brand-cyan transition text-[11px] font-black uppercase tracking-widest">
                        <Heart className={`w-4 h-4 ${post.likes > 20 ? "fill-brand-cyan text-brand-cyan" : ""}`} /> {post.likes}
                      </button>
                      <button className="flex items-center gap-2 text-ocean-400 hover:text-white transition text-[11px] font-black uppercase tracking-widest">
                        <MessageSquare className="w-4 h-4" /> {post.comments}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* BUDDY FINDER */}
          {activeTab === 'buddy' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between px-2">
                 <h2 className="text-[11px] font-black text-ocean-500 uppercase tracking-[0.3em]">Potential Divers Nearby</h2>
                 <button className="text-ocean-500 hover:text-brand-teal transition-colors">
                    <Filter className="w-4 h-4" />
                 </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {buddies.map(profile => (
                  <div key={profile.id} className="glass-card p-5 rounded-3xl relative overflow-hidden group hover:border-brand-teal/40 transition-all active:scale-[0.98]">
                    <div className="absolute top-0 right-0 bg-brand-teal/10 text-brand-teal px-3 py-1 rounded-bl-2xl text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-md border-l border-b border-brand-teal/20">
                      {profile.certification_level || "No Cert"}
                    </div>
                    
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <img 
                          src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                          alt={profile.display_name} 
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-ocean-800 group-hover:border-brand-teal/50 transition-colors" 
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-deep-sea shadow-sm" />
                      </div>
                      <div className="pt-1">
                        <h3 className="text-white font-bold text-sm tracking-wide">{profile.display_name || profile.username}</h3>
                        <p className="text-[10px] text-ocean-400 font-bold uppercase tracking-widest flex items-center gap-1">
                           <MapPin className="w-3 h-3 text-brand-teal" /> {profile.home_country || "Global"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-5 px-1">
                       <div>
                          <p className="text-[9px] text-ocean-500 font-black uppercase tracking-widest mb-0.5">Total Dives</p>
                          <p className="text-sm font-bold text-white leading-none">{profile.total_dives || 0}</p>
                       </div>
                       <div>
                          <p className="text-[9px] text-ocean-500 font-black uppercase tracking-widest mb-0.5">Exp Level</p>
                          <p className="text-sm font-bold text-brand-teal leading-none">Advanced</p>
                       </div>
                    </div>

                    <button className="w-full py-3 rounded-xl bg-ocean-900 border border-ocean-700/50 hover:bg-brand-teal hover:border-brand-teal hover:text-deep-sea text-white font-black uppercase tracking-widest transition-all text-[10px] flex items-center justify-center gap-2">
                      <UserPlus className="w-3 h-3" /> Initiate Link
                    </button>
                  </div>
                ))}
              </div>

              {buddies.length === 0 && !loading && (
                <div className="py-20 text-center border-2 border-dashed border-ocean-800 rounded-3xl">
                   <Users className="w-10 h-10 text-ocean-800 mx-auto mb-4" />
                   <p className="text-sm text-ocean-600 font-bold uppercase tracking-widest">No divers found in this sector</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
