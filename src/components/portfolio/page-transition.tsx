"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const start = () => setIsTransitioning(true);

    window.addEventListener("portfolio:navigate-start", start);

    return () => window.removeEventListener("portfolio:navigate-start", start);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsTransitioning(false), 140);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999] bg-[radial-gradient(circle_at_50%_20%,rgba(47,111,237,0.32),transparent_24rem),linear-gradient(180deg,rgba(6,20,39,0.72),rgba(6,20,39,0.9))]"
        initial={false}
        animate={{
          opacity: isTransitioning ? 1 : 0,
          scale: isTransitioning ? 1 : 1.015,
        }}
        transition={{ duration: isTransitioning ? 0.26 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
