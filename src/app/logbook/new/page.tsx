"use client";

import { useForm } from "react-hook-form";
import { ArrowLeft, Save, MapPin, Calendar, Clock, Anchor, Wind } from "lucide-react";
import Link from "next/link";

export default function NewDiveLog() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    // Submit to Supabase here
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
                    <Clock className="w-4 h-4 text-ocean-400" /> Time In
                  </label>
                  <input 
                    type="time"
                    {...register("timeIn")}
                    className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-200 mb-2">Time Out</label>
                  <input 
                    type="time"
                    {...register("timeOut")}
                    className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-2">Weight (kg)</label>
                <input 
                  type="number"
                  {...register("weight")}
                  className="w-full bg-ocean-950 border border-ocean-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                  placeholder="0"
                />
              </div>
            </div>
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
