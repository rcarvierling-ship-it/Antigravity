"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, Plus, AlertCircle, Calendar, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function GearVaultPage() {
  const [gear, setGear] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGear() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("gear")
          .select("*")
          .eq("user_id", user.id)
          .order("last_service_date", { ascending: false });
        if (data) setGear(data);
      }
      setLoading(false);
    }
    fetchGear();
  }, []);

  const getServiceStatus = (lastService: string, intervalMonths: number) => {
    const lastDate = new Date(lastService);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + intervalMonths);
    
    const today = new Date();
    const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: "Service Overdue", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: AlertCircle };
    if (diffDays < 30) return { label: `Service in ${diffDays}d`, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: AlertCircle };
    return { label: "Good Condition", color: "text-brand-teal", bg: "bg-brand-teal/10", border: "border-brand-teal/30", icon: ShieldCheck };
  };

  return (
    <main className="w-full min-h-screen px-4 md:px-8 py-8 pt-24 md:pt-12 bg-deep-sea">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Gear Vault</h1>
            <p className="text-ocean-300 text-sm">Monitor equipment integrity & service intervals.</p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-brand-cyan to-brand-teal text-deep-sea font-bold px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all transform hover:scale-105">
            <Plus className="w-5 h-5" /> Add Gear
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 text-center py-20 text-ocean-500 animate-pulse font-bold tracking-widest uppercase">Scanning Vault Content...</div>
          ) : gear.length === 0 ? (
            <div className="col-span-2 glass p-12 rounded-[2rem] text-center border border-ocean-800/50">
              <ShieldCheck className="w-12 h-12 text-ocean-800 mx-auto mb-4" />
              <p className="text-ocean-300 font-medium">Your gear vault is empty.</p>
              <p className="text-ocean-500 text-sm mt-1">Start tracking your regulators and BCDs for proactive safety.</p>
            </div>
          ) : gear.map((item) => {
            const status = getServiceStatus(item.last_service_date, item.service_interval_months);
            const StatusIcon = status.icon;
            
            return (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-3xl border border-ocean-800/50 hover:bg-ocean-900/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-ocean-800 flex items-center justify-center text-brand-cyan mb-2">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 ${status.bg} ${status.color} ${status.border} border`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
                  <p className="text-ocean-400 text-sm">{item.model || item.type}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ocean-800/30">
                  <div>
                    <span className="block text-[10px] text-ocean-500 uppercase font-black tracking-widest mb-1">Last Service</span>
                    <div className="flex items-center gap-1.5 text-ocean-300 text-sm">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.last_service_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] text-ocean-500 uppercase font-black tracking-widest mb-1">Interval</span>
                    <div className="text-ocean-200 text-sm font-bold">
                      {item.service_interval_months} Months
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-ocean-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
