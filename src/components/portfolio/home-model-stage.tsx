"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, type ThreeEvent, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import CountUp from "@/components/CountUp";
import { LiquidPillNav } from "@/components/portfolio/liquid-pill-nav";
import type { PillNavItem } from "@/components/PillNav";

const MODEL_PATH = "/models/sci-fi-lab-2k-web.glb";
const MODEL_CENTER = new THREE.Vector3(
  3.978700399398805,
  0,
  -3.028443038463591,
);
const MODEL_SCALE = 0.46;
const MODEL_ROTATION_Y = THREE.MathUtils.degToRad(3);
const HOME_VIEW_TARGET = new THREE.Vector3(0.08, 0.74, -0.16);
const HOME_VIEW_POSITION = new THREE.Vector3(0.08, 1.2, 6.62);
const GLASS_MATERIAL_HINTS = ["szyb", "glass", "rura_glowna_szybka"];
const CONTROL_PANEL_MATERIAL = "panel_sterowania";
const TRANSPARENT_PRIORITY_HINTS = [...GLASS_MATERIAL_HINTS, "szafka"];
const CUTAWAY_ROOF_MESHES = new Set(["Object_15", "Object_26"]);

type LabHotspotId = "about" | "skills" | "projects" | "experience";

type LabHotspot = {
  id: LabHotspotId;
  label: string;
  detail: string;
  stationLabel: string;
  stationHint: string;
  href?: string;
  position: THREE.Vector3;
  anchorScale?: number;
  focusPosition: THREE.Vector3;
  focusTarget: THREE.Vector3;
};

function labPoint(x: number, y: number, z: number) {
  return new THREE.Vector3(x, y, z).applyAxisAngle(
    new THREE.Vector3(0, 1, 0),
    MODEL_ROTATION_Y,
  );
}

const LAB_HOTSPOTS: LabHotspot[] = [
  {
    id: "about",
    label: "About",
    detail: "Incubator",
    stationLabel: "Incubator",
    stationHint: "About",
    href: "/about",
    position: labPoint(-0.45, 1.02, -0.91),
    anchorScale: 0.78,
    focusPosition: labPoint(-0.35, 1.02, 2.08),
    focusTarget: labPoint(-0.35, 0.92, -0.72),
  },
  {
    id: "skills",
    label: "Skills",
    detail: "Analysis bay",
    stationLabel: "Analysis Bay",
    stationHint: "Skills",
    href: "/skills",
    position: labPoint(-5.72, 1.37, -0.22),
    focusPosition: labPoint(-0.7, 0.88, -0.62),
    focusTarget: labPoint(-2.75, 0.66, -0.62),
  },
  {
    id: "projects",
    label: "Projects",
    detail: "Control panel",
    stationLabel: "Control Panel",
    stationHint: "Projects",
    href: "/projects",
    position: labPoint(3.18, 0.9, 0.64),
    anchorScale: 0.58,
    focusPosition: labPoint(0.92, 0.84, 0.64),
    focusTarget: labPoint(3.12, 0.78, 0.64),
  },
  {
    id: "experience",
    label: "Experience",
    detail: "Gate access",
    stationLabel: "Gate",
    stationHint: "Experience",
    href: "/experience",
    position: labPoint(1.85, 0.62, -1.5),
    anchorScale: 0.66,
    focusPosition: labPoint(1.98, 0.86, 1.18),
    focusTarget: labPoint(1.92, 0.82, -1.5),
  },
];

function easeSmooth(value: number) {
  return THREE.MathUtils.smootherstep(value, 0, 1);
}

function SciFiLabModel({
  onReady,
}: {
  onReady: () => void;
}) {
  const gltf = useGLTF(MODEL_PATH);
  const model = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    model.traverse((object) => {
      const mesh = object as THREE.Mesh;

      if (!mesh.isMesh) {
        return;
      }

      if (CUTAWAY_ROOF_MESHES.has(mesh.name)) {
        mesh.visible = false;
        return;
      }

      mesh.frustumCulled = false;
      mesh.castShadow = false;
      mesh.receiveShadow = false;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      const hasTransparentMaterial = materials.some(
        (material) =>
          Boolean(material?.transparent) ||
          (typeof material?.opacity === "number" && material.opacity < 1) ||
          Boolean(material && "alphaMap" in material && material.alphaMap),
      );
      const hasGlassMaterial = materials.some((material) => {
        const materialName = material?.name?.toLowerCase() ?? "";
        return GLASS_MATERIAL_HINTS.some((hint) => materialName.includes(hint));
      });
      const needsStableTransparentOrder = materials.some((material) => {
        const materialName = material?.name?.toLowerCase() ?? "";
        return TRANSPARENT_PRIORITY_HINTS.some((hint) =>
          materialName.includes(hint),
        );
      });

      if (hasTransparentMaterial) {
        mesh.renderOrder = needsStableTransparentOrder ? 30 : 12;
      }

      materials.forEach((material) => {
        if (!material) {
          return;
        }

        material.needsUpdate = true;
        const materialName = material.name?.toLowerCase() ?? "";
        const isControlPanelMaterial = materialName === CONTROL_PANEL_MATERIAL;

        if ("envMapIntensity" in material) {
          material.envMapIntensity = 0.62;
        }

        material.side = isControlPanelMaterial
          ? THREE.FrontSide
          : THREE.DoubleSide;

        if (hasTransparentMaterial) {
          material.transparent = true;
          material.depthWrite = isControlPanelMaterial;
          material.depthTest = true;
          material.blending = THREE.NormalBlending;
          material.alphaTest = isControlPanelMaterial ? 0.12 : 0;

          if (isControlPanelMaterial) {
            material.polygonOffset = true;
            material.polygonOffsetFactor = -1;
            material.polygonOffsetUnits = -1;
          }

          if (hasGlassMaterial) {
            material.opacity = Math.min(material.opacity, 0.88);
          }

          if ("forceSinglePass" in material) {
            material.forceSinglePass = true;
          }
        }
      });
    });

    onReady();
  }, [model, onReady]);

  return (
    <group rotation={[0, MODEL_ROTATION_Y, 0]} scale={MODEL_SCALE}>
      <primitive
        object={model}
        position={[-MODEL_CENTER.x, 0, -MODEL_CENTER.z]}
      />
    </group>
  );
}

function CameraFocusMove({
  focus,
  onComplete,
}: {
  focus: LabHotspot;
  onComplete: () => void;
}) {
  const startPosition = useRef<THREE.Vector3 | null>(null);
  const startQuaternion = useRef<THREE.Quaternion | null>(null);
  const endQuaternion = useRef<THREE.Quaternion | null>(null);
  const cameraPoint = useMemo(() => new THREE.Vector3(), []);
  const easedQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const elapsed = useRef(0);
  const complete = useRef(false);

  useFrame(({ camera }, delta) => {
    if (
      !startPosition.current ||
      !startQuaternion.current ||
      !endQuaternion.current
    ) {
      startPosition.current = camera.position.clone();
      startQuaternion.current = camera.quaternion.clone();

      const targetCamera = new THREE.PerspectiveCamera();
      targetCamera.position.copy(focus.focusPosition);
      targetCamera.lookAt(focus.focusTarget);
      endQuaternion.current = targetCamera.quaternion.clone();
    }

    elapsed.current += delta;
    const progress = easeSmooth(
      THREE.MathUtils.clamp(elapsed.current / 1.18, 0, 1),
    );

    cameraPoint.lerpVectors(
      startPosition.current,
      focus.focusPosition,
      progress,
    );
    camera.position.copy(cameraPoint);
    easedQuaternion
      .copy(startQuaternion.current)
      .slerp(endQuaternion.current, progress);
    camera.quaternion.copy(easedQuaternion);

    if (progress >= 1 && !complete.current) {
      complete.current = true;
      onComplete();
    }
  });

  return null;
}

function CameraOverviewMove({ onComplete }: { onComplete: () => void }) {
  const startPosition = useRef<THREE.Vector3 | null>(null);
  const startLookPoint = useRef<THREE.Vector3 | null>(null);
  const cameraPoint = useMemo(() => new THREE.Vector3(), []);
  const lookPoint = useMemo(() => new THREE.Vector3(), []);
  const elapsed = useRef(0);
  const complete = useRef(false);

  useFrame(({ camera }, delta) => {
    if (!startPosition.current || !startLookPoint.current) {
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      startPosition.current = camera.position.clone();
      startLookPoint.current = camera.position
        .clone()
        .add(direction.multiplyScalar(5));
    }

    elapsed.current += delta;
    const progress = easeSmooth(
      THREE.MathUtils.clamp(elapsed.current / 0.85, 0, 1),
    );

    cameraPoint.lerpVectors(startPosition.current, HOME_VIEW_POSITION, progress);
    lookPoint.lerpVectors(startLookPoint.current, HOME_VIEW_TARGET, progress);
    camera.position.copy(cameraPoint);
    camera.lookAt(lookPoint);

    if (progress >= 1 && !complete.current) {
      complete.current = true;
      onComplete();
    }
  });

  return null;
}

function OverviewCamera({
  enabled,
  resetKey,
}: {
  enabled: boolean;
  resetKey: number;
}) {
  const settled = useRef(false);
  const lastResetKey = useRef(resetKey);

  useFrame(({ camera }) => {
    if (lastResetKey.current !== resetKey) {
      settled.current = false;
      lastResetKey.current = resetKey;
    }

    if (!enabled || settled.current) {
      return;
    }

    camera.position.copy(HOME_VIEW_POSITION);
    camera.lookAt(HOME_VIEW_TARGET);
    settled.current = true;
  });

  return null;
}

function SelectedHotspotAnchor({
  hotspot,
  onSelect,
}: {
  hotspot: LabHotspot | null;
  onSelect: (hotspot: LabHotspot) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ camera, clock }) => {
    const group = groupRef.current;

    if (!group || !hotspot) {
      return;
    }

    const pulse = (hotspot.anchorScale ?? 1) *
      (1 + Math.sin(clock.elapsedTime * 3.1) * 0.08);
    group.scale.setScalar(pulse);
    group.lookAt(camera.position);
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = "";
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();

    if (hotspot) {
      onSelect(hotspot);
    }
  };

  if (!hotspot) {
    return null;
  }

  const isProjectsAnchor = hotspot.id === "projects";
  const anchorColors = {
    light: isProjectsAnchor ? "#ffffff" : "#d9f7ff",
    ring: isProjectsAnchor ? "#dbeafe" : "#90ecff",
    outer: isProjectsAnchor ? "#eaf2ff" : "#7dd3fc",
  };

  return (
    <group
      ref={groupRef}
      position={hotspot.position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <pointLight color={anchorColors.outer} intensity={0.34} distance={0.8} />
      <mesh renderOrder={52}>
        <sphereGeometry args={[0.048, 24, 24]} />
        <meshBasicMaterial
          color={anchorColors.light}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
      <mesh renderOrder={51}>
        <torusGeometry args={[0.15, 0.006, 18, 72]} />
        <meshBasicMaterial
          color={anchorColors.ring}
          depthTest={false}
          transparent
          opacity={isProjectsAnchor ? 0.96 : 0.86}
          toneMapped={false}
        />
      </mesh>
      <mesh renderOrder={50}>
        <torusGeometry args={[0.24, 0.004, 18, 96]} />
        <meshBasicMaterial
          color={anchorColors.outer}
          depthTest={false}
          transparent
          opacity={isProjectsAnchor ? 0.54 : 0.28}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function StationHud({
  hotspot,
  onSelect,
}: {
  hotspot: LabHotspot | null;
  onSelect: (hotspot: LabHotspot) => void;
}) {
  if (!hotspot) {
    return null;
  }

  return (
    <div
      data-station-hud
      className="pointer-events-none fixed inset-x-0 bottom-[5.75rem] z-20 px-5 sm:bottom-8 sm:left-0 sm:right-auto sm:px-8 lg:px-10"
    >
      <div className="pointer-events-auto w-[min(25rem,calc(100vw-2.5rem))] rounded-[1.7rem] border border-sky-100/20 bg-sky-950/35 p-1.5 shadow-[inset_0_1px_0_rgba(234,242,255,0.16),0_22px_70px_rgba(2,8,23,0.42),0_0_34px_rgba(96,216,255,0.14)] backdrop-blur-2xl">
        <div className="rounded-[1.25rem] border border-white/[0.07] bg-[#071527]/78 px-4 py-4 shadow-[inset_0_1px_0_rgba(234,242,255,0.11)] sm:px-5">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-sky-200 shadow-[0_0_16px_rgba(125,211,252,0.86)]" />
            <span className="text-[0.82rem] font-semibold uppercase leading-none tracking-[0.2em] text-sky-100/78 sm:text-[0.92rem]">
              {hotspot.stationLabel}
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-[1.45rem] font-semibold leading-none tracking-tight text-ice sm:text-[1.7rem]">
                {hotspot.label}
              </h2>
            </div>
            <button
              type="button"
              aria-label={`Open ${hotspot.label}`}
              onClick={() => onSelect(hotspot)}
              className="shrink-0 rounded-full border border-sky-100/28 bg-sky-100/10 px-5 py-2.5 text-base font-semibold text-sky-50 shadow-[inset_0_1px_0_rgba(234,242,255,0.18),0_12px_28px_rgba(2,8,23,0.28)] transition-[border-color,background-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-sky-100/62 hover:bg-sky-100/16 hover:shadow-[inset_0_1px_0_rgba(234,242,255,0.24),0_16px_36px_rgba(2,8,23,0.34),0_0_26px_rgba(125,211,252,0.22)] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-100/70"
            >
              Open
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabScene() {
  const router = useRouter();
  const [modelReady, setModelReady] = useState(false);
  const [loaderCounterComplete, setLoaderCounterComplete] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [focusMoveId, setFocusMoveId] = useState(0);
  const [targetHotspot, setTargetHotspot] = useState<LabHotspot | null>(null);
  const [focusedHotspot, setFocusedHotspot] = useState<LabHotspot | null>(null);
  const [labelReady, setLabelReady] = useState(false);
  const [overviewResetKey, setOverviewResetKey] = useState(0);
  const [returningHome, setReturningHome] = useState(false);

  const handleStationSelect = (hotspot: LabHotspot) => {
    if (targetHotspot?.id === hotspot.id || focusedHotspot?.id === hotspot.id) {
      return;
    }

    setReturningHome(false);
    setLabelReady(false);
    setFocusedHotspot(null);
    setTargetHotspot(hotspot);
    setFocusMoveId((current) => current + 1);
  };

  const handleNavSelect = (item: PillNavItem) => {
    const hotspot = LAB_HOTSPOTS.find((entry) => entry.href === item.href);

    if (!hotspot) {
      router.push(item.href);
      return;
    }

    handleStationSelect(hotspot);
  };

  const handleModelReady = useCallback(() => {
    setModelReady(true);
  }, []);

  const handleLoaderCounterComplete = useCallback(() => {
    setLoaderCounterComplete(true);
  }, []);

  const sceneReadyToReveal = modelReady && loaderCounterComplete;

  useEffect(() => {
    if (!sceneReadyToReveal) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowLoader(false);
    }, 850);

    return () => window.clearTimeout(timeout);
  }, [sceneReadyToReveal]);

  const handleFocusComplete = () => {
    if (!targetHotspot) {
      return;
    }

    setFocusedHotspot(targetHotspot);
    setTargetHotspot(null);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setLabelReady(true);
      });
    });
  };

  const handleRouteSelect = (hotspot: LabHotspot) => {
    if (hotspot.href) {
      router.push(hotspot.href);
    }
  };

  const handleLogoReset = () => {
    setLabelReady(false);
    setTargetHotspot(null);
    setFocusedHotspot(null);
    setReturningHome(true);
  };

  const handleOverviewComplete = () => {
    setReturningHome(false);
    setOverviewResetKey((current) => current + 1);
  };

  return (
    <>
      <div
        data-lab-scene
        className={[
          "absolute inset-0 transition-[opacity,filter] duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]",
          sceneReadyToReveal
            ? "opacity-100 blur-0"
            : "opacity-0 blur-[2px]",
        ].join(" ")}
        aria-hidden={!sceneReadyToReveal}
      >
        <Canvas
          camera={{
            position: [
              HOME_VIEW_POSITION.x,
              HOME_VIEW_POSITION.y,
              HOME_VIEW_POSITION.z,
            ],
            fov: 50,
            near: 0.1,
            far: 40,
          }}
          dpr={[1, 1.25]}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
          }}
          performance={{ min: 0.55 }}
        >
          <color attach="background" args={["#061427"]} />
          <fog attach="fog" args={["#061427", 6.2, 14]} />
          <OverviewCamera
            enabled={!targetHotspot && !focusedHotspot && !returningHome}
            resetKey={overviewResetKey}
          />
          {returningHome ? (
            <CameraOverviewMove onComplete={handleOverviewComplete} />
          ) : null}
          {targetHotspot ? (
            <CameraFocusMove
              key={focusMoveId}
              focus={targetHotspot}
              onComplete={handleFocusComplete}
            />
          ) : null}

          <ambientLight intensity={0.62} />
          <hemisphereLight args={["#c9e7ff", "#07101e", 1.45]} />
          <directionalLight position={[2.4, 4.8, 3.6]} intensity={2.15} />
          <pointLight
            position={[0.1, 1.12, 0.16]}
            intensity={3.8}
            color="#62d6ff"
          />
          <pointLight
            position={[-1.8, 0.9, 0.9]}
            intensity={1.45}
            color="#2f6fed"
          />
          <pointLight
            position={[2.3, 1.4, -0.9]}
            intensity={1.15}
            color="#8db7ff"
          />
          <pointLight
            position={[-2.6, 0.36, -2.2]}
            intensity={1.2}
            color="#62d6ff"
          />
          <pointLight
            position={[2.9, 0.36, 1.9]}
            intensity={0.9}
            color="#8db7ff"
          />

          <Suspense fallback={null}>
            <SciFiLabModel onReady={handleModelReady} />
            <SelectedHotspotAnchor
              hotspot={labelReady ? focusedHotspot : null}
              onSelect={handleRouteSelect}
            />
            <Environment preset="night" environmentIntensity={0.52} />
          </Suspense>
        </Canvas>
      </div>

      <StationHud
        hotspot={labelReady ? focusedHotspot : null}
        onSelect={handleRouteSelect}
      />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 px-5 py-8 sm:px-8 lg:px-10">
        <div className="pointer-events-auto">
          <LiquidPillNav
            onItemSelect={handleNavSelect}
            onLogoSelect={handleLogoReset}
          />
        </div>
      </div>

      {showLoader ? (
        <div
          data-lab-loader
          className={[
            "absolute inset-0 z-30 grid place-items-center bg-[#061427] text-ice transition-[opacity,filter] duration-[850ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
            sceneReadyToReveal
              ? "pointer-events-none opacity-0 blur-sm"
              : "opacity-100 blur-0",
          ].join(" ")}
        >
          <div className="relative flex flex-col items-center gap-8 px-6">
            <div className="absolute -inset-24 -z-10 rounded-full bg-[radial-gradient(circle,rgba(96,216,255,0.2),transparent_64%)] blur-3xl" />
            <div className="lab-loader-flask relative h-72 w-64 sm:h-80 sm:w-72">
              <span className="lab-loader-air-bubble left-[54%] top-0 size-3.5" />
              <span className="lab-loader-air-bubble left-[47%] top-9 size-2.5 [animation-delay:0.28s]" />
              <span className="lab-loader-air-bubble left-[59%] top-16 size-2 [animation-delay:0.55s]" />
              <div className="absolute left-1/2 top-12 h-20 w-16 -translate-x-1/2 rounded-t-[1.4rem] border border-sky-100/38 bg-sky-100/[0.1] shadow-[inset_0_1px_0_rgba(234,242,255,0.42),0_0_24px_rgba(186,230,253,0.16)] backdrop-blur-sm" />
              <div className="absolute left-1/2 top-[7.1rem] h-3 w-24 -translate-x-1/2 rounded-full bg-sky-100/38 shadow-[inset_0_1px_0_rgba(255,255,255,0.44),0_0_22px_rgba(186,230,253,0.28)]" />
              <div className="lab-loader-glass absolute left-1/2 top-28 h-40 w-52 -translate-x-1/2 overflow-hidden border border-sky-100/40 bg-sky-100/[0.09] shadow-[inset_0_1px_0_rgba(234,242,255,0.34),inset_0_-20px_42px_rgba(96,216,255,0.1),0_0_58px_rgba(96,216,255,0.2)] backdrop-blur-md sm:h-44 sm:w-60">
                <div className="lab-loader-liquid absolute inset-x-4 bottom-4 h-[5.85rem] overflow-hidden rounded-b-[4.2rem] bg-gradient-to-br from-[#afff5d] via-[#28e32f] to-[#10d85e] shadow-[inset_0_18px_26px_rgba(255,255,255,0.18),0_0_42px_rgba(40,227,47,0.46)] sm:h-[6.65rem]">
                  <div className="lab-loader-wave absolute -left-10 -top-5 h-12 w-72 rounded-[50%] bg-white/18" />
                  <span className="lab-loader-bubble absolute left-8 top-10 size-3 rounded-full bg-white/56" />
                  <span className="lab-loader-bubble absolute left-20 top-14 size-2 rounded-full bg-white/44 [animation-delay:0.35s]" />
                  <span className="lab-loader-bubble absolute right-8 top-8 size-4 rounded-full bg-white/38 [animation-delay:0.7s]" />
                  <span className="lab-loader-bubble absolute right-20 top-16 size-1.5 rounded-full bg-white/45 [animation-delay:1s]" />
                </div>
                <div className="absolute left-10 top-5 h-24 w-3 rounded-full bg-white/26 blur-[1px]" />
                <div className="absolute right-11 top-10 h-16 w-1.5 rounded-full bg-sky-100/22" />
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-5xl font-semibold leading-none tracking-tight text-sky-50 sm:text-6xl">
                <CountUp
                  to={100}
                  duration={2.6}
                  className="tabular-nums"
                  onEnd={handleLoaderCounterComplete}
                />
                <span className="ml-1.5 text-sky-50">%</span>
              </div>
              <p className="mt-4 text-base font-semibold uppercase tracking-[0.3em] text-sky-100/88 sm:text-lg">
                Loading lab environment
              </p>
            </div>
            <style jsx>{`
              .lab-loader-flask {
                animation: flask-mix 1.7s cubic-bezier(0.32, 0.72, 0, 1)
                  infinite;
                transform-origin: 50% 34%;
              }

              .lab-loader-glass {
                clip-path: polygon(
                  32% 0,
                  68% 0,
                  89% 70%,
                  84% 92%,
                  73% 100%,
                  27% 100%,
                  16% 92%,
                  11% 70%
                );
              }

              .lab-loader-air-bubble {
                position: absolute;
                border-radius: 9999px;
                background: #35ea47;
                box-shadow: 0 0 20px rgba(53, 234, 71, 0.72);
                animation: air-bubble-rise 1.85s cubic-bezier(0.32, 0.72, 0, 1)
                  infinite;
              }

              .lab-loader-liquid {
                animation: liquid-pulse 1.7s cubic-bezier(0.32, 0.72, 0, 1)
                  infinite;
                border-radius: 54% 46% 38% 42% / 24% 28% 62% 64%;
              }

              .lab-loader-wave {
                animation: liquid-wave 1.18s cubic-bezier(0.32, 0.72, 0, 1)
                  infinite;
              }

              .lab-loader-bubble {
                animation: bubble-rise 1.38s cubic-bezier(0.32, 0.72, 0, 1)
                  infinite;
              }

              @keyframes flask-mix {
                0%,
                100% {
                  transform: rotate(-3deg) translate3d(0, 0, 0);
                }
                35% {
                  transform: rotate(4deg) translate3d(6px, -2px, 0);
                }
                68% {
                  transform: rotate(-1.5deg) translate3d(-5px, 2px, 0);
                }
              }

              @keyframes air-bubble-rise {
                0% {
                  opacity: 0;
                  transform: translate3d(0, 28px, 0) scale(0.55);
                }
                22% {
                  opacity: 0.95;
                }
                100% {
                  opacity: 0;
                  transform: translate3d(5px, -22px, 0) scale(1.16);
                }
              }

              @keyframes liquid-pulse {
                0%,
                100% {
                  transform: translate3d(0, 0, 0) rotate(-1deg) scaleY(1);
                }
                45% {
                  transform: translate3d(0, -7px, 0) rotate(2deg) scaleY(1.07);
                }
              }

              @keyframes liquid-wave {
                0% {
                  transform: translate3d(-24px, 0, 0) rotate(-2deg);
                }
                100% {
                  transform: translate3d(24px, 3px, 0) rotate(8deg);
                }
              }

              @keyframes bubble-rise {
                0% {
                  opacity: 0;
                  transform: translate3d(0, 18px, 0) scale(0.75);
                }
                30% {
                  opacity: 0.95;
                }
                100% {
                  opacity: 0;
                  transform: translate3d(4px, -26px, 0) scale(1.1);
                }
              }
            `}</style>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function HomeModelStage() {
  return (
    <main className="relative isolate h-[100dvh] w-full max-w-full overflow-hidden overscroll-none bg-[#061427] text-ice">
      <div className="fixed inset-0">
        <LabScene />
      </div>
    </main>
  );
}

useGLTF.preload(MODEL_PATH);
