import type { NextConfig } from "next";

const studioOrigin = process.env.SANITY_STUDIO_ORIGIN?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async rewrites() {
    if (!studioOrigin) {
      return [];
    }

    return {
      beforeFiles: [
        {
          source: "/studio",
          destination: `${studioOrigin}/studio`,
          basePath: false,
        },
        {
          source: "/studio/:path*",
          destination: `${studioOrigin}/studio/:path*`,
          basePath: false,
        },
      ],
    };
  },
};

export default nextConfig;
