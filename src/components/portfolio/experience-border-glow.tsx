"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

type BorderGlowProps = {
  children: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  mobileGlowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
};

function parseHsl(hsl: string): { h: number; s: number; l: number } {
  const match = hsl.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);

  if (!match) {
    return { h: 216, s: 84, l: 64 };
  }

  return {
    h: Number.parseFloat(match[1]),
    s: Number.parseFloat(match[2]),
    l: Number.parseFloat(match[3]),
  };
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHsl(glowColor);
  const color = `${h}deg ${s}% ${l}%`;
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 58, true],
    [0, 0, 4, 0, 42, true],
    [0, 0, 12, 0, 26, true],
    [0, 0, 28, 2, 14, true],
    [0, 0, 1, 0, 52, false],
    [0, 0, 6, 0, 34, false],
    [0, 0, 18, 1, 18, false],
    [0, 0, 42, 2, 9, false],
  ];

  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const opacity = Math.min(alpha * intensity, 100);

      return `${
        inset ? "inset " : ""
      }${x}px ${y}px ${blur}px ${spread}px hsl(${color} / ${opacity}%)`;
    })
    .join(", ");
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInCubic(value: number) {
  return value * value * value;
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}: {
  start?: number;
  end?: number;
  duration?: number;
  delay?: number;
  ease?: (value: number) => number;
  onUpdate: (value: number) => void;
  onEnd?: () => void;
}) {
  const startTime = performance.now() + delay;

  function tick() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    onUpdate(start + (end - start) * ease(progress));

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      onEnd?.();
    }
  }

  window.setTimeout(() => requestAnimationFrame(tick), delay);
}

const gradientPositions = [
  "80% 55%",
  "69% 34%",
  "8% 6%",
  "41% 38%",
  "86% 85%",
  "82% 18%",
  "51% 4%",
];

const colorMap = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors: string[]): string[] {
  const gradients: string[] = [];

  for (let index = 0; index < 7; index += 1) {
    const color = colors[Math.min(colorMap[index], colors.length - 1)];
    gradients.push(
      `radial-gradient(at ${gradientPositions[index]}, ${color} 0px, transparent 50%)`,
    );
  }

  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);

  return gradients;
}

export function ExperienceBorderGlow({
  children,
  className = "",
  edgeSensitivity = 28,
  glowColor = "216 90 68",
  backgroundColor = "rgba(7, 19, 36, 0.9)",
  borderRadius = 22,
  glowRadius = 34,
  mobileGlowRadius,
  glowIntensity = 0.76,
  coneSpread = 24,
  animated = true,
  colors = ["rgba(47, 111, 237, 0.96)", "rgba(125, 211, 252, 0.74)", "rgba(219, 234, 254, 0.9)"],
  fillOpacity = 0.28,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorAngle, setCursorAngle] = useState(45);
  const [edgeProximity, setEdgeProximity] = useState(0);
  const [sweepActive, setSweepActive] = useState(false);

  const getCenterOfElement = useCallback((element: HTMLElement) => {
    const { width, height } = element.getBoundingClientRect();

    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback(
    (element: HTMLElement, x: number, y: number) => {
      const [centerX, centerY] = getCenterOfElement(element);
      const dx = x - centerX;
      const dy = y - centerY;
      const kx = dx === 0 ? Number.POSITIVE_INFINITY : centerX / Math.abs(dx);
      const ky = dy === 0 ? Number.POSITIVE_INFINITY : centerY / Math.abs(dy);

      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    },
    [getCenterOfElement],
  );

  const getCursorAngle = useCallback(
    (element: HTMLElement, x: number, y: number) => {
      const [centerX, centerY] = getCenterOfElement(element);
      const dx = x - centerX;
      const dy = y - centerY;

      if (dx === 0 && dy === 0) {
        return 0;
      }

      const degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      return degrees < 0 ? degrees + 360 : degrees;
    },
    [getCenterOfElement],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const card = cardRef.current;

      if (!card) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setEdgeProximity(getEdgeProximity(card, x, y));
      setCursorAngle(getCursorAngle(card, x, y));
    },
    [getCursorAngle, getEdgeProximity],
  );

  useEffect(() => {
    if (!animated) {
      return;
    }

    const angleStart = 118;
    const angleEnd = 462;

    const frame = requestAnimationFrame(() => {
      setSweepActive(true);
      setCursorAngle(angleStart);
      animateValue({
        duration: 520,
        onUpdate: (value) => setEdgeProximity(value / 100),
      });
      animateValue({
        duration: 1450,
        end: 50,
        ease: easeInCubic,
        onUpdate: (value) =>
          setCursorAngle(
            (angleEnd - angleStart) * (value / 100) + angleStart,
          ),
      });
      animateValue({
        delay: 1450,
        duration: 2150,
        start: 50,
        end: 100,
        onUpdate: (value) =>
          setCursorAngle(
            (angleEnd - angleStart) * (value / 100) + angleStart,
          ),
      });
      animateValue({
        delay: 2500,
        duration: 1400,
        start: 100,
        end: 0,
        ease: easeInCubic,
        onUpdate: (value) => setEdgeProximity(value / 100),
        onEnd: () => setSweepActive(false),
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [animated]);

  const subscribeToMobileGlow = useCallback((onStoreChange: () => void) => {
    if (mobileGlowRadius === undefined) {
      return () => {};
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    mediaQuery.addEventListener("change", onStoreChange);

    return () => mediaQuery.removeEventListener("change", onStoreChange);
  }, [mobileGlowRadius]);
  const getMobileGlowSnapshot = useCallback(
    () =>
      mobileGlowRadius !== undefined &&
      window.matchMedia("(max-width: 767px)").matches,
    [mobileGlowRadius],
  );
  const isMobileGlow = useSyncExternalStore(
    subscribeToMobileGlow,
    getMobileGlowSnapshot,
    () => false,
  );
  const effectiveGlowRadius =
    isMobileGlow && mobileGlowRadius !== undefined ? mobileGlowRadius : glowRadius;

  const colorSensitivity = edgeSensitivity + 20;
  const isVisible = isHovered || sweepActive;
  const rawBorderOpacity = isVisible
    ? Math.max(0, (edgeProximity * 100 - colorSensitivity) / (100 - colorSensitivity))
    : 0;
  const rawGlowOpacity = isVisible
    ? Math.max(0, (edgeProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity))
    : 0;
  const borderOpacity = isHovered ? Math.min(rawBorderOpacity + 0.38, 1) : rawBorderOpacity;
  const glowOpacity = isHovered ? Math.min(rawGlowOpacity + 0.45, 1) : rawGlowOpacity;
  const boostedGlowIntensity = isHovered ? Math.min(glowIntensity * 1.45, 1.6) : glowIntensity;
  const meshGradients = buildMeshGradients(colors);
  const borderBackground = meshGradients.map((gradient) => `${gradient} border-box`);
  const fillBackground = meshGradients.map((gradient) => `${gradient} padding-box`);
  const angle = `${cursorAngle.toFixed(3)}deg`;

  return (
    <div
      ref={cardRef}
      onPointerEnter={() => {
        setIsHovered(true);
        setEdgeProximity(1);
      }}
      onPointerLeave={() => {
        setIsHovered(false);
        setEdgeProximity(0);
      }}
      onPointerMove={handlePointerMove}
      className={`relative isolate grid border border-white/15 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 ${className}`}
      style={{
        background: backgroundColor,
        borderRadius,
        boxShadow:
          "rgba(0,0,0,0.18) 0 18px 42px, rgba(0,0,0,0.14) 0 42px 90px",
        transform: "translate3d(0, 0, 0.01px)",
      }}
    >
      <div
        className="absolute inset-0 -z-[1] rounded-[inherit]"
        style={{
          border: "1px solid transparent",
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            "linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box",
            ...borderBackground,
          ].join(", "),
          maskImage: `conic-gradient(from ${angle} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          opacity: borderOpacity,
          transition: isVisible
            ? "opacity 0.25s cubic-bezier(0.32,0.72,0,1)"
            : "opacity 0.75s cubic-bezier(0.32,0.72,0,1)",
          WebkitMaskImage: `conic-gradient(from ${angle} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
        }}
      />
      <div
        className="absolute inset-0 -z-[1] rounded-[inherit]"
        style={
          {
            border: "1px solid transparent",
            background: fillBackground.join(", "),
            maskComposite: "subtract, add, add, add, add, add",
            maskImage: [
              "linear-gradient(to bottom, black, black)",
              "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
              "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
              `conic-gradient(from ${angle} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
            ].join(", "),
            mixBlendMode: "soft-light",
            opacity: borderOpacity * fillOpacity,
            transition: isVisible
              ? "opacity 0.25s cubic-bezier(0.32,0.72,0,1)"
              : "opacity 0.75s cubic-bezier(0.32,0.72,0,1)",
            WebkitMaskComposite:
              "source-out, source-over, source-over, source-over, source-over, source-over",
            WebkitMaskImage: [
              "linear-gradient(to bottom, black, black)",
              "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
              "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
              `conic-gradient(from ${angle} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
            ].join(", "),
          } as CSSProperties
        }
      />
      <span
        className="pointer-events-none absolute rounded-[inherit]"
        style={{
          inset: `${-effectiveGlowRadius}px`,
          maskImage: `conic-gradient(from ${angle} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          mixBlendMode: "plus-lighter",
          opacity: glowOpacity,
          transition: isVisible
            ? "opacity 0.25s cubic-bezier(0.32,0.72,0,1)"
            : "opacity 0.75s cubic-bezier(0.32,0.72,0,1)",
          WebkitMaskImage: `conic-gradient(from ${angle} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
        }}
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            boxShadow: buildBoxShadow(glowColor, boostedGlowIntensity),
            inset: `${effectiveGlowRadius}px`,
          }}
        />
      </span>
      <div className="relative z-[1] overflow-hidden rounded-[inherit]">{children}</div>
    </div>
  );
}
