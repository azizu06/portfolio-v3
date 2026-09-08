import type { NextConfig } from "next";

const staticAssetVersion = "portfolio-static-20260429a";
const staticAssetPrefix =
  process.env.NODE_ENV === "production" ? `/${staticAssetVersion}` : undefined;

const resumeUrl =
  "https://drive.google.com/file/d/1mgx6Urr1tcxfPnYhpsTdh5WqMcAmIQix/view?usp=sharing";

const nextConfig: NextConfig = {
  assetPrefix: staticAssetPrefix,
  async redirects() {
    return [
      {
        source: "/resume",
        destination: resumeUrl,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
