"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

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
    <div className="relative hidden items-center rounded-full border border-ice/10 bg-deep-navy/28 p-1.5 shadow-[inset_0_1px_0_rgba(234,242,255,0.1)] md:flex">
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative rounded-full px-6 py-4 text-base font-semibold leading-none no-underline transition-colors duration-300 md:px-7 md:text-lg ${
              isActive ? "text-ice" : "text-ice/68 hover:text-ice"
            }`}
          >
            {isActive ? (
              <motion.span
                layoutId="pill-nav-active"
                className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(47,111,237,0.92),rgba(18,62,122,0.9))] shadow-[inset_0_1px_0_rgba(234,242,255,0.24),0_10px_28px_rgba(47,111,237,0.2)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            ) : null}
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
