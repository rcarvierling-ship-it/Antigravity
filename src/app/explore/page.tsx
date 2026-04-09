"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, SlidersHorizontal, MapPin, List, Map as MapIcon } from "lucide-react";
import { SiteDetailModal } from "@/components/explore/SiteDetailModal";
import { MapListToggle } from "@/components/explore/MapListToggle";
import { SiteFilterBar } from "@/components/explore/SiteFilterBar";

import diveSites from "@/lib/data/dive-sites.json";

// Prevent server-side rendering of the Leaflet map
const MapComponent = dynamic(() => import("@/components/explore/MapComponent"), { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-ocean-950 text-ocean-400">Loading Map...</div> });

const defaultCenter: [number, number] = [20.0, 0.0];

export default function ExplorePage() {
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setMapCenter([position.coords.latitude, position.coords.longitude]),
        (error) => console.warn("Geolocation error:", error)
      );
    }
  }, []);

  const filteredMarkers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return diveSites.filter(site => {
      const matchesSearch = site.name.toLowerCase().includes(query) ||
                          site.country.toLowerCase().includes(query) ||
                          site.region.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === "All" || site.type === selectedCategory;
      return matchesSearch && matchesCategory;
    }).map(site => ({
      key: site.key,
      position: { lat: site.lat, lng: site.lng },
      name: site.name,
      type: site.type,
      region: site.region,
      country: site.country,
      skill: site.skill || 'Intermediate',
      depth: site.depth
    }));
  }, [searchQuery, selectedCategory]);

  return (
    <main className="w-full grid grid-cols-1 md:grid-cols-[400px_1fr] overflow-hidden" style={{ height: "calc(100vh - 73px)" }}>
      
      {/* Sidebar Panel */}
      <div className={`z-10 bg-deep-sea border-r border-ocean-800/50 flex flex-col h-full overflow-hidden shadow-2xl transition-transform duration-300 md:translate-x-0 ${mobileView === "list" ? "translate-x-0" : "-translate-x-full md:translate-x-0 absolute md:relative w-full md:w-auto h-full"}`}>
        <div className="p-5 h-full flex flex-col pt-10 md:pt-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h1 className="text-2xl font-black text-white tracking-tight">Explore Sites</h1>
            <button className="p-2 glass rounded-xl text-ocean-400 hover:text-white transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
          
          <div className="relative flex items-center mb-4 shrink-0 px-1">
            <Search className="absolute left-4 w-4 h-4 text-ocean-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination or site..." 
              className="w-full bg-ocean-950/80 border border-ocean-700/60 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-ocean-600 focus:outline-none focus:border-brand-cyan transition-all text-sm font-medium"
            />
          </div>

          <SiteFilterBar activeCategory={selectedCategory} onSelect={setSelectedCategory} />

          <div className="flex items-center justify-between mb-4 shrink-0 px-1 mt-2">
            <p className="text-[10px] text-ocean-500 font-bold tracking-widest uppercase">
              {filteredMarkers.length} Dive Spots
            </p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4 pr-1 pb-24">
            {filteredMarkers.map(m => (
              <div 
                key={m.key} 
                onClick={() => {
                  setMapCenter([m.position.lat, m.position.lng]);
                  setSelectedSite(m);
                  if (window.innerWidth < 768) setMobileView("map");
                }}
                className={`glass-card p-5 rounded-3xl cursor-pointer transition-all duration-300 group border-2 ${selectedSite?.key === m.key ? 'border-brand-cyan/60 bg-brand-cyan/5 shadow-[0_0_20px_rgba(0,229,255,0.1)]' : 'border-transparent hover:border-ocean-700/50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-black text-lg group-hover:text-brand-cyan transition-colors truncate pr-2">{m.name}</h3>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <span className="text-[10px] font-bold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-lg border border-brand-teal/20 tracking-wide uppercase">{m.type}</span>
                   <span className="text-[10px] font-bold text-ocean-400">|</span>
                   <span className="text-[10px] font-bold text-ocean-300 uppercase tracking-widest">{m.skill}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <p className="text-ocean-400 flex items-center gap-1.5 truncate max-w-[70%]">
                    <MapPin className="w-3.5 h-3.5 text-ocean-600" /> {m.region}
                  </p>
                  <p className="text-brand-cyan/80">{Math.round(m.depth * 3.28)}ft</p>
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
