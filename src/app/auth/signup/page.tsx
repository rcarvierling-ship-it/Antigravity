"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "../actions";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-sea p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ocean-900/40 via-deep-sea to-deep-sea" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-brand-teal/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 glass-card rounded-3xl p-8 border border-ocean-800/80 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full border-2 border-brand-teal mx-auto flex items-center justify-center bg-brand-teal/10 mb-4 shadow-[0_0_15px_rgba(0,255,170,0.3)]">
            <div className="w-4 h-4 rounded-full bg-brand-teal" />
          </div>
          <h1 className="text-3xl font-black text-white">Create Account</h1>
          <p className="text-ocean-400 mt-2 text-sm">Join the network of deep sea explorers.</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ocean-300 uppercase tracking-widest mb-1.5 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ocean-500" />
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className="w-full bg-ocean-950/80 border border-ocean-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-ocean-600 focus:outline-none focus:border-brand-teal transition-colors"
                placeholder="diver@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ocean-300 uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ocean-500" />
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                minLength={6}
                className="w-full bg-ocean-950/80 border border-ocean-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-ocean-600 focus:outline-none focus:border-brand-teal transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {state?.error && (
            <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-xl text-red-400 text-sm font-medium text-center">
              {state.error}
            </div>
          )}

          <button 
            type="submit"
            disabled={pending}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-teal text-deep-sea font-bold text-center flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,170,0.3)] transition-all hover:-translate-y-0.5 mt-6 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {pending ? "Creating Account..." : "Sign Up"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-ocean-400 mt-8">
          Already have an account? <Link href="/auth/login" className="text-brand-teal hover:text-white transition-colors font-semibold">Log In</Link>
        </p>
      </div>
    </div>
  );
}
