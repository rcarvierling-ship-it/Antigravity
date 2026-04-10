"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Search, SlidersHorizontal, MapPin, List, Map as MapIcon, Plus, Trash2 } from "lucide-react";
import { SiteDetailModal } from "@/components/explore/SiteDetailModal";
import { MapListToggle } from "@/components/explore/MapListToggle";
import { SiteFilterBar } from "@/components/explore/SiteFilterBar";
import { createClient } from "@/lib/supabase/client";
import { ConditionsPreview } from "@/components/shared/ConditionsDisplay";

// Prevent server-side rendering of the Leaflet map
const MapComponent = dynamic(() => import("@/components/explore/MapComponent"), { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-ocean-950 text-ocean-400">Loading Map...</div> });

const defaultCenter: [number, number] = [20.0, 0.0];

export default function ExplorePage() {
  const supabase = createClient();
  const [dbSites, setDbSites] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        setCurrentUser({ ...user, role: profile?.role });
      }

      const { data: sites } = await supabase.from("dive_sites").select("*");
      if (sites) setDbSites(sites);
      setLoading(false);
    }

    initData();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setMapCenter([position.coords.latitude, position.coords.longitude]),
        (error) => console.warn("Geolocation error:", error)
      );
    }
  }, [supabase]);

  const filteredMarkers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return dbSites.filter(site => {
      const matchesSearch = site.name.toLowerCase().includes(query) ||
                          site.country.toLowerCase().includes(query) ||
                          site.region.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === "All" || site.dive_type === selectedCategory;
      return matchesSearch && matchesCategory;
    }).map(site => ({
      key: site.id,
      position: { lat: site.latitude, lng: site.longitude },
      name: site.name,
      type: site.dive_type,
      region: site.region,
      country: site.country,
      skill: site.skill_level || 'Intermediate',
      depth: site.max_depth_m,
      img: site.image_url
    }));
  }, [searchQuery, selectedCategory, dbSites]);

  const handleDeleteSite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to decommission this site from the global database?")) return;
    
    const { error } = await supabase.from("dive_sites").delete().eq("id", id);
    if (!error) {
       setDbSites(prev => prev.filter(s => s.id !== id));
       if (selectedSite?.key === id) setSelectedSite(null);
    }
  };

  return (
    <main className="w-full grid grid-cols-1 md:grid-cols-[400px_1fr] overflow-hidden bg-deep-sea relative" style={{ height: "calc(100vh - 73px)" }}>
      {/* HUD Background Grid */}
      <div className="absolute inset-0 hud-grid opacity-10 pointer-events-none z-0" />
      
      {/* Sidebar Panel */}
      <div className={`z-10 bg-deep-sea/80 backdrop-blur-xl border-r border-ocean-800/20 flex flex-col h-full overflow-hidden shadow-2xl transition-transform duration-300 md:translate-x-0 scan-line ${mobileView === "list" ? "translate-x-0" : "-translate-x-full md:translate-x-0 absolute md:relative w-full md:w-auto h-full"}`}>
        <div className="p-5 h-full flex flex-col pt-10 md:pt-6 overflow-hidden relative z-10">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-flicker" />
                  <span className="text-[8px] font-black text-brand-cyan uppercase tracking-[0.4em]">Satellite Link: Active</span>
               </div>
               <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Mission <span className="text-brand-cyan">Discovery</span></h1>
            </div>
            <Link href="/explore/new" className="p-3 bg-brand-cyan hover:bg-brand-cyan/80 text-deep-sea rounded-lg transition-all shadow-lg shadow-brand-cyan/20 active:scale-95 group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </Link>
          </div>
          
          <div className="relative flex items-center mb-6 shrink-0 px-1">
            <Search className="absolute left-4 w-4 h-4 text-ocean-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH BY COORDINATES OR NAME..." 
              className="w-full bg-ocean-950/50 border border-ocean-800/50 rounded-lg py-4 pl-11 pr-4 text-white placeholder-ocean-700 focus:outline-none focus:border-brand-cyan/50 transition-all text-[10px] font-black uppercase tracking-widest"
            />
          </div>

          <SiteFilterBar activeCategory={selectedCategory} onSelect={setSelectedCategory} />

          <div className="flex items-center justify-between mb-4 shrink-0 px-1 mt-6">
            <div className="flex items-center gap-2">
               <div className="w-1 h-1 rounded-full bg-brand-teal" />
               <p className="text-[8px] text-ocean-500 font-black tracking-[0.3em] uppercase">
                  {filteredMarkers.length} Visualized Hits
               </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4 pr-1 pb-24">
            {loading ? (
               <div className="flex-1 flex items-center justify-center opacity-20">
                  <div className="w-8 h-8 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin" />
               </div>
            ) : filteredMarkers.map(m => (
              <div 
                key={m.key} 
                onClick={() => {
                  setMapCenter([m.position.lat, m.position.lng]);
                  setSelectedSite(m);
                  if (window.innerWidth < 768) setMobileView("map");
                }}
                className={`glass-card p-6 rounded-xl cursor-pointer transition-all duration-300 group border-2 ${selectedSite?.key === m.key ? 'border-brand-cyan/60 bg-brand-cyan/5 shadow-[0_0_40px_rgba(0,229,255,0.05)]' : 'border-white/5 hover:border-ocean-800/50'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white font-black text-lg group-hover:text-brand-cyan transition-colors truncate pr-2 tracking-tighter uppercase leading-none">{m.name}</h3>
                  {currentUser?.role === 'admin' && (
                    <button 
                      onClick={(e) => handleDeleteSite(m.key, e)}
                      className="p-1.5 text-ocean-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-4">
                   <span className="text-[8px] font-black text-brand-teal bg-brand-teal/5 px-2 py-1 rounded border border-brand-teal/20 tracking-[0.2em] uppercase">{m.type}</span>
                   <span className="text-[8px] font-black text-ocean-400 uppercase tracking-[0.2em]">{m.skill}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black mb-4 uppercase tracking-widest text-ocean-300">
                  <p className="flex items-center gap-1.5 truncate max-w-[70%]">
                    <MapPin className="w-3.5 h-3.5 text-ocean-600" /> {m.country}
                  </p>
                  <p className="text-brand-cyan text-glow-cyan leading-none">{Math.round(m.depth * 3.28)}FT MAX</p>
                </div>

                {/* Real-time Telemetry Preview */}
                <div className="pt-4 border-t border-ocean-800/20">
                   <ConditionsPreview lat={m.position.lat} lng={m.position.lng} country={m.country} type={m.type} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className={`w-full relative h-full bg-ocean-950 z-0 flex overflow-hidden transition-opacity duration-300 ${mobileView === "map" ? "opacity-100" : "opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto"}`}>
        <div className="absolute inset-0">
          <MapComponent 
            centers={mapCenter} 
            markers={filteredMarkers} 
            onSiteSelect={(site: any) => {
              setMapCenter([site.position.lat, site.position.lng]);
              setSelectedSite(site);
            }} 
          />
        </div>
        
        <SiteDetailModal site={selectedSite} onClose={() => setSelectedSite(null)} />
        
        {!selectedSite && <MapListToggle view={mobileView} onToggle={setMobileView} />}
      </div>

    </main>
  );
}
