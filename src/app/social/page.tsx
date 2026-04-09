"use client";

import { useState } from "react";
import { MessageSquare, Heart, Share2, MapPin, Calendar, Users, Camera } from "lucide-react";
import Image from "next/image";

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState('feed');

  const feedPosts: any[] = [];

  const buddyPosts: any[] = [];

  return (
    <main className="w-full min-h-screen px-4 md:px-8 py-8 pt-24 md:pt-12 pb-24">
      <div className="max-w-2xl mx-auto">
        
        {/* Header & Tabs */}
        <div className="flex items-center justify-between mb-8 sticky top-20 z-40 bg-deep-sea/80 backdrop-blur-md py-4 rounded-3xl px-2">
          <div className="flex bg-ocean-900/50 p-1.5 rounded-2xl w-full">
            <button 
              onClick={() => setActiveTab('feed')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "feed" ? "bg-ocean-800 text-white shadow-md" : "text-ocean-400 hover:text-white"}`}
            >
              Social Feed
            </button>
            <button 
              onClick={() => setActiveTab('buddy')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "buddy" ? "bg-ocean-800 text-white shadow-md text-glow-cyan" : "text-ocean-400 hover:text-white"}`}
            >
              Find Buddy
            </button>
          </div>
        </div>

        {/* FEED CONTENT */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            
            {/* Create Post */}
            <div className="glass-card p-4 rounded-3xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-ocean-800 flex-shrink-0 ml-1" />
              <input type="text" placeholder="Share your latest dive..." className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-ocean-400 text-sm" />
              <button className="p-2 text-brand-cyan hover:bg-brand-cyan/10 rounded-full transition">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {feedPosts.map(post => (
              <div key={post.id} className="glass border-ocean-800/30 rounded-3xl overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full border border-ocean-600" />
                    <div>
                      <h3 className="text-white font-bold text-sm tracking-wide">{post.user}</h3>
                      <p className="text-[10px] text-ocean-400">{post.time} • <MapPin className="inline w-3 h-3 text-brand-cyan ml-1" /> {post.location}</p>
                    </div>
                  </div>
                </div>
                
                <p className="px-4 pb-3 text-ocean-100 text-sm">{post.content}</p>
                
                {post.image && (
                  <div className="w-full h-64 md:h-80 relative">
                    <img src={post.image} alt="Dive photo" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="p-4 border-t border-ocean-800/30 flex items-center justify-between">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1.5 text-ocean-300 hover:text-brand-cyan transition text-xs font-semibold">
                      <Heart className="w-4 h-4" /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-ocean-300 hover:text-white transition text-xs font-semibold">
                      <MessageSquare className="w-4 h-4" /> {post.comments}
                    </button>
                  </div>
                  <button className="text-ocean-300 hover:text-white">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BUDDY FINDER */}
        {activeTab === 'buddy' && (
          <div className="space-y-4">
            <button className="w-full bg-ocean-800 hover:bg-ocean-700 py-4 rounded-2xl text-brand-cyan font-bold flex justify-center items-center gap-2 transition-colors border border-brand-cyan/20 box-glow-cyan">
              <Users className="w-5 h-5" /> Post Buddy Request
            </button>

            {buddyPosts.map(post => (
              <div key={post.id} className="glass-card p-5 rounded-3xl relative overflow-hidden group hover:border-brand-cyan/40 transition-colors">
                <div className="absolute top-0 right-0 bg-brand-cyan/20 text-brand-cyan px-3 py-1 rounded-bl-2xl text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  {post.spots}
                </div>
                
                <div className="flex items-start gap-4 mb-4">
                  <img src={post.avatar} alt={post.user} className="w-12 h-12 rounded-full border-2 border-brand-teal mt-1" />
                  <div>
                    <h3 className="text-white font-bold">{post.user}</h3>
                    <p className="text-xs text-brand-teal font-semibold">{post.cert}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-ocean-100 text-sm leading-relaxed">{post.seeking}</p>
                  <div className="flex flex-wrap gap-2 text-[11px] text-ocean-300 font-medium">
                    <span className="flex items-center gap-1 bg-ocean-900/50 px-2 py-1 rounded-md"><MapPin className="w-3 h-3 text-ocean-400" /> {post.location}</span>
                    <span className="flex items-center gap-1 bg-ocean-900/50 px-2 py-1 rounded-md"><Calendar className="w-3 h-3 text-ocean-400" /> {post.date}</span>
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors text-sm">
                  Send Message
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
