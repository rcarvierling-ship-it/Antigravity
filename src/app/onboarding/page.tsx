"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Check, Droplets } from "lucide-react";

const steps = [
  { id: "intro", title: "Welcome to Abyss." },
  { id: "identity", title: "Who are you?" },
  { id: "experience", title: "Experience Level" },
  { id: "preferences", title: "Diving Preferences" },
];

const certLevels = ["Open Water", "Advanced Open Water", "Rescue", "Divemaster", "Instructor", "Tech Diver"];
const diveCounts = ["0-20 (Beginner)", "21-50 (Novice)", "51-100 (Experienced)", "100+ (Veteran)"];
const diveTypes = ["Reef Explorer", "Wreck Diver", "Deep Diver", "Cave/Cavern", "Macro Photography", "Cold Water"];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    certificationLevel: "",
    totalDives: "",
    preferredType: ""
  });

  useEffect(() => {
    // Check auth on mount
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
      } else {
        setUserId(user.id);
      }
    });
  }, [router]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = async () => {
    if (!userId) return;
    setLoading(true);
    const supabase = createClient();

    // Map totalDives string back to integer heuristic or just store as string
    // In SQL it's 'integer default 0'. We'll parse the middle number roughly.
    let dives = 0;
    if (formData.totalDives.includes("21-50")) dives = 35;
    if (formData.totalDives.includes("51-100")) dives = 75;
    if (formData.totalDives.includes("100+")) dives = 150;

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      display_name: formData.displayName,
      username: formData.username || `diver_${Math.floor(Math.random() * 10000)}`,
      certification_level: formData.certificationLevel,
      total_dives: dives,
      preferred_diver_type: formData.preferredType,
      updated_at: new Date().toISOString()
    });

    setLoading(false);
    if (!error) {
      router.refresh(); // Invalidate server cache
      router.push("/dashboard");
    } else {
      console.error("Failed to update profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-deep-sea flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-brand-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="flex px-4 mb-12 justify-center gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-brand-cyan w-16' : 'bg-ocean-800 w-8'}`} />
          ))}
        </div>

        <div className="glass-card rounded-[2rem] p-8 md:p-12 min-h-[400px] border border-ocean-700/50 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-full text-center mt-10"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-cyan to-brand-teal p-[2px] mb-6 shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                  <div className="w-full h-full bg-deep-sea rounded-full flex items-center justify-center">
                    <Droplets className="w-8 h-8 text-brand-cyan" />
                  </div>
                </div>
                <h1 className="text-4xl font-black text-white mb-4">Welcome to Abyss</h1>
                <p className="text-ocean-300 text-lg max-w-md mx-auto">Let's set up your diving profile so we can tailor the ocean to your experience.</p>
                
                <button 
                  onClick={handleNext}
                  className="mt-10 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-teal text-deep-sea font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all hover:-translate-y-1"
                >
                  Configure Profile <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col h-full"
              >
                <h2 className="text-3xl font-black text-white mb-2">Who are you?</h2>
                <p className="text-ocean-400 mb-8">What do your dive buddies call you?</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-ocean-300 uppercase tracking-widest mb-2">Display Name</label>
                    <input 
                      type="text" 
                      value={formData.displayName}
                      onChange={e => setFormData({...formData, displayName: e.target.value})}
                      className="w-full bg-ocean-950/80 border border-ocean-700/60 rounded-xl py-4 px-5 text-white placeholder-ocean-600 focus:outline-none focus:border-brand-cyan transition-colors text-lg"
                      placeholder="Jacques Cousteau"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ocean-300 uppercase tracking-widest mb-2">@Username</label>
                    <input 
                      type="text" 
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                      className="w-full bg-ocean-950/80 border border-ocean-700/60 rounded-xl py-4 px-5 text-white placeholder-ocean-600 focus:outline-none focus:border-brand-cyan transition-colors text-lg"
                      placeholder="captain_jacques"
                    />
                  </div>
                </div>

                <div className="mt-auto pt-10 flex justify-end">
                  <button 
                    onClick={handleNext}
                    disabled={!formData.displayName.trim() || !formData.username.trim() || !userId}
                    className="px-8 py-3 rounded-xl bg-white text-deep-sea font-bold disabled:opacity-30 transition-all flex items-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col h-full"
              >
                <h2 className="text-3xl font-black text-white mb-2">Certifications & Experience</h2>
                <p className="text-ocean-400 mb-8">What is your current highest certification?</p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {certLevels.map(level => (
                    <button 
                      key={level}
                      onClick={() => setFormData({...formData, certificationLevel: level})}
                      className={`p-4 rounded-xl border text-left transition-all ${formData.certificationLevel === level ? 'bg-brand-cyan/20 border-brand-cyan text-white font-bold' : 'bg-ocean-900/30 border-ocean-800 text-ocean-300 hover:border-ocean-600'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>

                <p className="text-ocean-400 mb-4 mt-2">Roughly how many logged dives do you have?</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {diveCounts.map(count => (
                    <button 
                      key={count}
                      onClick={() => setFormData({...formData, totalDives: count})}
                      className={`p-3 rounded-xl border text-center transition-all ${formData.totalDives === count ? 'bg-brand-teal/20 border-brand-teal text-white font-bold' : 'bg-ocean-900/30 border-ocean-800 text-ocean-300 hover:border-ocean-600'}`}
                    >
                      {count}
                    </button>
                  ))}
                </div>

                <div className="mt-auto pt-6 flex justify-between items-center">
                  <button onClick={() => setCurrentStep(s => s - 1)} className="text-ocean-400 hover:text-white font-semibold">Back</button>
                  <button 
                    onClick={handleNext}
                    disabled={!formData.certificationLevel || !formData.totalDives}
                    className="px-8 py-3 rounded-xl bg-white text-deep-sea font-bold disabled:opacity-30 transition-all flex items-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col h-full"
              >
                <h2 className="text-3xl font-black text-white mb-2">Diving Preferences</h2>
                <p className="text-ocean-400 mb-8">What type of diving excites you the most?</p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {diveTypes.map(type => (
                    <button 
                      key={type}
                      onClick={() => setFormData({...formData, preferredType: type})}
                      className={`p-4 rounded-xl border flex flex-col items-start gap-2 transition-all ${formData.preferredType === type ? 'bg-gradient-to-br from-brand-cyan/20 to-brand-teal/20 border-brand-cyan text-white font-bold' : 'bg-ocean-900/30 border-ocean-800 text-ocean-300 hover:border-ocean-600'}`}
                    >
                      {formData.preferredType === type ? <Check className="w-5 h-5 text-brand-cyan" /> : <div className="w-5 h-5 rounded-full border border-ocean-600" />}
                      {type}
                    </button>
                  ))}
                </div>

                <div className="mt-auto pt-6 flex justify-between items-center">
                  <button onClick={() => setCurrentStep(s => s - 1)} className="text-ocean-400 hover:text-white font-semibold flex items-center gap-2">Back</button>
                  <button 
                    onClick={handleNext}
                    disabled={!formData.preferredType || loading}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-teal text-deep-sea font-bold disabled:opacity-30 transition-all flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:-translate-y-1"
                  >
                    {loading ? "Saving..." : "Enter Logbook"} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
