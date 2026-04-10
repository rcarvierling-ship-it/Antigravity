"use client";

import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  MapPin, 
  PhoneCall, 
  Stethoscope, 
  Navigation, 
  Thermometer, 
  Activity, 
  ArrowRight, 
  ShieldAlert,
  ChevronRight,
  Info,
  Clock,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function SafetyHub() {
  const [activeMode, setActiveMode] = useState<'standard' | 'red'>('standard');
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [chambers, setChambers] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [symptomStep, setSymptomStep] = useState(0);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const [profileRes, chambersRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("hyperbaric_chambers").select("*")
        ]);
        if (profileRes.data) setProfile(profileRes.data);
        if (chambersRes.data) setChambers(chambersRes.data);
      }
    }
    fetchData();

    // Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, [supabase]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const nearbyChambers = chambers
    .map(c => ({
      ...c,
      distance: coords ? calculateDistance(coords.lat, coords.lng, c.lat, c.lng) : Infinity
    }))
    .sort((a, b) => a.distance - b.distance);

  const symptomQuestions = [
    { id: 'pain', q: "Are you experiencing joint or muscle pain?" },
    { id: 'skin', q: "Is there any itching or skin rash?" },
    { id: 'neuro', q: "Any dizziness, numbness, or tingling?" },
    { id: 'respiratory', q: "Are you feeling short of breath or chest pain?" }
  ];

  return (
    <main className={cn(
      "w-full min-h-screen pt-24 pb-32 px-4 md:px-8 transition-colors duration-700 relative overflow-hidden",
      activeMode === 'red' ? "bg-red-950" : "bg-deep-sea"
    )}>
      {/* HUD Background Grid */}
      <div className={cn(
        "absolute inset-0 hud-grid pointer-events-none z-0 transition-opacity duration-700",
        activeMode === 'red' ? "opacity-20 translate-y-1" : "opacity-10"
      )} />
      
      <div className={cn(
        "max-w-4xl mx-auto relative z-10 scan-line",
        activeMode === 'red' && "animate-pulse"
      )}>
        
        {/* Module Header */}
        <div className="flex flex-col items-center text-center mb-16 px-2">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className={cn("w-4 h-4", activeMode === 'red' ? "text-white" : "text-brand-cyan")} />
            <span className={cn("text-[10px] font-black uppercase tracking-[0.5em]", activeMode === 'red' ? "text-white" : "text-brand-cyan")}>
              {activeMode === 'red' ? "Emergency Link Active" : "Guardian Protocol // 0xS-1"}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase mb-6">
            Safety <span className={activeMode === 'red' ? "text-white" : "text-brand-cyan"}>Intelligence</span>
          </h1>
          <p className="text-ocean-500 max-w-lg font-black uppercase text-[10px] tracking-widest leading-relaxed">
            Technical diver response & physiological monitoring hub. 
            Telemetry status: <span className={activeMode === 'red' ? "text-white" : "text-brand-teal"}>Secure</span>
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-16">
           <button 
             onClick={() => setActiveMode(activeMode === 'standard' ? 'red' : 'standard')}
             className={cn(
               "px-10 py-4 rounded-full font-black uppercase tracking-widest text-[11px] border transition-all flex items-center gap-4 group",
               activeMode === 'standard' 
                ? "bg-red-600/10 border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]" 
                : "bg-white text-red-900 border-white shadow-[0_0_60px_rgba(255,255,255,0.4)]"
             )}
           >
             <AlertTriangle className={cn("w-5 h-5", activeMode === 'standard' ? "group-hover:animate-bounce" : "animate-pulse")} />
             {activeMode === 'standard' ? "Activate SOS Protocol" : "DEACTIVATE EMERGENCY BEACON"}
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section 1: Distress Beacon */}
          <section className="space-y-6">
            <div className={cn(
              "glass-card p-10 rounded-[3rem] border transition-all duration-700 flex flex-col items-center text-center relative overflow-hidden",
              activeMode === 'red' ? "border-red-500 bg-red-900/40 shadow-[0_0_50px_rgba(239,68,68,0.2)]" : "border-ocean-800"
            )}>
               {/* SOS Pulse Effect */}
               {activeMode === 'red' && (
                 <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
               )}

               <div className={cn(
                 "w-20 h-20 rounded-2xl flex items-center justify-center mb-8 rotate-3 shadow-2xl transition-all duration-700",
                 activeMode === 'red' ? "bg-white text-red-600 scale-110" : "bg-ocean-1000 text-brand-cyan border border-ocean-800"
               )}>
                 <Navigation className="w-10 h-10" />
               </div>
               <h2 className={cn("text-2xl font-black uppercase tracking-tighter mb-2", activeMode === 'red' ? "text-white" : "text-white")}>Live Coordinates</h2>
               <p className="text-[10px] font-black text-ocean-500 mb-10 uppercase tracking-widest">Global Relay Intelligence</p>
               
               <div className="space-y-4 w-full">
                  <div className={cn(
                    "p-8 rounded-3xl font-mono text-3xl font-black flex flex-col gap-4 transition-all border",
                    activeMode === 'red' ? "bg-white text-red-950 border-white" : "bg-ocean-1000 text-brand-cyan border-ocean-900 shadow-inner"
                  )}>
                    <div className="flex justify-between items-center px-2">
                       <span className="text-[10px] opacity-40 uppercase tracking-widest">Lat</span>
                       <span>{coords?.lat.toFixed(6) || "---.------"}</span>
                    </div>
                    <div className="border-t border-current/10 pt-4 flex justify-between items-center px-2">
                       <span className="text-[10px] opacity-40 uppercase tracking-widest">Lng</span>
                       <span>{coords?.lng.toFixed(6) || "---.------"}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(`${coords?.lat}, ${coords?.lng}`)}
                    className="w-full py-4 rounded-2xl bg-ocean-1000 border border-ocean-800 text-[10px] font-black uppercase tracking-widest text-ocean-400 hover:text-white hover:border-ocean-700 transition-all active:scale-95"
                  >
                    COPY_TELEMETRY_STRING
                  </button>
               </div>
            </div>

            {/* Emergency Contacts & Bio-Data */}
            <div className="glass-card p-10 rounded-[3rem] border border-ocean-800 bg-gradient-to-br from-ocean-1000 to-deep-sea">
               <h3 className="text-[10px] font-black text-ocean-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                 <ShieldAlert className="w-3 h-3 text-red-500" /> Bio-Metric Support
               </h3>
               
               <div className="space-y-6">
                 {/* Emergency Contact */}
                 {profile?.emergency_contact_phone ? (
                   <div className="flex items-center justify-between p-6 bg-ocean-950/50 rounded-2xl border border-ocean-900">
                      <div>
                         <p className="text-[10px] text-ocean-600 font-black uppercase tracking-widest mb-1">Primary Kin</p>
                         <p className="text-xl font-black text-white leading-none mb-1">{profile.emergency_contact_name}</p>
                         <p className="text-xs text-brand-teal font-black tracking-widest uppercase">{profile.emergency_contact_phone}</p>
                      </div>
                      <a 
                        href={`tel:${profile.emergency_contact_phone}`}
                        className="p-5 bg-brand-teal text-deep-sea rounded-2xl hover:scale-110 hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all"
                      >
                        <PhoneCall className="w-6 h-6" />
                      </a>
                   </div>
                 ) : (
                   <div className="text-center py-6 bg-ocean-950/40 rounded-2xl border border-dashed border-ocean-800 group hover:border-ocean-700 transition-all cursor-pointer">
                      <p className="text-[10px] text-ocean-600 font-black uppercase tracking-widest">No Kinetic Contact Synchronized</p>
                      <button className="text-[9px] text-brand-cyan font-black uppercase mt-3 tracking-widest hover:underline">Link_Identity_Node</button>
                   </div>
                 )}

                 {/* Medical Notes */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-ocean-950/50 rounded-2xl border border-ocean-900">
                       <p className="text-[9px] text-ocean-600 font-black uppercase tracking-widest mb-2">Blood_Group</p>
                       <p className="text-2xl font-black text-white leading-none">{profile?.blood_type || "N/A"}</p>
                    </div>
                    <div className="p-6 bg-ocean-950/50 rounded-2xl border border-ocean-900">
                       <p className="text-[9px] text-ocean-600 font-black uppercase tracking-widest mb-2">Risk_Markers</p>
                       <p className="text-xs font-black text-white leading-relaxed truncate">{profile?.medical_notes || "Clean Record"}</p>
                    </div>
                 </div>
               </div>
            </div>
          </section>

          {/* Section 2: Medical Tools */}
          <section className="space-y-8">
            
            {/* DCS Symptom Checker */}
            <div className="glass-card p-10 rounded-[3rem] border border-ocean-800 bg-gradient-to-br from-ocean-1000 to-transparent overflow-hidden relative">
               {/* Technical Decor */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
               
               <h3 className="text-[10px] font-black text-ocean-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-2">
                 <Stethoscope className="w-4 h-4 text-brand-cyan" /> Bio-Scan Post-Mission
               </h3>
               
               <AnimatePresence mode="wait">
                 {symptomStep < symptomQuestions.length ? (
                   <motion.div 
                     key={symptomStep}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-8"
                   >
                     <div className="space-y-2">
                        <span className="text-[9px] font-black text-brand-cyan uppercase tracking-widest">Diagnostic Step 0{symptomStep + 1}</span>
                        <p className="text-2xl font-black text-white leading-tight tracking-tighter uppercase">{symptomQuestions[symptomStep].q}</p>
                     </div>
                     <div className="flex gap-4">
                        <button 
                          onClick={() => setSymptomStep(symptomStep + 1)}
                          className="flex-1 py-5 bg-ocean-950 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-ocean-500 hover:bg-ocean-900 border border-ocean-900 transition-all active:scale-95"
                        >
                          Negative
                        </button>
                        <button 
                          onClick={() => {
                            setSymptoms([...symptoms, symptomQuestions[symptomStep].id]);
                            setSymptomStep(symptomStep + 1);
                          }}
                          className="flex-1 py-5 bg-red-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-red-900/30 hover:bg-red-500 transition-all active:scale-95"
                        >
                          Affirmative
                        </button>
                     </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="text-center py-6"
                   >
                     {symptoms.length > 0 ? (
                       <div className="space-y-6">
                          <div className="w-20 h-20 rounded-3xl bg-red-600/20 border border-red-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                             <AlertTriangle className="w-10 h-10 text-red-500" />
                          </div>
                          <div className="space-y-2">
                             <h4 className="text-3xl font-black text-white tracking-tighter uppercase">Evacuation Warning</h4>
                             <p className="text-[10px] text-red-200/60 font-black uppercase tracking-widest leading-relaxed">
                               Potential Decompression Sickness detected. <br />
                               1. Administer 100% Oxygen immediately. <br />
                               2. Contact emergency hotline (DAN). <br />
                               3. Neutral postural position required.
                             </p>
                          </div>
                          <button onClick={() => setSymptomStep(0)} className="px-8 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-[10px] font-black uppercase text-red-500 tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all">Restart Diagnostic</button>
                       </div>
                     ) : (
                       <div className="space-y-6">
                          <div className="w-20 h-20 rounded-3xl bg-brand-teal/20 border border-brand-teal flex items-center justify-center mx-auto text-brand-teal shadow-[0_0_30px_rgba(45,212,191,0.2)]">
                             <CheckCircle2 className="w-10 h-10" />
                          </div>
                          <div className="space-y-2">
                             <h4 className="text-3xl font-black text-white tracking-tighter uppercase">Scan Nominal</h4>
                             <p className="text-[10px] text-ocean-400 font-black uppercase tracking-widest leading-relaxed">
                               No immediate high-risk indicators detected. <br />
                               Maintain hydration and monitor for 24h. <br />
                               Telemetry reset to stand-by mode.
                             </p>
                          </div>
                          <button onClick={() => setSymptomStep(0)} className="px-8 py-3 bg-brand-cyan/10 border border-brand-cyan/30 rounded-xl text-[10px] font-black uppercase text-brand-cyan tracking-[0.3em] hover:bg-brand-cyan hover:text-deep-sea transition-all">New Profile Scan</button>
                       </div>
                     )}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

             {/* Mission Intelligence Briefing */}
             <div className="glass-card p-10 rounded-[3rem] border border-ocean-800 bg-gradient-to-br from-deep-sea to-ocean-1000 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <h3 className="text-[10px] font-black text-ocean-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-brand-cyan" /> Mission Briefing: Site Intel
                </h3>
                
                <div className="space-y-6">
                   <p className="text-[10px] text-ocean-400 font-bold uppercase tracking-widest leading-relaxed">
                     Select a mission site to analyze environmental risk factors including exposure ratings and protection levels.
                   </p>
                   
                   <div className="p-6 rounded-2xl bg-ocean-950/50 border border-ocean-900 border-dashed flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-xl bg-ocean-900 flex items-center justify-center mb-4 text-ocean-700">
                         <Activity className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-black text-ocean-600 uppercase tracking-widest mb-4">Awaiting Site Selection</p>
                      <button 
                        onClick={() => window.location.href='/explore'}
                        className="px-6 py-2.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl text-[9px] font-black uppercase text-brand-cyan tracking-widest hover:bg-brand-cyan hover:text-deep-sea transition-all"
                      >
                        Launch_Discovery_Engine
                      </button>
                   </div>

                   <div className="pt-6 border-t border-ocean-900 flex items-center gap-6">
                      <div className="flex-1">
                         <p className="text-[8px] font-black text-ocean-600 uppercase mb-2 tracking-widest">Global Security Index</p>
                         <div className="h-1 w-full bg-ocean-900 rounded-full overflow-hidden">
                            <div className="h-full w-[85%] bg-gradient-to-r from-brand-cyan to-brand-teal" />
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[8px] font-black text-ocean-600 uppercase mb-1 tracking-widest">Risk Level</p>
                         <p className="text-xs font-black text-brand-teal uppercase">Minimal</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Hyperbaric Locator */}
             <div className="glass-card p-10 rounded-[3rem] border border-ocean-800 bg-ocean-1000 shadow-inner">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-[10px] font-black text-ocean-500 uppercase tracking-[0.4em] flex items-center gap-2">
                     <MapPin className="w-4 h-4 text-brand-teal" /> Medical Fleet Registry
                   </h3>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-flicker" />
                      <span className="text-[9px] text-ocean-700 font-black uppercase tracking-widest">Distance: KM</span>
                   </div>
                </div>
                
                <div className="space-y-4">
                   {nearbyChambers.slice(0, 3).map((chamber) => (
                     <div key={chamber.id} className="p-6 bg-ocean-950/30 rounded-2xl border border-ocean-900 group hover:border-brand-teal/40 transition-all cursor-crosshair">
                        <div className="flex justify-between items-start">
                           <div className="space-y-1">
                              <p className="text-[10px] text-brand-teal font-black uppercase tracking-widest opacity-60">Node_{chamber.id.split('-')[0]}</p>
                              <p className="text-xl font-black text-white leading-none tracking-tight group-hover:text-brand-teal transition-colors uppercase">{chamber.name}</p>
                              <p className="text-[10px] text-ocean-500 font-bold uppercase tracking-widest pt-1">{chamber.address}</p>
                           </div>
                           <div className="text-right flex flex-col items-end gap-3">
                              <div className="px-3 py-1 bg-ocean-900 rounded-lg text-xs font-black text-white border border-ocean-800">
                                 {Math.round(chamber.distance)}
                              </div>
                              <a 
                                href={`tel:${chamber.phone_24h}`} 
                                className="px-4 py-2 bg-ocean-900 border border-brand-cyan/20 rounded-lg text-[10px] text-brand-cyan font-black uppercase tracking-widest hover:bg-brand-cyan hover:text-deep-sea transition-all active:scale-95"
                              >
                                COMM_LINK
                              </a>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="mt-10 pt-8 border-t border-ocean-900/50 flex items-center justify-center opacity-30">
                   <p className="text-[8px] font-black text-ocean-500 uppercase tracking-[0.5em]">End_of_Registry // 0xAF</p>
                </div>
             </div>

          </section>

        </div>

      </div>
    </main>
  );
}
