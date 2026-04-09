"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { SiteDetailModal } from "@/components/explore/SiteDetailModal";

import diveSites from "@/lib/data/dive-sites.json";

// Prevent server-side rendering of the Leaflet map
const MapComponent = dynamic(() => import("@/components/explore/MapComponent"), { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-ocean-950 text-ocean-400">Loading Map...</div> });

const defaultCenter: [number, number] = [20.0, 0.0];

export default function ExplorePage() {
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSite, setSelectedSite] = useState<any>(null);

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
    return diveSites.filter(site => 
      site.name.toLowerCase().includes(query) ||
      site.country.toLowerCase().includes(query) ||
      site.region.toLowerCase().includes(query) ||
      site.type.toLowerCase().includes(query)
    ).map(site => ({
      key: site.key,
      position: { lat: site.lat, lng: site.lng },
      name: site.name,
      type: site.type,
      region: site.region,
      country: site.country,
      skill: site.skill || 'Intermediate'
    }));
  }, [searchQuery]);

  return (
    <main className="w-full grid grid-cols-1 md:grid-cols-[380px_1fr] overflow-hidden" style={{ height: "calc(100vh - 73px)" }}>
      
      {/* Sidebar Panel */}
      <div className="z-10 bg-deep-sea border-r border-ocean-800/50 flex flex-col h-full overflow-hidden shadow-2xl">
        <div className="p-5 h-full flex flex-col pt-6 overflow-hidden">
          <h1 className="text-2xl font-bold text-white mb-6 mt-2 hidden md:block shrink-0">Explore Sites</h1>
          
          <div className="relative flex items-center mb-6 shrink-0">
            <Search className="absolute left-3 w-5 h-5 text-ocean-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..." 
              className="w-full bg-ocean-950/80 border border-ocean-700/60 rounded-full py-3 pl-11 pr-4 text-white placeholder-ocean-400 focus:outline-none focus:border-brand-cyan transition-colors"
            />
          </div>

          <p className="text-xs text-brand-cyan mb-3 font-semibold tracking-wider uppercase px-1">
            {filteredMarkers.length} Sites Found
          </p>

          <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-3 pr-1 pb-4">
            {filteredMarkers.map(m => (
              <div 
                key={m.key} 
                onClick={() => {
                  setMapCenter([m.position.lat, m.position.lng]);
                  setSelectedSite(m);
                }}
                className={`glass p-4 rounded-xl cursor-pointer transition-colors group border ${selectedSite?.key === m.key ? 'border-brand-cyan bg-white/10' : 'border-transparent hover:border-brand-cyan/40 hover:bg-white/5'}`}
              >
                <h3 className="text-white font-bold mb-1 group-hover:text-brand-cyan transition-colors truncate">{m.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs font-medium text-ocean-300 truncate max-w-[60%]">
                    {m.country}
                  </p>
                  <p className="text-[10px] text-brand-teal flex items-center gap-1 bg-brand-teal/10 px-2 py-0.5 rounded-full border border-brand-teal/20 whitespace-nowrap">
                    <MapPin className="w-3 h-3" /> {m.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full relative h-[calc(100vh-140px)] md:h-full bg-ocean-950 z-0 flex overflow-hidden">
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
      </div>

    </main>
  );
}
