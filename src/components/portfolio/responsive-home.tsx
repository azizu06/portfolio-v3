"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

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
  mobileRedirectPath?: string;
};

export function ResponsiveHome({
  mobile,
  mobileRedirectPath,
}: ResponsiveHomeProps) {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const syncViewport = () => {
      const isDesktopViewport = mediaQuery.matches;

      setIsDesktop(isDesktopViewport);

      if (!isDesktopViewport && mobileRedirectPath) {
        router.replace(mobileRedirectPath);
      }
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, [mobileRedirectPath, router]);

  if (isDesktop) {
    return <DesktopLabHome />;
  }

  return mobile;
}
