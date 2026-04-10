"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ArrowLeft, Camera, ShieldCheck, Globe, Gauge, Waves, Navigation } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export default function NewDiveSite() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    region: "",
    latitude: "",
    longitude: "",
    max_depth_m: "",
    dive_type: "Reef",
    skill_level: "Intermediate",
    short_description: "",
    image_url: ""
  });

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData(prev => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6)
        }));
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Authentication required for global telemetry broadcast.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("dive_sites").insert([
      {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        max_depth_m: parseInt(formData.max_depth_m),
        created_by: user.id
      }
    ]);

    if (error) {
      console.error(error);
      alert("Broadcast failed: " + error.message);
    } else {
      router.push("/explore");
    }
    setLoading(false);
  };

  return (
    <main className="w-full min-h-screen bg-deep-sea pt-20 pb-20 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2 glass rounded-full text-ocean-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-right">
             <div className="flex items-center gap-2 justify-end mb-1">
                <Globe className="w-4 h-4 text-brand-cyan" />
                <span className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.4em]">Global Expansion</span>
             </div>
             <h1 className="text-3xl font-black text-white leading-none">Add Mission Site</h1>
          </div>
        </div>

        {/* Security Notice */}
        <div className="glass-card mb-8 p-4 rounded-2xl border-brand-teal/20 bg-brand-teal/5 flex items-start gap-4">
           <ShieldCheck className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
           <p className="text-[10px] text-ocean-300 font-bold uppercase tracking-widest leading-relaxed">
             Sites submitted to the global database are subject to review by Fleet Command. Deletion is restricted to Super Admins.
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basics Section */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-ocean-800/50">
             <h3 className="text-xs font-black text-ocean-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Navigation className="w-4 h-4" /> Identification & Location
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-ocean-400 uppercase tracking-widest ml-1">Site Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Shark's Cove" 
                    className="w-full bg-ocean-950/50 border border-ocean-800 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-cyan transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-ocean-400 uppercase tracking-widest ml-1">Country</label>
                  <input 
                    required
                    type="text" 
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="e.g. Bahamas" 
                    className="w-full bg-ocean-950/50 border border-ocean-800 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-cyan transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-ocean-400 uppercase tracking-widest ml-1">Region</label>
                  <input 
                    type="text" 
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    placeholder="e.g. Abaco Islands" 
                    className="w-full bg-ocean-950/50 border border-ocean-800 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-cyan transition-all font-medium"
                  />
                </div>
             </div>
          </div>

          {/* Telemetry Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-ocean-800/50">
               <h3 className="text-xs font-black text-ocean-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Coordinates
               </h3>
               <div className="space-y-4">
                  <div className="flex gap-4">
                     <input 
                        required
                        type="number" step="any"
                        value={formData.latitude}
                        onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                        placeholder="Latitude" 
                        className="flex-1 bg-ocean-950/50 border border-ocean-800 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-cyan transition-all text-sm font-mono"
                     />
                     <input 
                        required
                        type="number" step="any"
                        value={formData.longitude}
                        onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                        placeholder="Longitude" 
                        className="flex-1 bg-ocean-950/50 border border-ocean-800 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-cyan transition-all text-sm font-mono"
                     />
                  </div>
                  <button 
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="w-full py-3 bg-ocean-900 hover:bg-ocean-800 text-brand-cyan rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-brand-cyan/20"
                  >
                    Use Current Location
                  </button>
               </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-ocean-800/50">
               <h3 className="text-xs font-black text-ocean-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Gauge className="w-4 h-4" /> Technical Stats
               </h3>
               <div className="space-y-4">
                  <div className="relative">
                     <label className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-ocean-500 uppercase">Meters</label>
                     <input 
                        required
                        type="number"
                        value={formData.max_depth_m}
                        onChange={(e) => setFormData({...formData, max_depth_m: e.target.value})}
                        placeholder="Max Depth" 
                        className="w-full bg-ocean-950/50 border border-ocean-800 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-cyan transition-all font-mono"
                     />
                  </div>
                  <select 
                    value={formData.dive_type}
                    onChange={(e) => setFormData({...formData, dive_type: e.target.value})}
                    className="w-full bg-ocean-950/50 border border-ocean-800 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-cyan transition-all font-medium appearance-none"
                  >
                    {['Reef', 'Wall', 'Wreck', 'Cave', 'Drift', 'Night', 'Technical'].map(t => (
                      <option key={t} value={t} className="bg-deep-sea">{t}</option>
                    ))}
                  </select>
               </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-ocean-800/50">
             <h3 className="text-xs font-black text-ocean-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Camera className="w-4 h-4" /> Media & Logistics
             </h3>
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-ocean-400 uppercase tracking-widest ml-1">Photo Reference URL</label>
                  <input 
                    type="url" 
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://images.unsplash.com/..." 
                    className="w-full bg-ocean-950/50 border border-ocean-800 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-cyan transition-all text-xs font-mono"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-ocean-400 uppercase tracking-widest ml-1">Shore Access Type</label>
                     <select 
                       value={formData.shore_access_type}
                       onChange={(e) => setFormData({...formData, shore_access_type: e.target.value})}
                       className="w-full bg-ocean-950/50 border border-ocean-800 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-cyan transition-all font-medium appearance-none"
                     >
                       {['Boat', 'Beach Walk', 'Giant Stride (Rocks)', 'Ladder', 'Pier'].map(t => (
                         <option key={t} value={t} className="bg-deep-sea">{t}</option>
                       ))}
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-ocean-400 uppercase tracking-widest ml-1">Site Exposure</label>
                     <select 
                       value={formData.site_exposure}
                       onChange={(e) => setFormData({...formData, site_exposure: e.target.value})}
                       className="w-full bg-ocean-950/50 border border-ocean-800 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-cyan transition-all font-medium appearance-none"
                     >
                       {['exposed', 'semi-protected', 'protected'].map(t => (
                         <option key={t} value={t} className="bg-deep-sea uppercase">{t}</option>
                       ))}
                     </select>
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-ocean-400 uppercase tracking-widest ml-1">Site Intel (Short Description)</label>
                  <textarea 
                    value={formData.short_description}
                    onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                    placeholder="Brief summary of entry points, typical conditions, or visual highlights..." 
                    rows={3}
                    className="w-full bg-ocean-950/50 border border-ocean-800 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-cyan transition-all font-medium text-sm"
                  />
                </div>
             </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-brand-cyan to-brand-teal text-deep-sea font-black uppercase tracking-[0.3em] rounded-3xl shadow-2xl shadow-brand-cyan/30 hover:shadow-brand-cyan/50 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Transmitting..." : "Broadcast Global Site"}
          </button>

        </form>

      </div>
    </main>
  );
}
