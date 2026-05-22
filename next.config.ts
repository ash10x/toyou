import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["nodemailer", "pg", "pg-pool"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },
};

export default nextConfig;
