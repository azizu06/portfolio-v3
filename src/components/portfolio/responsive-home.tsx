"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const desktopLabMediaQuery =
  "(min-width: 1100px) and (hover: hover) and (pointer: fine)";

const DesktopLabHome = dynamic(
  () =>
    import("@/components/portfolio/home-model-stage").then(
      (module) => module.HomeModelStage,
    ),
  {
    ssr: false,
    loading: () => (
      <main className="grid min-h-dvh place-items-center bg-[#061427] text-ice">
        <div className="h-2 w-36 overflow-hidden rounded-full bg-ice/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-ice/50" />
        </div>
      </main>
    ),
  },
);

type ResponsiveHomeProps = {
  mobile: ReactNode;
};

export function ResponsiveHome({ mobile }: ResponsiveHomeProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(desktopLabMediaQuery);
    const syncViewport = () => setIsDesktop(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  if (isDesktop) {
    return <DesktopLabHome />;
  }

  return mobile;
}
