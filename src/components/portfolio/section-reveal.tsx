"use client";

import SplitText from "@/components/SplitText";

export function SectionReveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <SplitText
      text={text}
      tag="span"
      textAlign="left"
      splitType="words"
      delay={42}
      duration={0.9}
      threshold={0.2}
      rootMargin="-40px"
      className={className}
      from={{ opacity: 0, y: 22 }}
      to={{ opacity: 1, y: 0 }}
    />
  );
}
