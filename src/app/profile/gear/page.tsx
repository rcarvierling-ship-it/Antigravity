"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Wrench, ShieldAlert, Plus, Activity, Tag, Calendar, Archive, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GearVault() {
  const [gear, setGear] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingGear, setAddingGear] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    type: "Regulator",
    brand: "",
    model: "",
    last_service_date: new Date().toISOString().split('T')[0],
    service_interval_months: 12
  });

  const fetchGear = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    const { data } = await supabase
      .from('gear')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setGear(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGear();
  }, []);

  const handleAddGear = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('gear').insert({
      user_id: user.id,
      ...formData
    });

    setAddingGear(false);
    fetchGear();
  };

  const getServiceStatus = (lastServiceDate: string, intervalMonths: number) => {
    if (!lastServiceDate) return { needsService: false, urgency: 'good' };
    
    const lastService = new Date(lastServiceDate);
    const today = new Date();
    const nextService = new Date(lastService);
    nextService.setMonth(nextService.getMonth() + intervalMonths);
    
    const daysUntilService = (nextService.getTime() - today.getTime()) / (1000 * 3600 * 24);
    
    if (daysUntilService < 0) return { needsService: true, urgency: 'critical', days: Math.abs(Math.floor(daysUntilService)) };
    if (daysUntilService < 30) return { needsService: true, urgency: 'warning', days: Math.floor(daysUntilService) };
    return { needsService: false, urgency: 'good', days: Math.floor(daysUntilService) };
  };

  return (
    <main className="w-full min-h-screen pt-24 pb-32 px-4 md:px-8 bg-deep-sea">
      <div className="absolute inset-0 hud-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/10 via-deep-sea to-deep-sea pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto relative z-10 scan-line">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Archive className="w-4 h-4 text-brand-cyan" />
              <span className="text-[10px] font-black tracking-[0.4em] text-brand-cyan uppercase">Armory Link // Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Gear <span className="text-brand-cyan">Vault</span></h1>
          </div>
          <button 
            onClick={() => setAddingGear(true)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-cyan text-deep-sea rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Equipment
          </button>
        </div>

        {/* Add Gear Form Modal */}
        <AnimatePresence>
          {addingGear && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12 glass-card p-6 md:p-8 rounded-3xl border border-brand-cyan/30 bg-ocean-950/80 shadow-[0_0_40px_rgba(0,229,255,0.1)] relative"
            >
              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-6">Register New Hardware</h2>
              <form onSubmit={handleAddGear} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-ocean-400 uppercase tracking-widest ml-1">Equipment Name</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-ocean-900/50 border border-ocean-800 rounded-xl p-3 text-white focus:border-brand-cyan focus:outline-none transition-all text-sm" placeholder="e.g. Scubapro MK25" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-ocean-400 uppercase tracking-widest ml-1">Category</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-ocean-900/50 border border-ocean-800 rounded-xl p-3 text-white focus:border-brand-cyan focus:outline-none transition-all text-sm appearance-none">
                      {['Regulator', 'BCD', 'Computer', 'Wetsuit', 'Drysuit', 'Cylinder', 'Mask/Fins', 'Camera', 'Other'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-ocean-400 uppercase tracking-widest ml-1">Model / Serial No.</label>
                    <input type="text" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className="w-full bg-ocean-900/50 border border-ocean-800 rounded-xl p-3 text-white focus:border-brand-cyan focus:outline-none transition-all text-sm" placeholder="Optional" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-ocean-400 uppercase tracking-widest ml-1">Last Service Date</label>
                    <input type="date" value={formData.last_service_date} onChange={(e) => setFormData({...formData, last_service_date: e.target.value})} className="w-full bg-ocean-900/50 border border-ocean-800 rounded-xl p-3 text-white focus:border-brand-cyan focus:outline-none transition-all text-sm" />
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-ocean-800">
                  <button type="submit" className="px-6 py-3 bg-white text-deep-sea font-black text-xs uppercase tracking-widest rounded-xl hover:bg-brand-cyan transition-colors shadow-lg shadow-brand-cyan/20">Register Item</button>
                  <button type="button" onClick={() => setAddingGear(false)} className="px-6 py-3 bg-ocean-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-colors">Cancel</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gear List */}
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3].map(i => <div key={i} className="h-48 glass-card rounded-3xl border border-ocean-800/30 animate-pulse bg-ocean-900/20" />)}
           </div>
        ) : gear.length === 0 ? (
           <div className="text-center py-24 glass-card rounded-[3rem] border border-dashed border-brand-cyan/20 bg-ocean-950/20">
             <div className="w-20 h-20 rounded-full border-2 border-brand-cyan/20 flex items-center justify-center mx-auto mb-6 bg-brand-cyan/5">
                <Wrench className="w-8 h-8 text-brand-cyan/50" />
             </div>
             <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Vault is Empty</h3>
             <p className="text-xs text-ocean-400 uppercase tracking-widest font-bold">Register your equipment to monitor maintenance cycles.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {gear.map((item) => {
               const status = getServiceStatus(item.last_service_date, item.service_interval_months);
               return (
                 <div key={item.id} className={cn(
                   "glass-card p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group hover:-translate-y-1",
                   status.urgency === 'critical' ? "border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] bg-red-950/20" : 
                   status.urgency === 'warning' ? "border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] bg-yellow-950/20" : 
                   "border-brand-teal/30 hover:border-brand-cyan/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.1)] bg-ocean-1000/80"
                 )}>
                   {/* Background Status Glow */}
                   <div className={cn(
                     "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity",
                     status.urgency === 'critical' ? "bg-red-500" :
                     status.urgency === 'warning' ? "bg-yellow-500" : "bg-brand-teal"
                   )} />

                   <div className="flex justify-between items-start mb-6">
                     <div>
                       <div className="flex items-center gap-2 mb-1.5">
                         <span className="text-[9px] font-black text-ocean-500 uppercase tracking-[0.2em] px-2 py-0.5 bg-ocean-900 rounded-sm">
                           {item.type}
                         </span>
                         {item.model && <span className="text-[9px] text-ocean-600 font-bold uppercase tracking-widest">{item.model}</span>}
                       </div>
                       <h3 className="text-xl font-black text-white uppercase tracking-tight leading-none group-hover:text-glow-cyan transition-colors">{item.name}</h3>
                     </div>
                     <div className={cn(
                       "w-10 h-10 rounded-xl flex items-center justify-center border",
                       status.urgency === 'critical' ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse" :
                       status.urgency === 'warning' ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" :
                       "bg-brand-teal/10 border-brand-teal/30 text-brand-teal"
                     )}>
                       {status.urgency === 'critical' ? <ShieldAlert className="w-5 h-5" /> : 
                        status.urgency === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
                        <CheckCircle2 className="w-5 h-5" />}
                     </div>
                   </div>

                   <div className="space-y-4">
                     {item.last_service_date && (
                       <div className="flex justify-between items-center px-4 py-3 bg-ocean-950/50 rounded-xl border border-ocean-800/50">
                         <div className="flex items-center gap-2 text-ocean-400">
                           <Activity className="w-4 h-4" />
                           <span className="text-[10px] uppercase font-black tracking-widest">Service Health</span>
                         </div>
                         <div className="text-right">
                           {status.urgency === 'critical' ? (
                             <p className="text-xs font-black text-red-500 uppercase">Overdue by {status.days}d</p>
                           ) : status.urgency === 'warning' ? (
                             <p className="text-xs font-black text-yellow-500 uppercase">Service in {status.days}d</p>
                           ) : (
                             <p className="text-xs font-black text-brand-teal uppercase">Nominal ({status.days}d left)</p>
                           )}
                         </div>
                       </div>
                     )}
                     
                     <div className="grid grid-cols-2 gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                       <div className="flex items-center gap-2">
                         <Calendar className="w-3.5 h-3.5 text-ocean-500" />
                         <span className="text-[10px] text-ocean-400 font-bold tracking-widest uppercase">Int: {item.service_interval_months}mo</span>
                       </div>
                       <div className="flex items-center gap-2 justify-end">
                         <Tag className="w-3.5 h-3.5 text-ocean-500" />
                         <span className="text-[10px] text-ocean-400 font-bold tracking-widest uppercase truncate">{item.created_at.split('T')[0]}</span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="absolute bottom-0 left-0 h-1 w-full flex">
                     <div className={cn("h-full transition-all duration-1000",
                       status.urgency === 'critical' ? "bg-red-500 w-full" :
                       status.urgency === 'warning' ? "bg-yellow-500 w-4/5" :
                       "bg-brand-teal w-1/3 group-hover:w-1/2"
                     )} />
                   </div>
                 </div>
               );
             })}
           </div>
        )}
      </div>
    </main>
  );
}
