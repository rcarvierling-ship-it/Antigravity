"use client";

import { useForm } from "react-hook-form";
import { ArrowLeft, Save, MapPin, Calendar, Clock, Anchor, Wind, Users, Zap, Star, Waves, Camera, Plus, Store } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { calculateSAC } from "@/lib/services/analytics";
import { checkBadgeEligibility } from "@/lib/dive-logic";
import { useState, useEffect } from "react";

export default function NewDiveLog() {
  const { register, handleSubmit, watch, setValue } = useForm();
  const router = useRouter();
  const supabase = createClient();
  
  const [rating, setRating] = useState(0);
  const [shops, setShops] = useState<any[]>([]);
  const [species, setSpecies] = useState<any[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const startPressure = watch("startPressure");
  const endPressure = watch("endPressure");
  const depth = watch("avgDepth");
  const duration = watch("duration");

  useEffect(() => {
    async function fetchData() {
      const { data: shopsData } = await supabase.from("dive_shops").select("*");
      if (shopsData) setShops(shopsData);

      const { data: speciesData } = await supabase.from("marine_life_species").select("*");
      if (speciesData) setSpecies(speciesData);
    }
    fetchData();
  }, [supabase]);

  const toggleSpecies = (id: string) => {
    setSelectedSpecies(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const onSubmit = async (data: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const sac = calculateSAC({
      startPressure: Number(data.startPressure),
      endPressure: Number(data.endPressure),
      tankSize: Number(data.tankVolume),
      avgDepthM: Number(data.avgDepth),
      bottomTime: Number(data.duration),
      isImperial: true // Default for now, can be toggled by user preference
    });

    // 1. Insert Dive Log
    const { data: logData, error } = await supabase.from("dive_logs").insert({
      user_id: user.id,
      custom_site_name: data.site,
      date: data.date,
      max_depth_m: Number(data.maxDepth),
      bottom_time_min: Number(data.duration),
      water_temp_c: Number(data.temp),
      gas_mix: data.gasMix,
      start_pressure: Number(data.startPressure),
      end_pressure: Number(data.endPressure),
      tank_size_vol: Number(data.tankVolume),
      avg_depth_m: Number(data.avgDepth),
      rating_score: rating,
      current_strength: data.currentStrength,
      dive_shop_id: data.diveShop !== "none" ? data.diveShop : null,
      notes: data.notes,
      visibility_m: Number(data.visibility),
      computed_sac: sac
    }).select().single();

    if (!error && logData) {
      // 2. Insert Marine Life Sightings
      if (selectedSpecies.length > 0) {
        const sightings = selectedSpecies.map(sId => ({
          user_id: user.id,
          species_id: sId,
          dive_log_id: logData.id,
          date_seen: data.date
        }));
        await supabase.from("user_marine_life_sightings").insert(sightings);
      }

      // 3. Check Badges
      const eligibleBadges = checkBadgeEligibility({
        max_depth_m: Number(data.maxDepth),
        water_temp_c: Number(data.temp),
        date: data.date
      });

      for (const badge of eligibleBadges) {
        const { data: b } = await supabase.from("badges").select("id").eq("slug", badge.slug).single();
        if (b) {
          await supabase.from("user_badges").insert({
            user_id: user.id,
            badge_id: b.id
          });
        }
      }
      
      router.push("/logbook");
    }
  };

  return (
    <main className="w-full min-h-screen px-4 md:px-8 py-8 pt-24 md:pt-12 pb-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/logbook" className="flex items-center gap-2 text-ocean-300 hover:text-white transition-colors mb-6 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Logbook
        </Link>
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white leading-tight">Log New Mission</h1>
            <p className="text-ocean-400 text-sm">Capture your telemetry and sightings.</p>
          </div>
          <div className="flex items-center gap-1 group cursor-pointer" onClick={() => {}}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                onClick={() => setRating(star)}
                className={`w-6 h-6 transition-all ${rating >= star ? "fill-brand-cyan text-brand-cyan drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]" : "text-ocean-800 hover:text-ocean-600"}`} 
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section 1: Core Details */}
          <section className="glass-card p-6 md:p-8 rounded-3xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-cyan" /> Mission Parameters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-ocean-200 mb-2">Dive Site</label>
                  <input 
                    {...register("site")}
                    className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                    placeholder="e.g. Barracuda Point"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-200 mb-2 flex items-center gap-2">
                    <Store className="w-4 h-4 text-ocean-400" /> Dive Shop / Center
                  </label>
                  <select 
                    {...register("diveShop")}
                    className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors appearance-none"
                  >
                    <option value="none">No Shop / Private</option>
                    {shops.map(shop => (
                      <option key={shop.id} value={shop.id}>{shop.name}</option>
                    ))}
                    <option value="add">+ Add New Shop</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-ocean-400" /> Mission Date
                </label>
                <input 
                  type="date"
                  {...register("date")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ocean-200 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ocean-400" /> Bottom Time (min)
                  </label>
                  <input 
                    type="number"
                    {...register("duration")}
                    className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-200 mb-2 flex items-center gap-2">
                     <Users className="w-4 h-4 text-ocean-400" /> Buddy Tag
                  </label>
                  <input 
                    {...register("buddy")}
                    className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                    placeholder="@username"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Gas & Depth */}
          <section className="glass-card p-6 md:p-8 rounded-3xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Anchor className="w-5 h-5 text-brand-cyan" /> Technical Profile
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Max Depth (m)</label>
                <input 
                  type="number"
                  {...register("maxDepth")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Avg Depth (m)</label>
                <input 
                  type="number"
                  {...register("avgDepth")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Gas Mix</label>
                <select 
                  {...register("gasMix")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                >
                  <option value="Air">Air (21%)</option>
                  <option value="Nitrox 32">Nitrox 32%</option>
                  <option value="Nitrox 36">Nitrox 36%</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Tank (cuft)</label>
                <input 
                  type="number"
                  {...register("tankVolume")}
                  defaultValue="80"
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Start PSI / BAR</label>
                <input 
                  type="number"
                  {...register("startPressure")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">End PSI / BAR</label>
                <input 
                  type="number"
                  {...register("endPressure")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
            </div>
            
            {(startPressure && endPressure && depth && duration) && (
              <div className="mt-6 p-4 bg-brand-cyan/10 border border-brand-cyan/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-brand-cyan" />
                  <span className="text-white font-bold text-sm">Real-time Efficiency Analyser</span>
                </div>
                <div className="text-right">
                  <div className="text-brand-cyan font-black text-2xl leading-none">
                    {calculateSAC({
                      startPressure: Number(startPressure),
                      endPressure: Number(endPressure),
                      tankSize: Number(watch("tankVolume") || 80),
                      avgDepthM: Number(depth),
                      bottomTime: Number(duration),
                      isImperial: true
                    })}
                  </div>
                  <span className="text-[10px] text-ocean-400 font-bold uppercase tracking-widest">SAC Rate (L/min)</span>
                </div>
              </div>
            )}
          </section>

          {/* Section 3: Marine Life Tracker (NEW) */}
          <section className="glass-card p-6 md:p-8 rounded-3xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-teal" /> Marine Life Tracker
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {species.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleSpecies(item.id)}
                  className={`p-3 rounded-2xl border transition-all text-left group ${selectedSpecies.includes(item.id) 
                    ? "bg-brand-teal/20 border-brand-teal text-white shadow-[0_0_15px_rgba(45,212,191,0.2)]" 
                    : "bg-ocean-950 border-ocean-800 text-ocean-400 hover:border-ocean-600 hover:text-white"}`}
                >
                  <p className="text-xs font-bold truncate">{item.name}</p>
                  <p className="text-[10px] text-ocean-500 group-hover:text-ocean-300 transition-colors uppercase tracking-widest">{item.category}</p>
                </button>
              ))}
              <button type="button" className="p-3 rounded-2xl border border-dashed border-ocean-700 text-ocean-500 hover:border-ocean-400 hover:text-white transition-all flex flex-col items-center justify-center gap-1">
                <Plus className="w-4 h-4" />
                <span className="text-[10px] uppercase font-black">Unknown</span>
              </button>
            </div>
          </section>

          {/* Section 4: Conditions */}
          <section className="glass-card p-6 md:p-8 rounded-3xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Waves className="w-5 h-5 text-brand-cyan" /> Ocean State
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Temp (°C)</label>
                <input 
                  type="number"
                  {...register("temp")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Visibility (m)</label>
                <input 
                  type="number"
                  {...register("visibility")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-ocean-200 mb-2">Current Strength</label>
                <select 
                  {...register("currentStrength")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                >
                  <option value="none">None / Slack</option>
                  <option value="mild">Mild</option>
                  <option value="strong">Strong</option>
                  <option value="ripping">Ripping</option>
                </select>
              </div>
              
              <div className="col-span-full">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-ocean-200 mb-2 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-ocean-400" /> Dive Media (Photos/Video)
                  </label>
                  <div className="w-full border-2 border-dashed border-ocean-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-ocean-900/40 hover:border-ocean-600 transition-all cursor-pointer">
                    <Camera className="w-8 h-8 text-ocean-600 mb-2" />
                    <p className="text-sm text-ocean-500 font-medium">Drag and drop mission imagery or <span className="text-brand-cyan">browse files</span></p>
                    <p className="text-[10px] text-ocean-600 uppercase tracking-widest mt-1">PNG, JPG, MOV, MP4 (MAX 50MB)</p>
                  </div>
                </div>

                <label className="block text-sm font-medium text-ocean-200 mb-2">Mission Log / Notes</label>
                <textarea 
                  {...register("notes")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors h-32 resize-none"
                  placeholder="Describe your underwater discoveries, gear performance, and unique sightings..."
                />
              </div>
            </div>
          </section>

          <button 
            type="submit"
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-brand-cyan to-brand-teal text-deep-sea font-black text-xl flex items-center justify-center gap-3 hover:shadow-[0_0_35px_rgba(0,229,255,0.4)] transition-all uppercase tracking-widest group"
          >
            <Save className="w-6 h-6 group-hover:scale-110 transition-transform" /> Commit to Logbook
          </button>
        </form>
      </div>
    </main>
  );
}
