import { MarketingHero } from "@/components/marketing/MarketingHero";
import { FeatureBento } from "@/components/marketing/FeatureBento";
import { DarkFooter } from "@/components/marketing/DarkFooter";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col relative pb-0 md:pb-0">
      <MarketingHero />
      <FeatureBento />
      <DarkFooter />
    </main>
  );
}
