import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  webpack: (config: any) => {
    config.externals.push({
      'better-sqlite3': 'commonjs better-sqlite3'
    });
    return config;
  }
};

export default nextConfig;
