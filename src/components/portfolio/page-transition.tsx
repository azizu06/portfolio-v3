"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCovering, setIsCovering] = useState(false);

  useEffect(() => {
    const start = () => setIsCovering(true);

    window.addEventListener("portfolio:navigate-start", start);

    return () => window.removeEventListener("portfolio:navigate-start", start);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsCovering(false));

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999] bg-deep-navy"
        initial={false}
        animate={{ opacity: isCovering ? 0.82 : 0 }}
        transition={{ duration: isCovering ? 0.24 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
