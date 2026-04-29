import type { NextConfig } from "next";

const staticAssetVersion = "portfolio-static-20260429a";
const staticAssetPrefix =
  process.env.NODE_ENV === "production" ? `/${staticAssetVersion}` : undefined;

const nextConfig: NextConfig = {
  assetPrefix: staticAssetPrefix,
};

export default nextConfig;
