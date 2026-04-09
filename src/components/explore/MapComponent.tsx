"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";

// Fix for default marker icons in Leaflet when using React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Custom icon using L.divIcon to guarantee rendering without SVG string parsing bugs
const customIcon = L.divIcon({
  className: "custom-leaflet-marker",
  html: `<div style="width: 14px; height: 14px; background-color: #00e5ff; border: 2px solid #0a111a; border-radius: 50%; box-shadow: 0 0 12px 1px rgba(0,229,255,0.7);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
});

import { useState } from "react";
import { SiteDetailModal } from "@/components/explore/SiteDetailModal";

function MapUpdater({ center, markers }: { center: [number, number], markers: any[] }) {
  const map = useMap();

  // Watch for explicit center changes (clicks or geolocation)
  useEffect(() => {
    map.flyTo(center, Math.max(map.getZoom(), 5), { animate: true, duration: 1.5 });
  }, [center, map]);

  // Watch for search query filtering changes
  useEffect(() => {
    if (markers && markers.length > 0) {
      if (markers.length === 1) {
        map.flyTo([markers[0].position.lat, markers[0].position.lng], 8, { animate: true, duration: 1.5 });
      } else {
        const bounds = L.latLngBounds(markers.map(m => [m.position.lat, m.position.lng]));
        map.flyToBounds(bounds, { animate: true, duration: 1.5, padding: [50, 50] });
      }
    }
  }, [markers, map]);

  return null;
}

export default function MapComponent({ centers, markers, onSiteSelect }: any) {
  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={centers} 
        zoom={2} 
        style={{ height: "100%", width: "100%", background: "#0a111a", zIndex: 0 }} 
        zoomControl={true}
      >
        <MapUpdater center={centers} markers={markers} />
        {/* Premium dark map tiles from Carto */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {markers.map((marker: any) => (
          <Marker 
            key={marker.key} 
            position={[marker.position.lat, marker.position.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onSiteSelect && onSiteSelect(marker),
            }}
          />
        ))}
      </MapContainer>
      
      {/* Deep blue color overlay to tint the entire map to match our app aesthetic */}
      <div className="absolute inset-0 bg-brand-cyan/10 mix-blend-color pointer-events-none z-[400]" />
      <div className="absolute inset-0 bg-deep-sea/20 mix-blend-overlay pointer-events-none z-[400]" />
    </div>
  );
}
