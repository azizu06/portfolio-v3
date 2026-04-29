"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FadeContentProps extends React.HTMLAttributes<HTMLElement> {
  as?: "div" | "span";
  children: React.ReactNode;
  container?: Element | string | null;
  blur?: boolean;
  duration?: number;
  ease?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
  onComplete?: () => void;
  onDisappearanceComplete?: () => void;
}

const FadeContent: React.FC<FadeContentProps> = ({
  as: Component = "div",
  children,
  container,
  blur = false,
  duration = 1000,
  ease = "power2.out",
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = "power2.in",
  onComplete,
  onDisappearanceComplete,
  className = "",
  ...props
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let scrollerTarget: Element | string | null =
      container || document.getElementById("snap-main-container") || null;

    if (typeof scrollerTarget === "string") {
      scrollerTarget = document.querySelector(scrollerTarget);
    }

    const startPct = (1 - threshold) * 100;
    const getSeconds = (val: number) => (val > 10 ? val / 1000 : val);

    gsap.set(el, {
      autoAlpha: initialOpacity,
      filter: blur ? "blur(10px)" : "blur(0px)",
      willChange: "opacity, filter, transform",
    });

    const tl = gsap.timeline({
      paused: true,
      delay: getSeconds(delay),
      onComplete: () => {
        if (onComplete) onComplete();
        if (disappearAfter > 0) {
          gsap.to(el, {
            autoAlpha: initialOpacity,
            filter: blur ? "blur(10px)" : "blur(0px)",
            delay: getSeconds(disappearAfter),
            duration: getSeconds(disappearDuration),
            ease: disappearEase,
            onComplete: () => onDisappearanceComplete?.(),
          });
        }
      },
    });

    tl.to(el, {
      autoAlpha: 1,
      filter: "blur(0px)",
      duration: getSeconds(duration),
      ease,
    });

    const playTimeline = () => {
      if (tl.progress() === 0 && !tl.isActive()) {
        tl.play();
      }
    };

    const st = ScrollTrigger.create({
      trigger: el,
      scroller: scrollerTarget || window,
      start: `top ${startPct}%`,
      once: true,
      onEnter: playTimeline,
    });

    const rafId = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();

      const scrollerRect =
        scrollerTarget instanceof Element
          ? scrollerTarget.getBoundingClientRect()
          : { top: 0, bottom: window.innerHeight };
      const viewportHeight =
        scrollerTarget instanceof Element
          ? scrollerTarget.clientHeight
          : window.innerHeight;
      const rect = el.getBoundingClientRect();
      const triggerTop = scrollerRect.top + viewportHeight * (startPct / 100);

      if (rect.top <= triggerTop && rect.bottom >= scrollerRect.top) {
        playTimeline();
      }
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      st.kill();
      tl.kill();
      gsap.killTweensOf(el);
    };
  }, [
    blur,
    container,
    delay,
    disappearAfter,
    disappearDuration,
    disappearEase,
    duration,
    ease,
    initialOpacity,
    onComplete,
    onDisappearanceComplete,
    threshold,
  ]);

  if (Component === "span") {
    return (
      <span
        ref={ref as React.RefObject<HTMLSpanElement | null>}
        className={className}
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement | null>}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

export default FadeContent;
