import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Allow accessing the dev server from local network devices
  allowedDevOrigins: ["192.168.86.23", "localhost"],
};

export default nextConfig;
