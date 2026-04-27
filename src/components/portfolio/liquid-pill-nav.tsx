"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import GooeyNav from "@/components/GooeyNav";
import { navItems } from "@/data/profile";

export function LiquidPillNav() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex min-h-[4.75rem] w-full max-w-7xl items-center justify-between gap-5 rounded-full border border-ice/18 bg-ice/[0.07] px-4 py-3 shadow-[inset_0_1px_0_rgba(234,242,255,0.2),inset_0_-1px_0_rgba(47,111,237,0.18),0_24px_90px_rgba(0,0,0,0.36),0_0_0_1px_rgba(47,111,237,0.2)] backdrop-blur-2xl md:min-h-[5.25rem] md:px-5">
      <Link
        href="/"
        className="shrink-0 rounded-full px-5 py-4 font-mono text-sm uppercase tracking-[0.24em] text-ice no-underline transition-colors duration-300 hover:text-white md:px-7 md:text-base"
      >
        Aziz Umarov
      </Link>

      <GooeyNav
        key={pathname}
        items={navItems.slice(1)}
        activeHref={pathname}
        particleCount={12}
        particleDistances={[42, 8]}
        particleR={62}
        colors={[1, 2, 3, 4]}
        className="ml-auto hidden md:block"
      />
    </nav>
  );
}
