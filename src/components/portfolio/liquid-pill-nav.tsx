"use client";

import Image from "next/image";
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
        aria-label="Aziz Umarov home"
        className="flex size-14 shrink-0 items-center justify-center overflow-hidden p-0 transition-transform duration-300 hover:scale-105 md:size-16"
      >
        <Image
          src="/assets/logo.png"
          alt="Aziz Umarov logo"
          width={56}
          height={56}
          className="h-full w-full object-contain"
          priority
        />
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
