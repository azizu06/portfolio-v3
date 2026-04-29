"use client";

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useTransform,
} from "motion/react";

type OrbitShape =
  | "ellipse"
  | "circle"
  | "square"
  | "rectangle"
  | "triangle"
  | "star"
  | "heart"
  | "infinity"
  | "wave"
  | "custom";

interface OrbitImagesProps {
  images?: string[];
  imageLabels?: string[];
  altPrefix?: string;
  shape?: OrbitShape;
  customPath?: string;
  baseWidth?: number;
  radiusX?: number;
  radiusY?: number;
  radius?: number;
  starPoints?: number;
  starInnerRatio?: number;
  rotation?: number;
  duration?: number;
  itemSize?: number;
  direction?: "normal" | "reverse";
  fill?: boolean;
  width?: number | "100%";
  height?: number | "auto";
  className?: string;
  showPath?: boolean;
  pathColor?: string;
  pathWidth?: number;
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut";
  paused?: boolean;
  pauseOnHover?: boolean;
  centerContent?: ReactNode;
  responsive?: boolean;
  responsiveScaleAxis?: "width" | "height";
  responsiveAspectRatio?: string;
}

interface OrbitItemProps {
  item: ReactNode;
  label: string;
  index: number;
  totalItems: number;
  path: string;
  itemSize: number;
  rotation: number;
  progress: MotionValue<number>;
  fill: boolean;
  onHoverChange?: (hovered: boolean) => void;
  onTooltipChange?: (label: string, rect: DOMRect) => void;
  onTooltipClose?: () => void;
}

type TooltipPlacement = "top" | "right" | "bottom" | "left";

type TooltipState = {
  label: string;
  x: number;
  y: number;
  placement: TooltipPlacement;
};

function generateEllipsePath(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}

function generateCirclePath(cx: number, cy: number, r: number): string {
  return generateEllipsePath(cx, cy, r, r);
}

function generateSquarePath(cx: number, cy: number, size: number): string {
  const h = size / 2;
  return `M ${cx - h} ${cy - h} L ${cx + h} ${cy - h} L ${cx + h} ${cy + h} L ${cx - h} ${cy + h} Z`;
}

function generateRectanglePath(cx: number, cy: number, w: number, h: number): string {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx - hw} ${cy - hh} L ${cx + hw} ${cy - hh} L ${cx + hw} ${cy + hh} L ${cx - hw} ${cy + hh} Z`;
}

function generateTrianglePath(cx: number, cy: number, size: number): string {
  const height = (size * Math.sqrt(3)) / 2;
  const hs = size / 2;
  return `M ${cx} ${cy - height / 1.5} L ${cx + hs} ${cy + height / 3} L ${cx - hs} ${cy + height / 3} Z`;
}

function generateStarPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  points: number,
): string {
  const step = Math.PI / points;
  let path = "";

  for (let i = 0; i < 2 * points; i += 1) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }

  return `${path} Z`;
}

function generateHeartPath(cx: number, cy: number, size: number): string {
  const s = size / 30;
  return `M ${cx} ${cy + 12 * s} C ${cx - 20 * s} ${cy - 5 * s}, ${cx - 12 * s} ${cy - 18 * s}, ${cx} ${cy - 8 * s} C ${cx + 12 * s} ${cy - 18 * s}, ${cx + 20 * s} ${cy - 5 * s}, ${cx} ${cy + 12 * s}`;
}

function generateInfinityPath(cx: number, cy: number, w: number, h: number): string {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx} ${cy} C ${cx + hw * 0.5} ${cy - hh}, ${cx + hw} ${cy - hh}, ${cx + hw} ${cy} C ${cx + hw} ${cy + hh}, ${cx + hw * 0.5} ${cy + hh}, ${cx} ${cy} C ${cx - hw * 0.5} ${cy + hh}, ${cx - hw} ${cy + hh}, ${cx - hw} ${cy} C ${cx - hw} ${cy - hh}, ${cx - hw * 0.5} ${cy - hh}, ${cx} ${cy}`;
}

function generateWavePath(cx: number, cy: number, w: number, amplitude: number, waves: number): string {
  const pts: string[] = [];
  const segs = waves * 20;
  const hw = w / 2;

  for (let i = 0; i <= segs; i += 1) {
    const x = cx - hw + (w * i) / segs;
    const y = cy + Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }

  for (let i = segs; i >= 0; i -= 1) {
    const x = cx - hw + (w * i) / segs;
    const y = cy - Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(`L ${x} ${y}`);
  }

  return `${pts.join(" ")} Z`;
}

function OrbitItem({
  item,
  label,
  index,
  totalItems,
  path,
  itemSize,
  rotation,
  progress,
  fill,
  onHoverChange,
  onTooltipChange,
  onTooltipClose,
}: OrbitItemProps) {
  const itemOffset = fill ? (index / totalItems) * 100 : 0;

  const offsetDistance = useTransform(progress, (p: number) => {
    const offset = (((p + itemOffset) % 100) + 100) % 100;
    return `${offset}%`;
  });

  const motionStyle = {
    width: itemSize,
    height: itemSize,
    offsetPath: `path("${path}")`,
    offsetRotate: "0deg",
    offsetAnchor: "center center",
    offsetDistance,
  } as unknown as CSSProperties;

  return (
    <motion.div
      data-orbit-item
      className="absolute select-none will-change-transform"
      style={motionStyle}
      onMouseEnter={(event) => {
        onHoverChange?.(true);
        onTooltipChange?.(label, event.currentTarget.getBoundingClientRect());
      }}
      onMouseLeave={() => {
        onHoverChange?.(false);
        onTooltipClose?.();
      }}
      onFocus={(event) => {
        onHoverChange?.(true);
        onTooltipChange?.(label, event.currentTarget.getBoundingClientRect());
      }}
      onBlur={() => {
        onHoverChange?.(false);
        onTooltipClose?.();
      }}
    >
      <div style={{ transform: `rotate(${-rotation}deg)` }}>{item}</div>
    </motion.div>
  );
}

function rectIntersectionArea(a: DOMRect | DOMRectReadOnly, b: DOMRect | DOMRectReadOnly) {
  const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return x * y;
}

function getTooltipCandidates(anchor: DOMRect, label: string) {
  const width = Math.min(Math.max(label.length * 11 + 54, 128), 270);
  const height = 50;
  const gap = 16;

  return [
    {
      placement: "top" as const,
      x: anchor.left + anchor.width / 2,
      y: anchor.top - gap,
      rect: new DOMRect(anchor.left + anchor.width / 2 - width / 2, anchor.top - gap - height, width, height),
    },
    {
      placement: "bottom" as const,
      x: anchor.left + anchor.width / 2,
      y: anchor.bottom + gap,
      rect: new DOMRect(anchor.left + anchor.width / 2 - width / 2, anchor.bottom + gap, width, height),
    },
    {
      placement: "right" as const,
      x: anchor.right + gap,
      y: anchor.top + anchor.height / 2,
      rect: new DOMRect(anchor.right + gap, anchor.top + anchor.height / 2 - height / 2, width, height),
    },
    {
      placement: "left" as const,
      x: anchor.left - gap,
      y: anchor.top + anchor.height / 2,
      rect: new DOMRect(anchor.left - gap - width, anchor.top + anchor.height / 2 - height / 2, width, height),
    },
  ];
}

export default function OrbitImages({
  images = [],
  imageLabels = [],
  altPrefix = "Orbiting image",
  shape = "ellipse",
  customPath,
  baseWidth = 1400,
  radiusX = 700,
  radiusY = 170,
  radius = 300,
  starPoints = 5,
  starInnerRatio = 0.5,
  rotation = -8,
  duration = 40,
  itemSize = 64,
  direction = "normal",
  fill = true,
  width = 100,
  height = 100,
  className = "",
  showPath = false,
  pathColor = "rgba(0,0,0,0.1)",
  pathWidth = 2,
  easing = "linear",
  paused = false,
  pauseOnHover = false,
  centerContent,
  responsive = false,
  responsiveScaleAxis = "width",
  responsiveAspectRatio = "1 / 1",
}: OrbitImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isItemHovered, setIsItemHovered] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const designCenterX = baseWidth / 2;
  const designCenterY = baseWidth / 2;

  const path = useMemo(() => {
    switch (shape) {
      case "circle":
        return generateCirclePath(designCenterX, designCenterY, radius);
      case "ellipse":
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY);
      case "square":
        return generateSquarePath(designCenterX, designCenterY, radius * 2);
      case "rectangle":
        return generateRectanglePath(designCenterX, designCenterY, radiusX * 2, radiusY * 2);
      case "triangle":
        return generateTrianglePath(designCenterX, designCenterY, radius * 2);
      case "star":
        return generateStarPath(
          designCenterX,
          designCenterY,
          radius,
          radius * starInnerRatio,
          starPoints,
        );
      case "heart":
        return generateHeartPath(designCenterX, designCenterY, radius * 2);
      case "infinity":
        return generateInfinityPath(designCenterX, designCenterY, radiusX * 2, radiusY * 2);
      case "wave":
        return generateWavePath(designCenterX, designCenterY, radiusX * 2, radiusY, 3);
      case "custom":
        return customPath || generateCirclePath(designCenterX, designCenterY, radius);
      default:
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY);
    }
  }, [
    shape,
    customPath,
    designCenterX,
    designCenterY,
    radiusX,
    radiusY,
    radius,
    starPoints,
    starInnerRatio,
  ]);

  useEffect(() => {
    if (!responsive || !containerRef.current) return;

    const updateScale = () => {
      if (!containerRef.current) return;
      const dimension =
        responsiveScaleAxis === "height"
          ? containerRef.current.clientHeight
          : containerRef.current.clientWidth;
      setScale(dimension / baseWidth);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [responsive, baseWidth, responsiveScaleAxis]);

  const progress = useMotionValue(0);
  const isAnimationPaused = paused || (pauseOnHover && isItemHovered);

  useEffect(() => {
    if (isAnimationPaused) return;

    const controls = animate(progress, direction === "reverse" ? -100 : 100, {
      duration,
      ease: easing,
      repeat: Infinity,
      repeatType: "loop",
    });

    return () => controls.stop();
  }, [progress, duration, easing, direction, isAnimationPaused]);

  const updateTooltip = useCallback((label: string, anchorRect: DOMRect) => {
    const orbitRects = Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>("[data-orbit-item]") ?? [],
    )
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rectIntersectionArea(rect, anchorRect) < rect.width * rect.height * 0.5);

    const viewportMargin = 12;
    const candidates = getTooltipCandidates(anchorRect, label);
    const bestCandidate = candidates.reduce((best, candidate) => {
      const offscreenPenalty =
        Math.max(0, viewportMargin - candidate.rect.left) * 80 +
        Math.max(0, candidate.rect.right - (window.innerWidth - viewportMargin)) * 80 +
        Math.max(0, viewportMargin - candidate.rect.top) * 80 +
        Math.max(0, candidate.rect.bottom - (window.innerHeight - viewportMargin)) * 80;
      const iconPenalty = orbitRects.reduce(
        (sum, rect) => sum + rectIntersectionArea(candidate.rect, rect),
        0,
      );
      const score = offscreenPenalty + iconPenalty * 18;

      return score < best.score ? { candidate, score } : best;
    }, { candidate: candidates[0], score: Number.POSITIVE_INFINITY });

    setTooltip({
      label,
      x: bestCandidate.candidate.x,
      y: bestCandidate.candidate.y,
      placement: bestCandidate.candidate.placement,
    });
  }, []);

  const containerWidth = responsive
    ? "100%"
    : typeof width === "number"
      ? width
      : "100%";
  const containerHeight = responsive
    ? "auto"
    : typeof height === "number"
      ? height
      : typeof width === "number"
        ? width
        : "auto";

  const items = images.map((src, index) => {
    const label = imageLabels[index] || `${altPrefix} ${index + 1}`;

    return (
      <div
        key={`${src}-${label}`}
        className="group/orbit-item relative h-full w-full rounded-full outline-none"
        tabIndex={0}
        aria-label={label}
      >
        <img
          src={src}
          alt={label}
          draggable={false}
          className="h-full w-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/orbit-item:scale-110 group-focus-visible/orbit-item:scale-110"
        />
      </div>
    );
  });

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto ${className}`}
      style={{
        width: containerWidth,
        height: containerHeight,
        aspectRatio: responsive ? responsiveAspectRatio : undefined,
      }}
      aria-hidden="true"
    >
      <div
        className={responsive ? "absolute left-1/2 top-1/2" : "relative h-full w-full"}
        style={{
          width: responsive ? baseWidth : "100%",
          height: responsive ? baseWidth : "100%",
          transform: responsive ? `translate(-50%, -50%) scale(${scale})` : undefined,
          transformOrigin: "center center",
        }}
      >
        <div
          className="relative h-full w-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "center center",
          }}
        >
          {showPath && (
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${baseWidth} ${baseWidth}`}
              className="pointer-events-none absolute inset-0"
            >
              <path
                d={path}
                fill="none"
                stroke={pathColor}
                strokeWidth={pathWidth / scale}
              />
            </svg>
          )}

          {items.map((item, index) => (
            <OrbitItem
              key={index}
              item={item}
              label={imageLabels[index] || `${altPrefix} ${index + 1}`}
              index={index}
              totalItems={items.length}
              path={path}
              itemSize={itemSize}
              rotation={rotation}
              progress={progress}
              fill={fill}
              onHoverChange={pauseOnHover ? setIsItemHovered : undefined}
              onTooltipChange={updateTooltip}
              onTooltipClose={() => setTooltip(null)}
            />
          ))}
        </div>
      </div>

      {centerContent && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {centerContent}
        </div>
      )}

      {typeof document !== "undefined" && tooltip
        ? createPortal(
            <div
              className="pointer-events-none fixed z-[100] whitespace-nowrap rounded-full border border-[#8db7ff]/32 bg-[#061427]/96 px-6 py-3 font-mono text-lg font-black text-white shadow-[0_14px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)]"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform:
                  tooltip.placement === "top"
                    ? "translate(-50%, -100%)"
                    : tooltip.placement === "bottom"
                      ? "translate(-50%, 0)"
                      : tooltip.placement === "left"
                        ? "translate(-100%, -50%)"
                        : "translate(0, -50%)",
              }}
            >
              {tooltip.label}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
