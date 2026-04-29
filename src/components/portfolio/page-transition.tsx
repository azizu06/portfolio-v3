"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <motion.div
      key={pathname}
      initial={hasMounted ? { opacity: 0, y: 14, filter: "blur(6px)" } : false}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: hasMounted ? 0.46 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: "opacity, transform, filter" }}
    >
      {children}
    </motion.div>
  );
}
