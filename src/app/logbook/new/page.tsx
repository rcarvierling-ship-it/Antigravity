"use client";

import { useForm } from "react-hook-form";
import { ArrowLeft, Save, MapPin, Calendar, Clock, Anchor, Wind, Users, Zap } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { calculateSACRate, checkBadgeEligibility } from "@/lib/dive-logic";

export default function NewDiveLog() {
  const { register, handleSubmit, watch } = useForm();
  const router = useRouter();
  
  const startPsi = watch("startPsi");
  const endPsi = watch("endPsi");
  const depth = watch("avgDepth");
  const duration = watch("duration");

  const onSubmit = async (data: any) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const sac = calculateSACRate({
      startPsi: Number(data.startPsi),
      endPsi: Number(data.endPsi),
      tankVolumeCuft: Number(data.tankVolume),
      avgDepthFt: Number(data.avgDepth) * 3.28, // Convert m to ft for calculation
      durationMin: Number(data.duration)
    });

    const { data: logData, error } = await supabase.from("dive_logs").insert({
      user_id: user.id,
      custom_site_name: data.site,
      date: data.date,
      max_depth_m: Number(data.maxDepth),
      bottom_time_min: Number(data.duration),
      water_temp_c: Number(data.temp),
      gas_mix: data.gasMix,
      start_psi: Number(data.startPsi),
      end_psi: Number(data.endPsi),
      tank_volume_cuft: Number(data.tankVolume),
      avg_depth_m: Number(data.avgDepth),
      air_analytics_json: { sac }
    }).select().single();

    if (!error && logData) {
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
          }); // Swallowed error is intentional for unique constraint
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
        
        <h1 className="text-3xl font-bold text-white mb-8">Log New Dive</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section 1: Core Details */}
          <section className="glass-card p-6 md:p-8 rounded-3xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-cyan" /> Core Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Dive Site</label>
                <input 
                  {...register("site")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                  placeholder="e.g. Barracuda Point"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Location / Country</label>
                <input 
                  {...register("location")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                  placeholder="e.g. Malaysia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-ocean-400" /> Date
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
                    <Clock className="w-4 h-4 text-ocean-400" /> Duration (min)
                  </label>
                  <input 
                    type="number"
                    {...register("duration")}
                    className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                    placeholder="45"
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

          {/* Section 2: Profile */}
          <section className="glass-card p-6 md:p-8 rounded-3xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Anchor className="w-5 h-5 text-brand-cyan" /> Profile & Gas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Tank Size (cuft)</label>
                <input 
                  type="number"
                  {...register("tankVolume")}
                  defaultValue="80"
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Start PSI</label>
                <input 
                  type="number"
                  {...register("startPsi")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                  placeholder="3000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">End PSI</label>
                <input 
                  type="number"
                  {...register("endPsi")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Max Depth (m)</label>
                <input 
                  type="number"
                  {...register("maxDepth")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Avg Depth (m)</label>
                <input 
                  type="number"
                  {...register("avgDepth")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                  placeholder="0"
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
            </div>
            
            {(startPsi && endPsi && depth && duration) && (
              <div className="mt-6 p-4 bg-brand-cyan/10 border border-brand-cyan/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-brand-cyan" />
                  <span className="text-white font-bold">Estimated SAC Rate</span>
                </div>
                <span className="text-brand-cyan font-black text-xl">
                  {calculateSACRate({
                    startPsi: Number(startPsi),
                    endPsi: Number(endPsi),
                    tankVolumeCuft: 80,
                    avgDepthFt: Number(depth) * 3.28,
                    durationMin: Number(duration)
                  })} <span className="text-xs font-normal">cuft/min</span>
                </span>
              </div>
            )}
          </section>

          {/* Section 3: Conditions */}
          <section className="glass-card p-6 md:p-8 rounded-3xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Wind className="w-5 h-5 text-brand-cyan" /> Conditions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Temp (°C)</label>
                <input 
                  type="number"
                  {...register("temp")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                  placeholder="28"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Visibility (m)</label>
                <input 
                  type="number"
                  {...register("visibility")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                  placeholder="20"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-ocean-200 mb-2">Notes</label>
                <textarea 
                  {...register("notes")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors h-24 resize-none"
                  placeholder="Amazing dive, saw three turtles and a reef shark..."
                />
              </div>
            </div>
          </section>

          <button 
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-cyan to-brand-teal text-deep-sea font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all"
          >
            <Save className="w-5 h-5" /> Save Dive Log
          </button>
        </form>
      </div>
    </main>
  );
}
