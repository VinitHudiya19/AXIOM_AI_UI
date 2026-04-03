import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },   // Google avatars
      { protocol: "https", hostname: "avatars.githubusercontent.com" }, // GitHub avatars
    ],
  },
  async rewrites() {
    return {
      // beforeFiles rewrites are checked before pages/api routes,
      // but we use afterFiles so NextAuth /api/auth/* is handled first.
      afterFiles: [
        {
          source: "/api/:path((?!auth).*)*",
          destination: "http://localhost:8000/:path*",  // orchestrator
        },
        {
          source: "/viz/:path*",
          destination: "http://localhost:8003/:path*",  // direct viz-agent calls
        },
      ],
    };
  },
};

export default nextConfig;
