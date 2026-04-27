"use client";

import Image from "next/image";
import Link from "next/link";
import PillNav from "@/components/PillNav";
import { navItems } from "@/data/profile";

export function LiquidPillNav() {
  return (
    <nav className="mx-auto flex min-h-[5rem] w-full max-w-7xl items-center justify-between gap-5 rounded-full border border-ice/18 bg-ice/[0.07] px-4 py-3 shadow-[inset_0_1px_0_rgba(234,242,255,0.2),inset_0_-1px_0_rgba(47,111,237,0.18),0_24px_90px_rgba(0,0,0,0.36),0_0_0_1px_rgba(47,111,237,0.2)] backdrop-blur-2xl md:min-h-[5.75rem] md:px-6">
      <Link
        href="/"
        aria-label="Aziz Umarov home"
        className="flex size-16 shrink-0 items-center justify-center overflow-visible p-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 md:size-20"
      >
        <Image
          src="/assets/au-logo.svg"
          alt="Aziz Umarov logo"
          width={80}
          height={80}
          className="h-full w-full object-contain drop-shadow-[0_0_22px_rgba(47,111,237,0.22)]"
          priority
        />
      </Link>

      <PillNav items={navItems.slice(1)} />
    </nav>
  );
}
