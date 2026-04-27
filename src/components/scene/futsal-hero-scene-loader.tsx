"use client";

import dynamic from "next/dynamic";

const FutsalHeroScene = dynamic(
  () => import("@/components/scene/futsal-hero-scene").then((mod) => mod.FutsalHeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="futsal-canvas-fallback">
        <div className="futsal-loading-mark" />
        <span>Warming up the court</span>
      </div>
    ),
  }
);

export function FutsalHeroSceneLoader() {
  return <FutsalHeroScene />;
}
