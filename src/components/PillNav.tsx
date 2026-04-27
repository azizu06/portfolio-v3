"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ShinyText from "@/components/ShinyText";

export type PillNavItem = {
  label: string;
  href: string;
};

type PillNavProps = {
  items: PillNavItem[];
};

export default function PillNav({ items }: PillNavProps) {
  const pathname = usePathname();

  return (
    <div className="relative hidden items-center gap-4 md:flex">
      {items.map((item, index) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`group relative px-5 py-4 text-xl font-semibold leading-none no-underline transition-all duration-300 hover:-translate-y-0.5 md:px-8 md:py-5 md:text-2xl ${
              isActive ? "text-ice" : "text-ice/62 hover:text-ice"
            }`}
          >
            <ShinyText
              text={item.label}
              speed={3.2}
              color={isActive ? "rgba(234,242,255,0.86)" : "rgba(234,242,255,0.58)"}
              shineColor="#ffffff"
              spread={104}
              delay={index * 0.18}
              yoyo
              pauseOnHover
              className="relative z-10 drop-shadow-[0_0_12px_rgba(255,255,255,0.08)]"
            />
            <span className="absolute inset-x-5 bottom-2 h-px origin-center scale-x-0 bg-ice/82 shadow-[0_0_18px_rgba(255,255,255,0.46)] transition-transform duration-300 group-hover:scale-x-100 md:inset-x-6" />
          </Link>
        );
      })}
    </div>
  );
}
