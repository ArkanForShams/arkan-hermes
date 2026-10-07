import type { NextConfig } from "next";

const isGhPages = process.env.DEPLOY_TARGET === "gh-pages";
const repo = "arkan-hermes";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: "export",
  ...(isGhPages
    ? {
        basePath: `/${repo}/website/site-live`,
        assetPrefix: `/${repo}/website/site-live`,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
