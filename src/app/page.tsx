import { MarketingHero } from "@/components/marketing/MarketingHero";
import { FeatureBento } from "@/components/marketing/FeatureBento";
import { DarkFooter } from "@/components/marketing/DarkFooter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abyss Mission Control | Technical Scuba Intelligence",
  description: "The definitive platform for global technical divers. Precision tracking, satellite mission discovery, and community-driven safety protocols.",
  keywords: ["scuba", "technical diving", "dive log", "Buhlmann ZHL-16C", "mission control", "abyss"],
};

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col relative overflow-x-hidden bg-deep-sea">
      <MarketingHero />
      <div className="relative">
         <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-deep-sea to-transparent z-10" />
         <FeatureBento />
      </div>
      <DarkFooter />
    </main>
  );
}
