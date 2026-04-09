import Link from "next/link";
import { Anchor } from "lucide-react";

export function DarkFooter() {
  return (
    <footer className="w-full bg-[#02050A] border-t border-ocean-900/50 py-12 px-4 sm:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-ocean-950 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-6 group inline-flex">
            <div className="relative flex items-center justify-center p-2 rounded-full overflow-hidden bg-ocean-900">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan to-brand-teal opacity-20 group-hover:opacity-100 transition-opacity" />
              <Anchor className="w-6 h-6 text-brand-cyan group-hover:text-white transition-colors relative z-10" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-cyan transition-all">
              Abyss
            </span>
          </Link>
          <p className="text-ocean-400 max-w-sm mb-6 text-sm">
            Forging the ultimate digital experiences for technical divers, instructors, and scuba enthusiasts worldwide.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 font-outfit uppercase tracking-widest text-xs">Product</h4>
          <ul className="space-y-3">
            <li><Link href="/explore" className="text-ocean-400 hover:text-brand-cyan transition-colors text-sm font-medium">Explore Map</Link></li>
            <li><Link href="/dashboard" className="text-ocean-400 hover:text-brand-cyan transition-colors text-sm font-medium">Logbook Dashboard</Link></li>
            <li><Link href="/social" className="text-ocean-400 hover:text-brand-cyan transition-colors text-sm font-medium">Community Network</Link></li>
            <li><Link href="/tools" className="text-ocean-400 hover:text-brand-cyan transition-colors text-sm font-medium">Diver Utilities</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 font-outfit uppercase tracking-widest text-xs">Legal</h4>
          <ul className="space-y-3">
            <li><Link href="#" className="text-ocean-400 hover:text-brand-cyan transition-colors text-sm font-medium">Privacy Policy</Link></li>
            <li><Link href="#" className="text-ocean-400 hover:text-brand-cyan transition-colors text-sm font-medium">Terms of Service</Link></li>
            <li><Link href="#" className="text-ocean-400 hover:text-brand-cyan transition-colors text-sm font-medium">Data Exfiltration</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-ocean-900/40 relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-ocean-500 text-xs text-center md:text-left">
          © {new Date().getFullYear()} Abyss Scuba. Built for the depths.
        </p>
      </div>

    </footer>
  );
}
