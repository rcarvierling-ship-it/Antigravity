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
      "w-full min-h-screen pt-24 pb-32 px-4 md:px-8 transition-colors duration-700",
      activeMode === 'red' ? "bg-red-950" : "bg-deep-sea"
    )}>
      <div className="max-w-4xl mx-auto">
        
        {/* Mode Toggle */}
        <div className="flex justify-center mb-12">
           <button 
             onClick={() => setActiveMode(activeMode === 'standard' ? 'red' : 'standard')}
             className={cn(
               "px-8 py-3 rounded-full font-black uppercase tracking-widest text-[11px] border transition-all flex items-center gap-3",
               activeMode === 'standard' 
                ? "bg-red-600/10 border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white" 
                : "bg-white text-red-900 border-white shadow-[0_0_50px_rgba(255,255,255,0.3)] animate-pulse"
             )}
           >
             <AlertTriangle className="w-4 h-4" />
             {activeMode === 'standard' ? "Activate SOS Mode" : "Deactivate Emergency Link"}
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section 1: Distress Beacon */}
          <section className="space-y-6">
            <div className={cn(
              "glass-card p-8 rounded-[2.5rem] border transition-all duration-700 flex flex-col items-center text-center",
              activeMode === 'red' ? "border-red-500 bg-red-900/40 shadow-[0_0_40px_rgba(239,68,68,0.2)]" : "border-ocean-800"
            )}>
               <div className={cn(
                 "w-16 h-16 rounded-full flex items-center justify-center mb-6",
                 activeMode === 'red' ? "bg-white text-red-600 animate-bounce" : "bg-ocean-900 text-brand-cyan"
               )}>
                 <Navigation className="w-8 h-8" />
               </div>
               <h2 className={cn("text-xl font-black uppercase tracking-widest mb-2", activeMode === 'red' ? "text-white" : "text-ocean-300")}>GPS Distress Beacon</h2>
               <p className="text-sm font-medium text-ocean-500 mb-8 lowercase">Current coordinate telemetry for radio relay</p>
               
               <div className="space-y-4 w-full">
                  <div className={cn(
                    "p-6 rounded-2xl font-mono text-2xl font-black flex flex-col gap-2 transition-all",
                    activeMode === 'red' ? "bg-white text-red-950" : "bg-ocean-950 text-brand-cyan"
                  )}>
                    <div>{coords?.lat.toFixed(6) || "---.------"} N</div>
                    <div className="border-t border-current/10 pt-2">{coords?.lng.toFixed(6) || "---.------"} W</div>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(`${coords?.lat}, ${coords?.lng}`)}
                    className="w-full py-3 rounded-xl bg-ocean-900/50 text-[10px] font-black uppercase tracking-widest text-ocean-400 hover:text-white transition-all"
                  >
                    Copy Coordinates
                  </button>
               </div>
            </div>

            {/* Emergency Contacts */}
            <div className="glass-card p-8 rounded-[2.5rem] border border-ocean-800">
               <h3 className="text-[10px] font-black text-ocean-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <ShieldAlert className="w-3 h-3 text-red-500" /> Ground Ops Contact
               </h3>
               {profile?.emergency_contact_phone ? (
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-lg font-black text-white">{profile.emergency_contact_name}</p>
                       <p className="text-xs text-ocean-400 font-bold tracking-widest uppercase">{profile.emergency_contact_phone}</p>
                    </div>
                    <a 
                      href={`tel:${profile.emergency_contact_phone}`}
                      className="p-4 bg-brand-teal text-deep-sea rounded-2xl hover:scale-105 transition-all"
                    >
                      <PhoneCall className="w-5 h-5" />
                    </a>
                 </div>
               ) : (
                 <div className="text-center py-4 bg-ocean-950/40 rounded-2xl border border-dashed border-ocean-800">
                    <p className="text-[10px] text-ocean-600 font-black uppercase">No Contact Logged</p>
                    <button className="text-[9px] text-brand-cyan font-black uppercase mt-2">Update Mission Profile</button>
                 </div>
               )}
            </div>
          </section>

          {/* Section 2: Medical Tools */}
          <section className="space-y-8">
            
            {/* DCS Symptom Checker */}
            <div className="glass-card p-8 rounded-[2.5rem] border border-ocean-800 bg-gradient-to-br from-ocean-950/50 to-transparent overflow-hidden relative">
               <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                 <Stethoscope className="w-4 h-4 text-brand-cyan" /> Post-Dive Diagnostic
               </h3>
               
               <AnimatePresence mode="wait">
                 {symptomStep < symptomQuestions.length ? (
                   <motion.div 
                     key={symptomStep}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-6"
                   >
                     <p className="text-lg font-bold text-white leading-tight">{symptomQuestions[symptomStep].q}</p>
                     <div className="flex gap-3">
                        <button 
                          onClick={() => setSymptomStep(symptomStep + 1)}
                          className="flex-1 py-4 bg-ocean-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-ocean-400 hover:bg-ocean-800"
                        >
                          No
                        </button>
                        <button 
                          onClick={() => {
                            setSymptoms([...symptoms, symptomQuestions[symptomStep].id]);
                            setSymptomStep(symptomStep + 1);
                          }}
                          className="flex-1 py-4 bg-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/20"
                        >
                          Yes
                        </button>
                     </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="text-center py-4"
                   >
                     {symptoms.length > 0 ? (
                       <div className="space-y-4">
                          <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center mx-auto">
                             <AlertTriangle className="w-6 h-6 text-red-500" />
                          </div>
                          <h4 className="text-xl font-black text-white">IMMEDIATE ATTENTION</h4>
                          <p className="text-xs text-ocean-400 font-medium">Potential DCS detected. Administer 100% Oxygen and contact DAN immediately.</p>
                          <button onClick={() => setSymptomStep(0)} className="text-[10px] font-black uppercase text-brand-cyan tracking-widest mt-4">Restart Scan</button>
                       </div>
                     ) : (
                       <div className="space-y-4">
                          <div className="w-12 h-12 rounded-full bg-brand-teal/20 border border-brand-teal flex items-center justify-center mx-auto text-brand-teal">
                             <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <h4 className="text-xl font-black text-white">ALL CLEAR</h4>
                          <p className="text-xs text-ocean-400 font-medium">No immediate high-risk indicators detected. Continue monitoring and stay hydrated.</p>
                          <button onClick={() => setSymptomStep(0)} className="text-[10px] font-black uppercase text-brand-cyan tracking-widest mt-4">Restart Scan</button>
                       </div>
                     )}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Hyperbaric Locator */}
            <div className="glass-card p-8 rounded-[2.5rem] border border-ocean-800">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black text-ocean-500 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-brand-teal" /> Medical Facilities Nearby
                  </h3>
                  <span className="text-[8px] bg-ocean-900 px-2 py-0.5 rounded-full text-ocean-500 font-black uppercase">KM</span>
               </div>
               
               <div className="space-y-3">
                  {nearbyChambers.slice(0, 3).map((chamber) => (
                    <div key={chamber.id} className="p-4 bg-ocean-950/50 rounded-2xl border border-ocean-800/50 flex items-center justify-between group hover:border-brand-teal/30 transition-all">
                       <div>
                          <p className="text-sm font-bold text-white group-hover:text-brand-teal transition-colors">{chamber.name}</p>
                          <p className="text-[10px] text-ocean-500 font-bold uppercase tracking-widest mt-0.5">{chamber.address}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-white">{Math.round(chamber.distance)}</p>
                          <a href={`tel:${chamber.phone_24h}`} className="text-[9px] text-brand-cyan font-black uppercase tracking-widest mt-1 hover:underline inline-block">Call</a>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

          </section>

        </div>

      </div>
    </main>
  );
}
