import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Antigravity | Premium Scuba App",
  description: "Your ultimate underwater companion. Discover, track, and share your scuba diving adventures.",
  appleWebApp: {
    title: "Antigravity",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#030810",
};

import { BottomNav } from "@/components/layout/BottomNav";
import { TopNav } from "@/components/layout/TopNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} dark antialiased`}>
      <body className="font-sans bg-deep-sea text-foreground min-h-screen flex flex-col md:pb-0 pb-[72px]">
        <TopNav />
        <div className="flex-1 w-full flex flex-col">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
