import { Star, MapPin } from "lucide-react";
import Image from "next/image";

export function FeaturedSites({ title, sites }: { title?: string; sites?: any[] }) {
  const defaultSites = [
    { id: 1, name: "Thistlegorm Wreck", location: "Egypt", rating: 4.9, img: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Barracuda Point", location: "Malaysia", rating: 4.8, img: "https://images.unsplash.com/photo-1544551763-46a0e38eeba6?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Richelieu Rock", location: "Thailand", rating: 4.9, img: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=800&auto=format&fit=crop" }
  ];

  const displaySites = sites || defaultSites;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0 mb-20 md:mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{title || "Featured Sites"}</h2>
        <button className="text-sm text-brand-cyan hover:text-brand-teal transition-colors">Explore Map</button>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
        {displaySites.map((site: any) => (
          <div key={site.id || site.key} className="min-w-[240px] w-[240px] md:min-w-[280px] md:w-[280px] h-[320px] rounded-3xl overflow-hidden relative group snap-center flex-shrink-0 cursor-pointer">
            {/* Using a regular div with background image since we don't have Next.js image domain configured for Unsplash yet */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${site.img || 'https://images.unsplash.com/photo-1544551763-46a0e38eeba6?q=80&w=800&auto=format&fit=crop'})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-sea via-deep-sea/40 to-transparent" />
            
            <div className="absolute top-4 right-4 glass px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-md bg-black/20">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">{site.rating}</span>
            </div>

            <div className="absolute bottom-0 p-5 w-full">
              <h3 className="text-lg font-bold text-white mb-1">{site.name}</h3>
              <p className="text-sm text-ocean-200 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-brand-cyan" /> {site.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
