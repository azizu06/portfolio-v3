"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { LiquidPillNav } from "@/components/portfolio/liquid-pill-nav";
import { profile } from "@/data/profile";

const MODEL_PATH = "/models/sci-fi-lab.glb";
const MODEL_CENTER = new THREE.Vector3(3.978700399398805, 0, -3.028443038463591);
const MODEL_SCALE = 0.46;
const HOME_VIEW_TARGET = new THREE.Vector3(0.02, 0.74, -0.16);
const HOME_VIEW_POSITION = new THREE.Vector3(0.02, 1.22, 6.18);
const INTRO_START_POSITION = new THREE.Vector3(-3.85, 1.04, 2.85);
const SHOT_HOLD_SECONDS = 1;
const SHOT_TRANSITION_SECONDS = 1.8;
const FINAL_ZOOM_SECONDS = 2.8;
const GLASS_MATERIAL_HINTS = ["szyb", "glass", "rura_glowna_szybka"];
const TRANSPARENT_PRIORITY_HINTS = [...GLASS_MATERIAL_HINTS, "szafka"];
const CUTAWAY_ROOF_MESHES = new Set(["Object_15", "Object_26"]);
const CONTROL_BOUNDS = {
  minX: -2.15,
  maxX: 2.35,
  minY: 0.34,
  maxY: 1.22,
  minZ: -1.72,
  maxZ: 1.34,
};

const INTRO_DURATION =
  SHOT_HOLD_SECONDS * 5 + SHOT_TRANSITION_SECONDS * 4 + FINAL_ZOOM_SECONDS;

type LabHotspotId = "about" | "projects" | "experience" | "gate";

type LabHotspot = {
  id: LabHotspotId;
  label: string;
  detail: string;
  href?: string;
  position: THREE.Vector3;
  focusPosition: THREE.Vector3;
  focusTarget: THREE.Vector3;
};

type WalkTarget = {
  id: number;
  point: THREE.Vector3;
};

const WALK_STEP_DISTANCE = 0.52;
const WALK_DURATION_SECONDS = 0.72;

const INTRO_OBJECT_SHOTS = [
  {
    position: INTRO_START_POSITION,
    drift: new THREE.Vector3(0.14, 0, -0.05),
    target: new THREE.Vector3(-2.75, 0.58, -0.62),
  },
  {
    position: new THREE.Vector3(-0.82, 0.78, 1.38),
    drift: new THREE.Vector3(0.06, 0, -0.02),
    target: new THREE.Vector3(0.33, 0.46, 0.18),
  },
  {
    position: new THREE.Vector3(0.05, 1.04, 3.15),
    drift: new THREE.Vector3(0.1, 0, -0.06),
    target: new THREE.Vector3(-0.35, 0.92, -0.72),
  },
  {
    position: new THREE.Vector3(1.05, 0.84, 0.64),
    drift: new THREE.Vector3(0.08, 0, 0),
    target: new THREE.Vector3(2.9, 0.78, 0.64),
  },
  {
    position: new THREE.Vector3(1.68, 0.94, 1.88),
    drift: new THREE.Vector3(0, 0, -0.08),
    target: new THREE.Vector3(1.68, 0.84, -1.55),
  },
];

const LAB_HOTSPOTS: LabHotspot[] = [
  {
    id: "about",
    label: "About",
    detail: "Incubator",
    href: "/about",
    position: new THREE.Vector3(-0.45, 1.22, -0.91),
    focusPosition: new THREE.Vector3(0.05, 1.04, 3.15),
    focusTarget: new THREE.Vector3(-0.35, 0.92, -0.72),
  },
  {
    id: "projects",
    label: "Projects",
    detail: "Green screens",
    href: "/projects",
    position: new THREE.Vector3(2.9, 1.18, 0.64),
    focusPosition: new THREE.Vector3(1.05, 0.84, 0.64),
    focusTarget: new THREE.Vector3(2.9, 0.78, 0.64),
  },
  {
    id: "experience",
    label: "Experience",
    detail: "Lab console",
    href: "/experience",
    position: new THREE.Vector3(0.33, 0.76, 0.18),
    focusPosition: new THREE.Vector3(-0.82, 0.78, 1.38),
    focusTarget: new THREE.Vector3(0.33, 0.46, 0.18),
  },
  {
    id: "gate",
    label: "Contact",
    detail: "Gate access",
    position: new THREE.Vector3(1.68, 0.64, -1.56),
    focusPosition: new THREE.Vector3(1.68, 0.94, 1.88),
    focusTarget: new THREE.Vector3(1.68, 0.84, -1.55),
  },
];

const CONTACT_LINKS = profile.links.filter((link) =>
  ["GitHub", "LinkedIn", "Resume"].includes(link.label),
);

function easeSmooth(value: number) {
  return THREE.MathUtils.smootherstep(value, 0, 1);
}

function getShotEndPosition(shot: (typeof INTRO_OBJECT_SHOTS)[number]) {
  return shot.position.clone().add(shot.drift);
}

function getClampedLabPoint(point: THREE.Vector3) {
  return new THREE.Vector3(
    THREE.MathUtils.clamp(point.x, CONTROL_BOUNDS.minX, CONTROL_BOUNDS.maxX),
    THREE.MathUtils.clamp(point.y, 0.56, CONTROL_BOUNDS.maxY),
    THREE.MathUtils.clamp(point.z, CONTROL_BOUNDS.minZ, CONTROL_BOUNDS.maxZ),
  );
}

function getHorizontalDirection(vector: THREE.Vector3) {
  const direction = vector.clone();
  direction.y = 0;

  if (direction.lengthSq() < 0.0001) {
    return null;
  }

  return direction.normalize();
}

function clampControlsToLab(controls: OrbitControlsImpl) {
  const previousTarget = controls.target.clone();

  controls.target.set(
    THREE.MathUtils.clamp(
      controls.target.x,
      CONTROL_BOUNDS.minX,
      CONTROL_BOUNDS.maxX,
    ),
    THREE.MathUtils.clamp(
      controls.target.y,
      CONTROL_BOUNDS.minY,
      CONTROL_BOUNDS.maxY,
    ),
    THREE.MathUtils.clamp(
      controls.target.z,
      CONTROL_BOUNDS.minZ,
      CONTROL_BOUNDS.maxZ,
    ),
  );

  const targetCorrection = controls.target.clone().sub(previousTarget);

  if (targetCorrection.lengthSq() > 0) {
    controls.object.position.add(targetCorrection);
  }
}

function SciFiLabModel({
  onNavigatePoint,
}: {
  onNavigatePoint: (point: THREE.Vector3) => void;
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
        return GLASS_MATERIAL_HINTS.some((hint) =>
          materialName.includes(hint),
        );
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

        if ("envMapIntensity" in material) {
          material.envMapIntensity = 0.62;
        }

        material.side = THREE.DoubleSide;

        if (hasTransparentMaterial) {
          material.transparent = true;
          material.depthWrite = false;
          material.depthTest = true;
          material.blending = THREE.NormalBlending;
          material.alphaTest = 0;

          if (hasGlassMaterial) {
            material.opacity = Math.min(material.opacity, 0.88);
          }

          if ("forceSinglePass" in material) {
            material.forceSinglePass = true;
          }
        }
      });
    });
  }, [model]);

  const handleModelClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onNavigatePoint(event.point);
  };

  return (
    <group
      position={[
        -MODEL_CENTER.x * MODEL_SCALE,
        0,
        -MODEL_CENTER.z * MODEL_SCALE,
      ]}
      scale={MODEL_SCALE}
      onClick={handleModelClick}
    >
      <primitive object={model} />
    </group>
  );
}

function CinematicIntroCamera({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const shotEndPositions = useMemo(
    () => INTRO_OBJECT_SHOTS.map((shot) => getShotEndPosition(shot)),
    [],
  );
  const cameraPoint = useMemo(() => INTRO_START_POSITION.clone(), []);
  const lookPoint = useMemo(() => INTRO_OBJECT_SHOTS[0].target.clone(), []);

  useFrame(({ camera, clock }) => {
    const elapsed = clock.getElapsedTime();
    let cursor = 0;
    let frameResolved = false;

    for (let index = 0; index < INTRO_OBJECT_SHOTS.length; index += 1) {
      const shot = INTRO_OBJECT_SHOTS[index];
      const shotEndPosition = shotEndPositions[index];

      if (elapsed <= cursor + SHOT_HOLD_SECONDS) {
        const holdProgress = easeSmooth((elapsed - cursor) / SHOT_HOLD_SECONDS);
        cameraPoint.lerpVectors(shot.position, shotEndPosition, holdProgress);
        lookPoint.copy(shot.target);
        frameResolved = true;
        break;
      }

      cursor += SHOT_HOLD_SECONDS;

      if (index < INTRO_OBJECT_SHOTS.length - 1) {
        const nextShot = INTRO_OBJECT_SHOTS[index + 1];

        if (elapsed <= cursor + SHOT_TRANSITION_SECONDS) {
          const rawTransitionProgress =
            (elapsed - cursor) / SHOT_TRANSITION_SECONDS;
          const transitionProgress = easeSmooth(rawTransitionProgress);
          const lookTurnProgress = easeSmooth(
            THREE.MathUtils.clamp(
              (rawTransitionProgress - 0.22) / 0.78,
              0,
              1,
            ),
          );
          cameraPoint.lerpVectors(
            shotEndPosition,
            nextShot.position,
            transitionProgress,
          );
          lookPoint.lerpVectors(
            shot.target,
            nextShot.target,
            lookTurnProgress,
          );
          frameResolved = true;
          break;
        }

        cursor += SHOT_TRANSITION_SECONDS;
      } else if (elapsed <= cursor + FINAL_ZOOM_SECONDS) {
        const zoomProgress = easeSmooth((elapsed - cursor) / FINAL_ZOOM_SECONDS);
        cameraPoint.lerpVectors(
          shotEndPosition,
          HOME_VIEW_POSITION,
          zoomProgress,
        );
        lookPoint.lerpVectors(shot.target, HOME_VIEW_TARGET, zoomProgress);
        frameResolved = true;
        break;
      }
    }

    if (!frameResolved) {
      cameraPoint.copy(HOME_VIEW_POSITION);
      lookPoint.copy(HOME_VIEW_TARGET);
    }

    camera.position.copy(cameraPoint);
    camera.lookAt(lookPoint);

    if (elapsed >= INTRO_DURATION) {
      camera.position.copy(HOME_VIEW_POSITION);
      camera.lookAt(HOME_VIEW_TARGET);
      onComplete();
    }
  });

  return null;
}

function CameraFocusMove({
  focus,
  onComplete,
}: {
  focus: LabHotspot;
  onComplete: () => void;
}) {
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
      startLookPoint.current = camera.position.clone().add(direction.multiplyScalar(5));
    }

    elapsed.current += delta;
    const progress = easeSmooth(THREE.MathUtils.clamp(elapsed.current / 0.95, 0, 1));

    cameraPoint.lerpVectors(startPosition.current, focus.focusPosition, progress);
    lookPoint.lerpVectors(startLookPoint.current, focus.focusTarget, progress);
    camera.position.copy(cameraPoint);
    camera.lookAt(lookPoint);

    if (progress >= 1 && !complete.current) {
      complete.current = true;
      onComplete();
    }
  });

  return null;
}

function CameraWalkMove({
  walkTarget,
  currentTarget,
  onComplete,
}: {
  walkTarget: WalkTarget;
  currentTarget: THREE.Vector3;
  onComplete: (target: THREE.Vector3) => void;
}) {
  const startPosition = useRef<THREE.Vector3 | null>(null);
  const startTarget = useRef<THREE.Vector3 | null>(null);
  const endPosition = useRef<THREE.Vector3 | null>(null);
  const endTarget = useRef<THREE.Vector3 | null>(null);
  const cameraPoint = useMemo(() => new THREE.Vector3(), []);
  const lookPoint = useMemo(() => new THREE.Vector3(), []);
  const elapsed = useRef(0);
  const complete = useRef(false);

  useFrame(({ camera }, delta) => {
    if (
      !startPosition.current ||
      !startTarget.current ||
      !endPosition.current ||
      !endTarget.current
    ) {
      const clickDirection = getHorizontalDirection(
        walkTarget.point.clone().sub(currentTarget),
      );
      const cameraDirection = new THREE.Vector3();

      camera.getWorldDirection(cameraDirection);
      const forwardDirection = getHorizontalDirection(cameraDirection);

      startPosition.current = camera.position.clone();
      startTarget.current = currentTarget.clone();

      if (
        !clickDirection ||
        !forwardDirection ||
        clickDirection.dot(forwardDirection) <= 0
      ) {
        endPosition.current = startPosition.current.clone();
        endTarget.current = startTarget.current.clone();
      } else {
        const horizontalDistance = walkTarget.point
          .clone()
          .sub(currentTarget)
          .setY(0)
          .length();
        const stepDistance = Math.min(WALK_STEP_DISTANCE, horizontalDistance);
        const movement = clickDirection.multiplyScalar(stepDistance);

        endPosition.current = camera.position.clone().add(movement);
        endTarget.current = getClampedLabPoint(currentTarget.clone().add(movement));
        endTarget.current.y = THREE.MathUtils.lerp(
          currentTarget.y,
          walkTarget.point.y,
          Math.min(1, stepDistance / Math.max(horizontalDistance, 0.001)),
        );
      }

      endPosition.current.y = camera.position.y;
    }

    elapsed.current += delta;
    const progress = easeSmooth(
      THREE.MathUtils.clamp(elapsed.current / WALK_DURATION_SECONDS, 0, 1),
    );

    cameraPoint.lerpVectors(startPosition.current, endPosition.current, progress);
    lookPoint.lerpVectors(startTarget.current, endTarget.current, progress);
    camera.position.copy(cameraPoint);
    camera.lookAt(lookPoint);

    if (progress >= 1 && !complete.current) {
      complete.current = true;
      onComplete(endTarget.current);
    }
  });

  return null;
}

function HotspotLabels({
  visible,
  activeId,
  onSelect,
}: {
  visible: boolean;
  activeId?: LabHotspotId;
  onSelect: (hotspot: LabHotspot) => void;
}) {
  if (!visible) {
    return null;
  }

  return (
    <>
      {LAB_HOTSPOTS.map((hotspot) => (
        <Html
          key={hotspot.id}
          position={hotspot.position}
          center
          distanceFactor={5.8}
          zIndexRange={[12, 0]}
        >
          <button
            type="button"
            aria-label={`Open ${hotspot.label}`}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(hotspot);
            }}
            className={[
              "group relative flex min-w-28 items-center gap-2 rounded-full border border-sky-200/25 bg-[#071527]/72 px-3 py-2 text-left text-xs text-ice shadow-[0_14px_34px_rgba(2,8,23,0.28)] backdrop-blur-md transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-sky-200/60 hover:bg-[#0b223b]/84 focus:outline-none focus-visible:border-sky-200 focus-visible:ring-2 focus-visible:ring-sky-200/45",
              activeId === hotspot.id ? "border-sky-200/70 bg-[#0d2a48]/88" : "",
            ].join(" ")}
          >
            <span className="size-2 rounded-full bg-sky-200 shadow-[0_0_14px_rgba(125,211,252,0.72)] transition-transform duration-300 group-hover:scale-125" />
            <span className="grid gap-0.5">
              <span className="font-medium leading-none">{hotspot.label}</span>
              <span className="text-[0.62rem] leading-none text-ice/58">
                {hotspot.detail}
              </span>
            </span>
          </button>
        </Html>
      ))}
    </>
  );
}

function GateContactPanel({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  if (!visible) {
    return null;
  }

  return (
    <Html
      position={new THREE.Vector3(1.68, 1.16, -1.55)}
      center
      distanceFactor={5.3}
      zIndexRange={[20, 0]}
    >
      <div className="w-52 rounded-2xl border border-sky-200/25 bg-[#071527]/82 p-2 text-ice shadow-[0_22px_58px_rgba(2,8,23,0.38)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-2 pb-2 pt-1">
          <p className="text-xs font-medium">Contact</p>
          <button
            type="button"
            aria-label="Close contact panel"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            className="rounded-full px-2 py-1 text-xs text-ice/60 transition-colors hover:bg-ice/10 hover:text-ice focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/45"
          >
            Close
          </button>
        </div>
        <div className="grid gap-1">
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : "_self"}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              onClick={(event) => event.stopPropagation()}
              className="rounded-xl border border-ice/8 bg-ice/[0.055] px-3 py-2 text-sm transition-colors hover:border-sky-200/40 hover:bg-sky-200/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/45"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </Html>
  );
}

function FocusControls({
  enabled,
  target,
}: {
  enabled: boolean;
  target: THREE.Vector3;
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    if (!controlsRef.current) {
      return;
    }

    controlsRef.current.target.copy(target);
    controlsRef.current.update();
  }, [target]);

  useFrame(() => {
    if (!enabled || !controlsRef.current) {
      return;
    }

    controlsRef.current.update();
    clampControlsToLab(controlsRef.current);
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enabled}
      makeDefault
      target={[target.x, target.y, target.z]}
      enableDamping={false}
      enablePan
      enableZoom
      rotateSpeed={0.34}
      zoomSpeed={0.52}
      panSpeed={0.42}
      minDistance={1.1}
      maxDistance={6.85}
      minPolarAngle={0.35}
      maxPolarAngle={1.45}
    />
  );
}

function LabScene() {
  const router = useRouter();
  const [introComplete, setIntroComplete] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<LabHotspot | null>(null);
  const [controlsTarget, setControlsTarget] = useState(() => HOME_VIEW_TARGET.clone());
  const [walkTarget, setWalkTarget] = useState<WalkTarget | null>(null);
  const [gateOpen, setGateOpen] = useState(false);

  const handleHotspotSelect = (hotspot: LabHotspot) => {
    setGateOpen(false);
    setWalkTarget(null);
    setActiveHotspot(hotspot);
  };

  const handleNavigatePoint = (point: THREE.Vector3) => {
    if (!introComplete || activeHotspot) {
      return;
    }

    setGateOpen(false);
    setWalkTarget({
      id: performance.now(),
      point: getClampedLabPoint(point),
    });
  };

  const handleFocusComplete = () => {
    if (!activeHotspot) {
      return;
    }

    setControlsTarget(activeHotspot.focusTarget.clone());

    if (activeHotspot.href) {
      router.push(activeHotspot.href);
      return;
    }

    setGateOpen(true);
    setActiveHotspot(null);
  };

  const handleWalkComplete = (target: THREE.Vector3) => {
    setControlsTarget(target.clone());
    setWalkTarget(null);
  };

  return (
    <Canvas
      camera={{
        position: [
          INTRO_START_POSITION.x,
          INTRO_START_POSITION.y,
          INTRO_START_POSITION.z,
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
      className="cursor-grab active:cursor-grabbing"
    >
      <color attach="background" args={["#061427"]} />
      <fog attach="fog" args={["#061427", 6.2, 14]} />
      {!introComplete ? (
        <CinematicIntroCamera onComplete={() => setIntroComplete(true)} />
      ) : null}
      {activeHotspot ? (
        <CameraFocusMove focus={activeHotspot} onComplete={handleFocusComplete} />
      ) : null}
      {walkTarget ? (
        <CameraWalkMove
          key={walkTarget.id}
          walkTarget={walkTarget}
          currentTarget={controlsTarget}
          onComplete={handleWalkComplete}
        />
      ) : null}

      <FocusControls
        enabled={introComplete && !activeHotspot && !walkTarget}
        target={controlsTarget}
      />

      <ambientLight intensity={0.62} />
      <hemisphereLight args={["#c9e7ff", "#07101e", 1.45]} />
      <directionalLight position={[2.4, 4.8, 3.6]} intensity={2.15} />
      <pointLight position={[0.1, 1.12, 0.16]} intensity={3.8} color="#62d6ff" />
      <pointLight position={[-1.8, 0.9, 0.9]} intensity={1.45} color="#2f6fed" />
      <pointLight position={[2.3, 1.4, -0.9]} intensity={1.15} color="#8db7ff" />
      <pointLight position={[-2.6, 0.36, -2.2]} intensity={1.2} color="#62d6ff" />
      <pointLight position={[2.9, 0.36, 1.9]} intensity={0.9} color="#8db7ff" />

      <Suspense fallback={null}>
        <SciFiLabModel onNavigatePoint={handleNavigatePoint} />
        <HotspotLabels
          visible={introComplete}
          activeId={activeHotspot?.id}
          onSelect={handleHotspotSelect}
        />
        <GateContactPanel visible={gateOpen} onClose={() => setGateOpen(false)} />
        <Environment preset="night" environmentIntensity={0.52} />
      </Suspense>
    </Canvas>
  );
}

export function HomeModelStage() {
  return (
    <main className="relative isolate h-[100dvh] w-full max-w-full overflow-hidden overscroll-none bg-[#061427] text-ice">
      <div className="fixed inset-0">
        <LabScene />
      </div>

      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 px-5 py-8 sm:px-8 lg:px-10">
        <div className="pointer-events-auto">
          <LiquidPillNav />
        </div>
      </div>
    </main>
  );
}

useGLTF.preload(MODEL_PATH);
