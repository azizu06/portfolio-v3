"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <div className="relative hidden items-center gap-3 md:flex">
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`group relative px-5 py-4 text-lg font-semibold leading-none no-underline transition-all duration-300 hover:-translate-y-0.5 md:px-7 md:py-5 md:text-xl ${
              isActive ? "text-ice" : "text-ice/62 hover:text-ice"
            }`}
          >
            <span className="relative z-10">{item.label}</span>
            <span className="absolute inset-x-5 bottom-2 h-px origin-center scale-x-0 bg-cobalt/90 shadow-[0_0_18px_rgba(47,111,237,0.8)] transition-transform duration-300 group-hover:scale-x-100 md:inset-x-6" />
          </Link>
        );
      })}
    </div>
  );
}
