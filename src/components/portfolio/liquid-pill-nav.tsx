"use client";

import { usePathname } from "next/navigation";
import PillNav from "@/components/PillNav";
import { navItems } from "@/data/profile";

export function LiquidPillNav() {
  const pathname = usePathname();

  return (
    <PillNav
      logoText="Aziz Umarov"
      logoHref="/"
      items={navItems.slice(1)}
      activeHref={pathname}
      baseColor="rgba(234,242,255,0.085)"
      pillColor="rgba(6,20,39,0.54)"
      pillTextColor="#eaf2ff"
      hoveredPillTextColor="#eaf2ff"
      ease="power3.out"
      className="mx-auto min-h-[4.75rem] max-w-7xl rounded-full border border-ice/18 bg-ice/[0.07] px-3 py-2 shadow-[inset_0_1px_0_rgba(234,242,255,0.2),inset_0_-1px_0_rgba(47,111,237,0.18),0_24px_90px_rgba(0,0,0,0.36),0_0_0_1px_rgba(47,111,237,0.2)] backdrop-blur-2xl md:min-h-[5.25rem] md:px-4"
    />
  );
}
