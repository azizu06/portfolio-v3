"use client";

import { useEffect, useRef } from "react";
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import type { OGLRenderingContext } from "ogl";
import styles from "./CircularGallery.module.css";

type GalleryItem = {
  image: string;
  text: string;
};

type CircularGalleryProps = {
  items?: GalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
};

type ScreenSize = {
  width: number;
  height: number;
};

type ViewportSize = {
  width: number;
  height: number;
};

type ScrollState = {
  ease: number;
  current: number;
  target: number;
  last: number;
  position?: number;
};

type PointerPosition = {
  x: number;
  y: number;
} | null;

function debounce<T extends (...args: never[]) => void>(func: T, wait: number) {
  let timeout: number | undefined;

  return (...args: Parameters<T>) => {
    if (timeout) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => func(...args), wait);
  };
}

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

function createTextTexture(
  gl: OGLRenderingContext,
  text: string,
  font = "600 30px Geist, sans-serif",
  color = "#ffffff",
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create gallery text canvas context.");
  }

  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const fontSize = Number.parseInt(font.match(/(\d+)px/)?.[1] ?? "30", 10);
  const textHeight = Math.ceil(fontSize * 1.45);

  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  const shine = context.createLinearGradient(0, 0, canvas.width, 0);
  shine.addColorStop(0, "rgba(234,242,255,0.7)");
  shine.addColorStop(0.38, color);
  shine.addColorStop(0.5, "#ffffff");
  shine.addColorStop(0.62, color);
  shine.addColorStop(1, "rgba(234,242,255,0.72)");
  context.fillStyle = shine;
  context.shadowColor = "rgba(255,255,255,0.28)";
  context.shadowBlur = 12;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;

  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  private gl: OGLRenderingContext;
  private plane: Mesh;
  private text: string;
  private textColor: string;
  private font: string;

  mesh!: Mesh;

  constructor({
    gl,
    plane,
    text,
    textColor = "#ffffff",
    font = "600 30px Geist, sans-serif",
  }: {
    gl: OGLRenderingContext;
    plane: Mesh;
    text: string;
    textColor?: string;
    font?: string;
  }) {
    this.gl = gl;
    this.plane = plane;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor,
    );
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });

    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = 0.34;
    const textWidth = textHeight * aspect;

    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -0.76;
    this.mesh.position.z = 0.01;
    this.mesh.setParent(this.plane);
  }

  onResize() {
    this.mesh.position.y = -0.76;
  }
}

class Media {
  private geometry: Plane;
  private gl: OGLRenderingContext;
  private image: string;
  private index: number;
  private length: number;
  private scene: Transform;
  private screen: ScreenSize;
  private text: string;
  private viewport: ViewportSize;
  private bend: number;
  private textColor: string;
  private borderRadius: number;
  private font: string;
  private title?: Title;
  private extra = 0;
  private x = 0;
  private width = 0;
  private widthTotal = 0;
  private baseScaleX = 1;
  private baseScaleY = 1;
  private hoverScale = 1;

  plane!: Mesh;
  program!: Program;

  get snapWidth() {
    return this.width;
  }

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
  }: {
    geometry: Plane;
    gl: OGLRenderingContext;
    image: string;
    index: number;
    length: number;
    scene: Transform;
    screen: ScreenSize;
    text: string;
    viewport: ViewportSize;
    bend: number;
    textColor: string;
    borderRadius?: number;
    font: string;
  }) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [1, 1] },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [
        img.naturalWidth,
        img.naturalHeight,
      ];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(
    scroll: ScrollState,
    direction: "left" | "right",
    pointer: PointerPosition,
  ) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const halfWidth = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const bend = Math.abs(this.bend);
      const radius = (halfWidth * halfWidth + bend * bend) / (2 * bend);
      const effectiveX = Math.min(Math.abs(x), halfWidth);
      const arc = radius - Math.sqrt(radius * radius - effectiveX * effectiveX);

      this.plane.position.y = this.bend > 0 ? -arc : arc;
      this.plane.rotation.z =
        (this.bend > 0 ? -1 : 1) *
        Math.sign(x) *
        Math.asin(effectiveX / radius);
    }

    const isHovered = this.containsPointer(pointer);
    const targetScale = isHovered ? 1.055 : 1;
    this.hoverScale = lerp(this.hoverScale, targetScale, 0.12);
    this.plane.scale.set(
      this.baseScaleX * this.hoverScale,
      this.baseScaleY * this.hoverScale,
      1,
    );

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    const isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    const isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === "right" && isBefore) {
      this.extra -= this.widthTotal;
    }

    if (direction === "left" && isAfter) {
      this.extra += this.widthTotal;
    }
  }

  containsPointer(pointer: PointerPosition) {
    if (!pointer) return false;

    const halfWidth = this.baseScaleX / 2;
    const halfHeight = this.baseScaleY / 2;

    return (
      pointer.x >= this.plane.position.x - halfWidth &&
      pointer.x <= this.plane.position.x + halfWidth &&
      pointer.y >= this.plane.position.y - halfHeight &&
      pointer.y <= this.plane.position.y + halfHeight
    );
  }

  onResize({ screen, viewport }: { screen?: ScreenSize; viewport?: ViewportSize } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    const scale = this.screen.height / 1500;
    this.baseScaleY = (this.viewport.height * (1160 * scale)) / this.screen.height;
    this.baseScaleX = (this.viewport.width * (1920 * scale)) / this.screen.width;
    this.plane.scale.set(
      this.baseScaleX * this.hoverScale,
      this.baseScaleY * this.hoverScale,
      1,
    );
    this.plane.program.uniforms.uPlaneSizes.value = [
      this.baseScaleX,
      this.baseScaleY,
    ];
    this.title?.onResize();
    this.width = this.baseScaleX + 3.15;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class CircularGalleryApp {
  private container: HTMLDivElement;
  private items?: GalleryItem[];
  private bend: number;
  private textColor: string;
  private borderRadius: number;
  private font: string;
  private scrollSpeed: number;
  private scroll: ScrollState;
  private renderer!: Renderer;
  private gl!: OGLRenderingContext;
  private camera!: Camera;
  private scene!: Transform;
  private screen!: ScreenSize;
  private viewport!: ViewportSize;
  private planeGeometry!: Plane;
  private medias!: Media[];
  private raf = 0;
  private isDown = false;
  private start = 0;
  private pointer: PointerPosition = null;
  private onCheckDebounce: () => void;

  constructor(
    container: HTMLDivElement,
    {
      items,
      bend = 3,
      textColor = "#ffffff",
      borderRadius = 0.05,
      font = "600 30px Geist, sans-serif",
      scrollSpeed = 2,
      scrollEase = 0.05,
    }: CircularGalleryProps = {},
  ) {
    this.container = container;
    this.items = items;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias();
    this.setInitialScrollPosition();
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }

  createMedias() {
    const fallbackItems = [
      { image: "/assets/about-gallery/about-01.webp", text: "UCF" },
      { image: "/assets/about-gallery/about-02.webp", text: "Research" },
      { image: "/assets/about-gallery/about-03.webp", text: "Hackathons" },
    ];
    const galleryItems = this.items?.length ? this.items : fallbackItems;
    const mediasImages = galleryItems.concat(galleryItems);

    this.medias = mediasImages.map(
      (data, index) =>
        new Media({
          geometry: this.planeGeometry,
          gl: this.gl,
          image: data.image,
          index,
          length: mediasImages.length,
          scene: this.scene,
          screen: this.screen,
          text: data.text,
          viewport: this.viewport,
          bend: this.bend,
          textColor: this.textColor,
          borderRadius: this.borderRadius,
          font: this.font,
        }),
    );
  }

  setInitialScrollPosition() {
    if (!this.medias?.[0]) return;

    const midpointIndex = Math.floor(this.medias.length / 2);
    const midpoint = this.medias[0].snapWidth * midpointIndex;

    this.scroll.current = midpoint;
    this.scroll.target = midpoint;
    this.scroll.last = midpoint;
    this.scroll.position = midpoint;
  }

  onTouchDown = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
      this.updatePointerPosition(event);
    }
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start =
      "touches" in event ? event.touches[0]?.clientX ?? 0 : event.clientX;
  };

  onTouchMove = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
      this.updatePointerPosition(event);
    }

    if (!this.isDown) return;

    const x =
      "touches" in event ? event.touches[0]?.clientX ?? 0 : event.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = (this.scroll.position ?? 0) + distance;
  };

  onTouchUp = () => {
    this.isDown = false;
    this.onCheck();
  };

  onMouseLeave = () => {
    this.pointer = null;
    this.onTouchUp();
  };

  updatePointerPosition(event: MouseEvent) {
    const rect = this.container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * this.viewport.width;
    const y = (0.5 - (event.clientY - rect.top) / rect.height) * this.viewport.height;

    this.pointer = { x, y };
  }

  onWheel = (event: WheelEvent) => {
    const delta = event.deltaY || event.detail;
    this.scroll.target +=
      (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  };

  onCheck() {
    if (!this.medias?.[0]) return;
    const width = this.medias[0].snapWidth;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize = () => {
    this.screen = {
      width: Math.max(this.container.clientWidth, 1),
      height: Math.max(this.container.clientHeight, 1),
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });

    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = { width, height };

    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport }),
      );
    }
  };

  update = () => {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease,
    );
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    this.medias?.forEach((media) =>
      media.update(this.scroll, direction, this.pointer),
    );
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update);
  };

  addEventListeners() {
    window.addEventListener("resize", this.onResize);
    this.container.addEventListener("wheel", this.onWheel, { passive: true });
    this.container.addEventListener("mousedown", this.onTouchDown);
    this.container.addEventListener("mousemove", this.onTouchMove);
    this.container.addEventListener("mouseup", this.onTouchUp);
    this.container.addEventListener("mouseleave", this.onMouseLeave);
    this.container.addEventListener("touchstart", this.onTouchDown, {
      passive: true,
    });
    this.container.addEventListener("touchmove", this.onTouchMove, {
      passive: true,
    });
    this.container.addEventListener("touchend", this.onTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    this.container.removeEventListener("wheel", this.onWheel);
    this.container.removeEventListener("mousedown", this.onTouchDown);
    this.container.removeEventListener("mousemove", this.onTouchMove);
    this.container.removeEventListener("mouseup", this.onTouchUp);
    this.container.removeEventListener("mouseleave", this.onMouseLeave);
    this.container.removeEventListener("touchstart", this.onTouchDown);
    this.container.removeEventListener("touchmove", this.onTouchMove);
    this.container.removeEventListener("touchend", this.onTouchUp);

    if (this.gl.canvas.parentNode) {
      this.gl.canvas.parentNode.removeChild(this.gl.canvas);
    }

    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "600 30px Geist, sans-serif",
  scrollSpeed = 2,
  scrollEase = 0.05,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new CircularGalleryApp(containerRef.current, {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
    });

    return () => app.destroy();
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);

  return <div className={styles.circularGallery} ref={containerRef} />;
}
