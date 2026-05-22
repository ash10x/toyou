import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["nodemailer", "pg", "pg-pool"],
};

export default nextConfig;
