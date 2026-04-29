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
  onItemSelect?: (item: PillNavItem) => void;
};

export default function PillNav({ items, onItemSelect }: PillNavProps) {
  const pathname = usePathname();

  return (
    <div className="relative flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2 md:gap-3">
      {items.map((item, index) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            onClick={(event) => {
              if (!onItemSelect) {
                return;
              }

              event.preventDefault();
              onItemSelect(item);
            }}
            className={`group relative shrink-0 px-3 py-3 text-sm font-semibold leading-none no-underline transition-all duration-300 hover:-translate-y-0.5 sm:px-4 sm:text-base md:px-5 md:py-3 md:text-xl ${
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
            <span className="absolute inset-x-3 bottom-1.5 h-px origin-center scale-x-0 bg-ice/82 shadow-[0_0_18px_rgba(255,255,255,0.46)] transition-transform duration-300 group-hover:scale-x-100 sm:inset-x-4 md:inset-x-5 md:bottom-1.5" />
          </Link>
        );
      })}
    </div>
  );
}
