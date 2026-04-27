"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  ArrowUpRightIcon,
  CodeXmlIcon,
  ContactIcon,
  FileTextIcon,
  MailIcon,
  RotateCcwIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { experiences } from "@/data/experience";
import { sceneHotspots, sceneProjects } from "@/data/scene";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

const fieldVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fieldFragmentShader = `
  varying vec2 vUv;
  uniform float uTime;

  float line(float value, float target, float thickness) {
    return 1.0 - smoothstep(thickness, thickness + 0.003, abs(value - target));
  }

  void main() {
    vec3 base = mix(vec3(0.035, 0.16, 0.105), vec3(0.075, 0.28, 0.17), vUv.y);
    float grain = fract(sin(dot(vUv * 260.0, vec2(12.9898, 78.233))) * 43758.5453);
    float turf = (grain - 0.5) * 0.075;
    float mowing = sin((vUv.x + uTime * 0.008) * 58.0) * 0.014;
    float courtLines = line(vUv.x, 0.5, 0.005) + line(vUv.y, 0.5, 0.005);
    courtLines += line(vUv.x, 0.08, 0.004) + line(vUv.x, 0.92, 0.004);
    courtLines += line(vUv.y, 0.08, 0.004) + line(vUv.y, 0.92, 0.004);
    float centerCircle = 1.0 - smoothstep(0.005, 0.011, abs(distance(vUv, vec2(0.5)) - 0.14));
    float spot = 1.0 - smoothstep(0.0, 0.018, distance(vUv, vec2(0.5, 0.5)));
    float boxTop = line(vUv.y, 0.20, 0.004) * step(0.32, vUv.x) * step(vUv.x, 0.68);
    float boxBottom = line(vUv.y, 0.80, 0.004) * step(0.32, vUv.x) * step(vUv.x, 0.68);
    courtLines += centerCircle + spot + boxTop + boxBottom;
    vec3 color = base + turf + mowing + courtLines * vec3(0.82, 0.96, 0.86);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const screenVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const screenFragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  void main() {
    float scan = sin((vUv.y * 90.0) - uTime * 5.0) * 0.07;
    float vignette = smoothstep(0.78, 0.12, distance(vUv, vec2(0.5)));
    float pulse = 0.5 + 0.5 * sin(uTime * 1.8);
    vec3 color = mix(uColorA, uColorB, vUv.x + scan + pulse * 0.08);
    gl_FragColor = vec4(color * vignette, 1.0);
  }
`;

type FutsalRuntimeOptions = {
  canvas: HTMLCanvasElement;
  onScore: () => void;
  onHotspot: (id: string) => void;
  reducedMotion: boolean;
};

type PlayerActionName = "idle" | "run" | "kick";

class FutsalRuntime {
  private readonly canvas: HTMLCanvasElement;
  private readonly onScore: () => void;
  private readonly onHotspot: (id: string) => void;
  private readonly reducedMotion: boolean;
  private readonly scene = new THREE.Scene();
  private readonly timer = new THREE.Timer();
  private readonly raycaster = new THREE.Raycaster();
  private readonly loader = new GLTFLoader();
  private readonly pointer = new THREE.Vector2();
  private readonly renderer: THREE.WebGLRenderer;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly keys = new Set<string>();
  private readonly disposables: Array<THREE.Object3D | THREE.Material | THREE.BufferGeometry | THREE.Texture> = [];
  private readonly hotspotMeshes: THREE.Mesh[] = [];
  private frameId = 0;
  private width = 1;
  private height = 1;
  private ballVelocity = new THREE.Vector3();
  private ballScoring = false;
  private hovered: THREE.Mesh | null = null;
  private resizeObserver?: ResizeObserver;
  private playerActionLockedUntil = 0;
  private player!: THREE.Group;
  private ball!: THREE.Object3D;
  private playerMarker?: THREE.Object3D;
  private activePlayerAction?: THREE.AnimationAction;
  private readonly playerActions = new Map<PlayerActionName, THREE.AnimationAction>();
  private readonly mixers: THREE.AnimationMixer[] = [];
  private scoreboardMaterial!: THREE.ShaderMaterial;
  private fieldMaterial!: THREE.ShaderMaterial;

  constructor({ canvas, onScore, onHotspot, reducedMotion }: FutsalRuntimeOptions) {
    this.canvas = canvas;
    this.onScore = onScore;
    this.onHotspot = onHotspot;
    this.reducedMotion = reducedMotion;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.timer.connect(document);

    this.camera = new THREE.PerspectiveCamera(46, 1, 0.1, 90);
    this.camera.position.set(8.8, 7.2, 10.6);
    this.camera.lookAt(0, 0, 0);

    this.buildScene();
    this.addEvents();
    this.resize();
    this.animate();
  }

  dispose() {
    cancelAnimationFrame(this.frameId);
    this.resizeObserver?.disconnect();
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.disposables.forEach((item) => {
      if ("dispose" in item && typeof item.dispose === "function") {
        item.dispose();
      }
    });
    this.timer.dispose();
    this.renderer.dispose();
  }

  kick() {
    if (this.ballScoring) return;
    const distance = this.player.position.distanceTo(this.ball.position);
    this.playPlayerAction("kick");
    this.playerActionLockedUntil = this.timer.getElapsed() + 0.72;
    if (distance < 1.45) {
      this.ballVelocity.set(0, 0, -0.18);
      gsap.to(this.ball.position, {
        x: 0,
        z: -5.9,
        duration: 0.95,
        ease: "power3.out",
        onComplete: () => this.score(),
      });
    } else {
      gsap.to(this.camera.position, {
        x: 6.8,
        y: 5.9,
        z: 8.2,
        duration: 0.45,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
  }

  private buildScene() {
    this.scene.fog = new THREE.Fog(0x07110d, 13, 29);

    const ambient = new THREE.HemisphereLight(0xb7ffd7, 0x07100c, 1.8);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xf7ffe2, 2.6);
    keyLight.position.set(-4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    this.scene.add(keyLight);

    this.addField();
    this.addFence();
    this.addCourtAsset();
    this.addFenceAsset();
    this.addGoal();
    this.addScoreboard();
    this.addTrophyShelf();
    this.addPosterWall();
    this.addBanners();
    this.addPlayer();
    this.addBall();
    this.addLights();
    this.addStreetDetails();
  }

  private loadModel(path: string, onLoad: (root: THREE.Group, gltf: GLTF) => void) {
    this.loader.load(
      path,
      (gltf) => {
        const root = gltf.scene;
        this.prepareModel(root);
        onLoad(root, gltf);
      },
      undefined,
      (error) => {
        console.warn(`Unable to load ${path}`, error);
      }
    );
  }

  private prepareModel(root: THREE.Object3D) {
    root.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.disposables.push(mesh.geometry);
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        this.disposables.push(material);
        Object.values(material).forEach((value) => {
          if (value instanceof THREE.Texture) {
            this.disposables.push(value);
          }
        });
      });
    });
  }

  private fitModel(
    root: THREE.Object3D,
    target: { width?: number; depth?: number; height?: number; position?: THREE.Vector3 }
  ) {
    root.updateMatrixWorld(true);
    let box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const scales = [
      target.width && size.x > 0 ? target.width / size.x : undefined,
      target.depth && size.z > 0 ? target.depth / size.z : undefined,
      target.height && size.y > 0 ? target.height / size.y : undefined,
    ].filter((value): value is number => typeof value === "number" && Number.isFinite(value));

    if (scales.length > 0) {
      root.scale.multiplyScalar(Math.min(...scales));
      root.updateMatrixWorld(true);
      box = new THREE.Box3().setFromObject(root);
    }

    const center = box.getCenter(new THREE.Vector3());
    const position = target.position ?? new THREE.Vector3();
    root.position.x += position.x - center.x;
    root.position.y += position.y - box.min.y;
    root.position.z += position.z - center.z;
  }

  private playPlayerAction(name: PlayerActionName) {
    const action = this.playerActions.get(name);
    if (!action || action === this.activePlayerAction) return;
    action.reset().fadeIn(0.16).play();
    this.activePlayerAction?.fadeOut(0.16);
    this.activePlayerAction = action;
  }

  private addField() {
    this.fieldMaterial = new THREE.ShaderMaterial({
      vertexShader: fieldVertexShader,
      fragmentShader: fieldFragmentShader,
      uniforms: { uTime: { value: 0 } },
    });
    this.disposables.push(this.fieldMaterial);

    const fieldGeometry = new THREE.PlaneGeometry(12, 8, 1, 1);
    this.disposables.push(fieldGeometry);
    const field = new THREE.Mesh(fieldGeometry, this.fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    field.receiveShadow = true;
    this.scene.add(field);

    const outerMaterial = this.material(0x242a25, 0.82, 0.08);
    const outerGeometry = new THREE.PlaneGeometry(22, 16, 1, 1);
    const outer = new THREE.Mesh(outerGeometry, outerMaterial);
    outer.rotation.x = -Math.PI / 2;
    outer.position.y = -0.025;
    outer.receiveShadow = true;
    this.scene.add(outer);

    const curbMaterial = this.material(0x18211d, 0.58, 0.42);
    const curbGeometry = new THREE.BoxGeometry(12.6, 0.18, 0.32);
    const curbFront = new THREE.Mesh(curbGeometry, curbMaterial);
    curbFront.position.set(0, 0.09, 4.25);
    const curbBack = curbFront.clone();
    curbBack.position.z = -4.25;
    curbBack.scale.z = 1;
    const sideGeometry = new THREE.BoxGeometry(0.32, 0.25, 8.5);
    const curbLeft = new THREE.Mesh(sideGeometry, curbMaterial);
    curbLeft.position.set(-6.25, 0.12, 0);
    const curbRight = curbLeft.clone();
    curbRight.position.x = 6.25;
    this.disposables.push(curbGeometry, sideGeometry, curbMaterial);
    [curbFront, curbBack, curbLeft, curbRight].forEach((curb) => {
      curb.castShadow = true;
      curb.receiveShadow = true;
      this.scene.add(curb);
    });
    this.disposables.push(outerGeometry, outerMaterial);
  }

  private addFence() {
    const postMaterial = this.material(0x26332d, 0.36, 0.72);
    const wireMaterial = this.material(0x49655b, 0.28, 0.55);
    const postGeometry = new THREE.CylinderGeometry(0.045, 0.055, 2.4, 12);
    const railGeometry = new THREE.CylinderGeometry(0.022, 0.022, 12.8, 8);
    const sideRailGeometry = new THREE.CylinderGeometry(0.022, 0.022, 8.6, 8);
    this.disposables.push(postMaterial, wireMaterial, postGeometry, railGeometry, sideRailGeometry);

    for (let x = -6; x <= 6; x += 1.5) {
      [-4.35, 4.35].forEach((z) => {
        const post = new THREE.Mesh(postGeometry, postMaterial);
        post.position.set(x, 1.15, z);
        post.castShadow = true;
        this.scene.add(post);
      });
    }

    for (let z = -3.75; z <= 3.75; z += 1.5) {
      [-6.35, 6.35].forEach((x) => {
        const post = new THREE.Mesh(postGeometry, postMaterial);
        post.position.set(x, 1.15, z);
        post.castShadow = true;
        this.scene.add(post);
      });
    }

    [0.7, 1.35, 2].forEach((y) => {
      const back = new THREE.Mesh(railGeometry, wireMaterial);
      back.position.set(0, y, -4.35);
      back.rotation.z = Math.PI / 2;
      const front = back.clone();
      front.position.z = 4.35;
      const left = new THREE.Mesh(sideRailGeometry, wireMaterial);
      left.position.set(-6.35, y, 0);
      left.rotation.x = Math.PI / 2;
      const right = left.clone();
      right.position.x = 6.35;
      this.scene.add(back, front, left, right);
    });
  }

  private addCourtAsset() {
    this.loadModel("/assets/3d/football-court.glb", (root) => {
      const oversizedPieces: THREE.Object3D[] = [];
      root.traverse((node) => {
        if (/tribune|proof/i.test(node.name)) {
          oversizedPieces.push(node);
        }
      });
      oversizedPieces.forEach((node) => node.parent?.remove(node));
      root.position.set(0, 0, 0);
      root.rotation.y = Math.PI;
      this.fitModel(root, {
        width: 13.2,
        position: new THREE.Vector3(0, -0.04, -0.15),
      });
      this.scene.add(root);
    });
  }

  private addFenceAsset() {
    this.loadModel("/assets/3d/chainlink-fence.glb", (root) => {
      root.position.set(0, 0, 0);
      this.fitModel(root, {
        width: 12.8,
        height: 2.45,
        position: new THREE.Vector3(0, 0, -4.52),
      });
      this.scene.add(root);
    });
  }

  private addGoal() {
    const fallback = new THREE.Group();
    const material = this.material(0xdfeee6, 0.3, 0.45);
    const postGeometry = new THREE.CylinderGeometry(0.055, 0.055, 1.35, 18);
    const barGeometry = new THREE.CylinderGeometry(0.055, 0.055, 2.7, 18);
    const left = new THREE.Mesh(postGeometry, material);
    left.position.set(-1.35, 0.7, -3.95);
    const right = left.clone();
    right.position.x = 1.35;
    const top = new THREE.Mesh(barGeometry, material);
    top.position.set(0, 1.35, -3.95);
    top.rotation.z = Math.PI / 2;
    const leftBack = left.clone();
    leftBack.position.z = -4.45;
    const rightBack = right.clone();
    rightBack.position.z = -4.45;
    const backTop = top.clone();
    backTop.position.z = -4.45;
    const netGeometry = new THREE.PlaneGeometry(2.7, 1.35, 8, 5);
    const netMaterial = new THREE.MeshBasicMaterial({
      color: 0xdbeee6,
      transparent: true,
      opacity: 0.16,
      wireframe: true,
    });
    const net = new THREE.Mesh(netGeometry, netMaterial);
    net.position.set(0, 0.7, -4.05);
    const netTop = net.clone();
    netTop.rotation.x = Math.PI / 2;
    netTop.position.set(0, 1.38, -4.2);
    this.disposables.push(material, postGeometry, barGeometry, netGeometry, netMaterial);
    [left, right, top, leftBack, rightBack, backTop].forEach((piece) => {
      piece.castShadow = true;
      fallback.add(piece);
    });
    fallback.add(net, netTop);
    this.scene.add(fallback);

    this.loadModel("/assets/3d/futsal-goal.glb", (root) => {
      root.position.set(0, 0, 0);
      root.rotation.y = Math.PI / 2;
      this.fitModel(root, {
        width: 2.85,
        height: 1.45,
        position: new THREE.Vector3(0, 0, -4.05),
      });
      fallback.visible = false;
      this.scene.add(root);
    });
  }

  private addScoreboard() {
    this.scoreboardMaterial = new THREE.ShaderMaterial({
      vertexShader: screenVertexShader,
      fragmentShader: screenFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#37ff9b") },
        uColorB: { value: new THREE.Color("#0e5dff") },
      },
    });
    this.disposables.push(this.scoreboardMaterial);

    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 1.5, 0.18),
      this.material(0x0b1411, 0.45, 0.78)
    );
    frame.position.set(0, 3.0, -4.62);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.05, 1.12), this.scoreboardMaterial);
    screen.position.set(0, 3.0, -4.51);
    screen.userData.hotspot = "projects";
    this.hotspotMeshes.push(screen);
    this.disposables.push(frame.geometry, screen.geometry, frame.material);
    this.scene.add(frame, screen);

    const labelMaterial = this.material(0xf1ffe8, 0.2, 0.35);
    const tickGeometry = new THREE.BoxGeometry(0.18, 0.18, 0.04);
    [-0.9, -0.45, 0, 0.45, 0.9].forEach((x) => {
      const tick = new THREE.Mesh(tickGeometry, labelMaterial);
      tick.position.set(x, 2.53, -4.3);
      this.scene.add(tick);
    });
    this.disposables.push(labelMaterial, tickGeometry);
  }

  private addTrophyShelf() {
    const shelfMaterial = this.material(0x2c1f15, 0.52, 0.68);
    const trophyMaterial = this.material(0xffd36f, 0.18, 0.35);
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.15, 0.45), shelfMaterial);
    shelf.position.set(-4.7, 1.25, -4.15);
    shelf.userData.hotspot = "experience";
    this.hotspotMeshes.push(shelf);
    this.scene.add(shelf);

    const cupGeo = new THREE.CylinderGeometry(0.13, 0.09, 0.35, 16);
    const baseGeo = new THREE.BoxGeometry(0.32, 0.12, 0.22);
    [-5.2, -4.7, -4.2].forEach((x, index) => {
      const cup = new THREE.Mesh(cupGeo, trophyMaterial);
      cup.position.set(x, 1.58 + index * 0.04, -4.14);
      const base = new THREE.Mesh(baseGeo, trophyMaterial);
      base.position.set(x, 1.34, -4.14);
      this.scene.add(cup, base);
    });
    this.disposables.push(shelfMaterial, trophyMaterial, shelf.geometry, cupGeo, baseGeo);
  }

  private addPosterWall() {
    const colors = [0xff5f57, 0x37ff9b, 0x64a6ff, 0xf7d66b];
    const posterGeo = new THREE.PlaneGeometry(0.75, 1);
    colors.forEach((color, index) => {
      const poster = new THREE.Mesh(
        posterGeo,
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.78,
          metalness: 0.05,
          emissive: new THREE.Color(color).multiplyScalar(0.05),
        })
      );
      poster.position.set(3.65 + index * 0.62, 1.55 + (index % 2) * 0.18, -4.28);
      poster.rotation.z = (index - 1.5) * 0.07;
      poster.userData.hotspot = "skills";
      this.hotspotMeshes.push(poster);
      this.scene.add(poster);
      this.disposables.push(poster.material);
    });
    this.disposables.push(posterGeo);
  }

  private addBanners() {
    const bannerGeo = new THREE.BoxGeometry(1.55, 0.5, 0.06);
    const bannerData = [
      { id: "resume", x: -3.5, color: 0xecff8d },
      { id: "contact", x: 3.5, color: 0x90d7ff },
    ];
    bannerData.forEach(({ id, x, color }) => {
      const banner = new THREE.Mesh(
        bannerGeo,
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.5,
          metalness: 0.08,
          emissive: new THREE.Color(color).multiplyScalar(0.08),
        })
      );
      banner.position.set(x, 0.7, 4.42);
      banner.userData.hotspot = id;
      this.hotspotMeshes.push(banner);
      this.scene.add(banner);
      this.disposables.push(banner.material);
    });
    this.disposables.push(bannerGeo);
  }

  private addPlayer() {
    this.player = new THREE.Group();
    const fallback = new THREE.Group();
    const kitMaterial = this.material(0xf3f7ef, 0.4, 0.22);
    const accentMaterial = this.material(0x37ff9b, 0.2, 0.35);
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.5, 10, 18), kitMaterial);
    body.position.y = 0.68;
    body.castShadow = true;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 16), this.material(0xd8a876, 0.48, 0.45));
    head.position.y = 1.08;
    head.castShadow = true;
    const legGeo = new THREE.CapsuleGeometry(0.055, 0.38, 6, 10);
    const legMaterial = this.material(0x17221d, 0.58, 0.25);
    const leftLeg = new THREE.Mesh(legGeo, legMaterial);
    leftLeg.position.set(-0.09, 0.3, 0.02);
    const rightLeg = leftLeg.clone();
    rightLeg.position.x = 0.09;
    const marker = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.025, 8, 36), accentMaterial);
    marker.rotation.x = Math.PI / 2;
    marker.position.y = 0.05;
    this.playerMarker = marker;
    fallback.add(body, head, leftLeg, rightLeg);
    this.player.add(fallback, marker);
    this.player.position.set(0, 0, 2.1);
    this.scene.add(this.player);
    this.disposables.push(
      kitMaterial,
      accentMaterial,
      body.geometry,
      head.geometry,
      legGeo,
      marker.geometry,
      head.material,
      legMaterial
    );

    this.loadModel("/assets/3d/soccer-player.glb", (root, gltf) => {
      root.position.set(0, 0, 0);
      root.rotation.y = Math.PI;
      this.fitModel(root, {
        height: 1.55,
        position: new THREE.Vector3(0, 0.02, 0),
      });
      fallback.visible = false;
      this.player.add(root);

      const mixer = new THREE.AnimationMixer(root);
      this.mixers.push(mixer);
      gltf.animations.forEach((clip) => {
        const actionName = clip.name.toLowerCase() as PlayerActionName;
        if (actionName === "idle" || actionName === "run" || actionName === "kick") {
          const action = mixer.clipAction(clip);
          if (actionName === "kick") {
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;
          }
          this.playerActions.set(actionName, action);
        }
      });
      this.playPlayerAction("idle");
    });
  }

  private addBall() {
    const ballMaterial = this.material(0xf8f8f1, 0.28, 0.46);
    const seamMaterial = this.material(0x111917, 0.5, 0.45);
    const fallback = new THREE.Mesh(new THREE.SphereGeometry(0.18, 28, 18), ballMaterial);
    fallback.position.set(0.85, 0.2, 1.4);
    const seam = new THREE.Mesh(new THREE.TorusGeometry(0.185, 0.008, 6, 24), seamMaterial);
    seam.rotation.x = Math.PI / 2;
    fallback.add(seam);
    this.ball = fallback;
    this.scene.add(this.ball);
    this.disposables.push(ballMaterial, seamMaterial, fallback.geometry, seam.geometry);

    this.loadModel("/assets/3d/soccer-ball.glb", (root) => {
      root.position.set(0, 0, 0);
      this.fitModel(root, {
        width: 0.38,
        depth: 0.38,
        height: 0.38,
        position: new THREE.Vector3(0.85, 0.02, 1.4),
      });
      fallback.visible = false;
      this.ball = root;
      this.scene.add(root);
    });
  }

  private addLights() {
    const visualFallback = new THREE.Group();
    const poleMaterial = this.material(0x1f2924, 0.35, 0.8);
    const bulbMaterial = new THREE.MeshBasicMaterial({ color: 0xf8ffe8 });
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.05, 3.8, 10);
    const bulbGeo = new THREE.SphereGeometry(0.16, 16, 12);
    [
      [-5.4, -3.8],
      [5.4, -3.8],
      [-5.4, 3.8],
      [5.4, 3.8],
    ].forEach(([x, z], index) => {
      const pole = new THREE.Mesh(poleGeo, poleMaterial);
      pole.position.set(x, 1.9, z);
      const bulb = new THREE.Mesh(bulbGeo, bulbMaterial);
      bulb.position.set(x, 3.85, z);
      const light = new THREE.PointLight(index < 2 ? 0xb9ffda : 0xd7ecff, 1.8, 10, 1.4);
      light.position.set(x, 3.7, z);
      visualFallback.add(pole, bulb);
      this.scene.add(light);
    });
    this.scene.add(visualFallback);
    this.disposables.push(poleMaterial, bulbMaterial, poleGeo, bulbGeo);

    this.loadModel("/assets/3d/street-lamp.glb", (root) => {
      root.position.set(0, 0, 0);
      this.fitModel(root, {
        height: 3.85,
        position: new THREE.Vector3(0, 0, 0),
      });
      visualFallback.visible = false;
      const basePosition = root.position.clone();
      const source = root.clone(true);
      [
        [-5.6, -3.95, 0.62],
        [5.6, -3.95, -0.62],
        [-5.6, 3.95, 2.46],
        [5.6, 3.95, -2.46],
      ].forEach(([x, z, rotationY], index) => {
        const lamp = index === 0 ? root : source.clone(true);
        lamp.position.copy(basePosition);
        lamp.position.x += x;
        lamp.position.z += z;
        lamp.rotation.y += rotationY;
        this.scene.add(lamp);
      });
    });
  }

  private addStreetDetails() {
    const crateMaterial = this.material(0x4d3726, 0.66, 0.62);
    const bagMaterial = this.material(0x1f372d, 0.72, 0.55);
    const crateGeo = new THREE.BoxGeometry(0.5, 0.32, 0.45);
    const bagGeo = new THREE.BoxGeometry(0.42, 0.28, 0.34);
    for (let i = 0; i < 5; i += 1) {
      const crate = new THREE.Mesh(i % 2 ? bagGeo : crateGeo, i % 2 ? bagMaterial : crateMaterial);
      crate.position.set(-5.4 + i * 0.5, 0.18, 3.65 + (i % 2) * 0.18);
      crate.rotation.y = i * 0.4;
      this.scene.add(crate);
    }
    this.disposables.push(crateMaterial, bagMaterial, crateGeo, bagGeo);
  }

  private addEvents() {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas.parentElement ?? this.canvas);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("visibilitychange", this.handleVisibility);
    this.canvas.addEventListener("pointermove", this.handlePointerMove);
    this.canvas.addEventListener("pointerdown", this.handlePointerDown);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "w", "a", "s", "d"].includes(event.key)) {
      event.preventDefault();
    }
    if (event.key === " ") {
      this.kick();
      return;
    }
    this.keys.add(event.key.toLowerCase());
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    this.keys.delete(event.key.toLowerCase());
  };

  private handleVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.frameId);
    } else {
      this.timer.reset();
      this.animate();
    }
  };

  private handlePointerMove = (event: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.hotspotMeshes)[0]?.object as THREE.Mesh | undefined;
    if (this.hovered && this.hovered !== hit) {
      this.hovered.scale.setScalar(1);
    }
    this.hovered = hit ?? null;
    if (this.hovered) {
      this.hovered.scale.setScalar(1.06);
    }
    this.canvas.style.cursor = hit ? "pointer" : "grab";
  };

  private handlePointerDown = (event: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.hotspotMeshes)[0]?.object as THREE.Mesh | undefined;
    if (hit?.userData.hotspot) {
      this.onHotspot(hit.userData.hotspot);
      return;
    }
    if (event.pointerType !== "mouse") {
      this.moveTowardPointer();
    }
  };

  private moveTowardPointer() {
    const fieldPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(fieldPlane, point);
    const x = THREE.MathUtils.clamp(point.x, -4.9, 4.9);
    const z = THREE.MathUtils.clamp(point.z, -3.2, 3.2);
    gsap.to(this.player.position, {
      x,
      z,
      duration: 0.42,
      ease: "power2.out",
    });
  }

  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate);
    this.timer.update();
    const delta = Math.min(this.timer.getDelta(), 0.04);
    const elapsed = this.timer.getElapsed();
    this.fieldMaterial.uniforms.uTime.value = elapsed;
    this.scoreboardMaterial.uniforms.uTime.value = elapsed;
    this.mixers.forEach((mixer) => mixer.update(delta));

    if (!this.reducedMotion) {
      this.updatePlayer(delta);
      this.ball.rotation.x += this.ballVelocity.z * 1.8;
      this.ball.rotation.z += this.ballVelocity.x * 1.8;
      if (this.playerMarker) {
        this.playerMarker.rotation.z += delta * 0.9;
      }
      this.camera.position.x += (this.player.position.x * 0.08 + 7.5 - this.camera.position.x) * 0.015;
      this.camera.lookAt(this.player.position.x * 0.22, 0.45, -0.3);
    }

    this.renderer.render(this.scene, this.camera);
  };

  private updatePlayer(delta: number) {
    const speed = 3.1 * delta;
    let dx = 0;
    let dz = 0;
    if (this.keys.has("arrowup") || this.keys.has("w")) dz -= speed;
    if (this.keys.has("arrowdown") || this.keys.has("s")) dz += speed;
    if (this.keys.has("arrowleft") || this.keys.has("a")) dx -= speed;
    if (this.keys.has("arrowright") || this.keys.has("d")) dx += speed;
    if (this.timer.getElapsed() > this.playerActionLockedUntil) {
      this.playPlayerAction(dx === 0 && dz === 0 ? "idle" : "run");
    }
    if (dx === 0 && dz === 0) return;
    this.player.position.x = THREE.MathUtils.clamp(this.player.position.x + dx, -5.15, 5.15);
    this.player.position.z = THREE.MathUtils.clamp(this.player.position.z + dz, -3.25, 3.25);
    this.player.rotation.y = Math.atan2(dx, dz);
  }

  private score() {
    if (this.ballScoring) return;
    this.ballScoring = true;
    this.onScore();
    gsap.to(this.scoreboardMaterial.uniforms.uColorA.value, {
      r: 1,
      g: 0.78,
      b: 0.2,
      duration: 0.35,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
    gsap.to(this.ball.position, {
      x: 0.85,
      y: 0.2,
      z: 1.4,
      delay: 0.65,
      duration: 0.55,
      ease: "power2.inOut",
      onComplete: () => {
        this.ballScoring = false;
      },
    });
  }

  private resize() {
    const parent = this.canvas.parentElement;
    this.width = parent?.clientWidth || this.canvas.clientWidth || 1;
    this.height = parent?.clientHeight || this.canvas.clientHeight || 1;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  }

  private material(color: number, roughness: number, metalness: number) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
    });
  }
}

export function FutsalHeroScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runtimeRef = useRef<FutsalRuntime | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [activePanel, setActivePanel] = useState<(typeof sceneHotspots)[number]["id"]>("projects");
  const [panelOpen, setPanelOpen] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const activeProject = sceneProjects[activeProjectIndex] ?? sceneProjects[0];
  const activeHotspot = sceneHotspots.find((hotspot) => hotspot.id === activePanel) ?? sceneHotspots[0];

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    let runtime: FutsalRuntime | null = null;
    try {
      runtime = new FutsalRuntime({
        canvas: canvasRef.current,
        reducedMotion,
        onScore: () => {
          setScore((value) => value + 1);
          setActiveProjectIndex((value) => (value + 1) % Math.max(sceneProjects.length, 1));
          setActivePanel("projects");
          setPanelOpen(true);
        },
        onHotspot: (id) => {
          const hotspot = sceneHotspots.find((item) => item.id === id);
          if (!hotspot) return;
          setActivePanel(hotspot.id);
          setPanelOpen(true);
        },
      });
      runtimeRef.current = runtime;
    } catch {
      queueMicrotask(() => setWebglFailed(true));
      canvasRef.current.classList.add("opacity-0");
    }

    return () => {
      runtime?.dispose();
      runtimeRef.current = null;
    };
  }, [reducedMotion]);

  const openPanel = (panel: typeof activePanel) => {
    setActivePanel(panel);
    setPanelOpen(true);
  };

  return (
    <div className={`futsal-scene-shell futsal-app-shell${webglFailed ? " is-fallback" : ""}`}>
      <canvas
        ref={canvasRef}
        className="futsal-canvas"
        aria-label="Interactive street futsal court with portfolio hotspots"
      />
      <div className="futsal-scene-vignette" />

      <div className="futsal-app-topbar">
        <Card size="sm" className="futsal-app-card futsal-scoreboard-hud">
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center justify-between gap-3 text-sm">
              <span>{profile.shortName} FC</span>
              <Badge className="court-badge">Street futsal</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-[auto_1fr] items-center gap-3">
            <div className="futsal-score-number">{score.toString().padStart(2, "0")}</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{activeProject?.title ?? "Featured project"}</p>
              <p className="text-xs text-white/58">Score to rotate the board</p>
            </div>
          </CardContent>
        </Card>

        <Card size="sm" className="futsal-app-card futsal-instruction-hud">
          <CardContent className="flex items-center gap-2">
            <Button className="court-button-primary" size="sm" onClick={() => runtimeRef.current?.kick()}>
              Kick
            </Button>
            <span>WASD / arrows to move</span>
          </CardContent>
        </Card>
      </div>

      <Card size="sm" className="futsal-app-card futsal-focus-hud">
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center gap-2 text-sm">
            <CodeXmlIcon className="size-4 text-[#d9ff75]" />
            Court Map
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Button variant="outline" className="court-button-outline justify-start" onClick={() => openPanel("projects")}>
            Scoreboard
            <ArrowUpRightIcon data-icon="inline-end" />
          </Button>
          <Button variant="outline" className="court-button-outline justify-start" onClick={() => openPanel("experience")}>
            Trophy wall
            <ArrowUpRightIcon data-icon="inline-end" />
          </Button>
          <Button variant="outline" className="court-button-outline justify-start" onClick={() => openPanel("skills")}>
            Poster wall
            <ArrowUpRightIcon data-icon="inline-end" />
          </Button>
        </CardContent>
      </Card>

      <div className="futsal-mobile-hotspots" aria-label="Portfolio court hotspots">
        {sceneHotspots.map((hotspot) => (
          <Button key={hotspot.id} variant="outline" size="sm" onClick={() => openPanel(hotspot.id)}>
            {hotspot.label}
          </Button>
        ))}
      </div>

      <Card size="sm" className="futsal-app-card futsal-quick-links">
        <CardContent className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" render={<Link href={profile.links[0]?.href ?? "#"} target="_blank" />}>
            <CodeXmlIcon />
            <span className="sr-only">GitHub</span>
          </Button>
          <Button variant="ghost" size="icon-sm" render={<Link href={profile.links[1]?.href ?? "#"} target="_blank" />}>
            <ContactIcon />
            <span className="sr-only">LinkedIn</span>
          </Button>
          <Button variant="ghost" size="icon-sm" render={<Link href={profile.email} />}>
            <MailIcon />
            <span className="sr-only">Email</span>
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => runtimeRef.current?.kick()}>
            <RotateCcwIcon />
            <span className="sr-only">Kick the ball</span>
          </Button>
        </CardContent>
      </Card>

      <Dialog open={panelOpen} onOpenChange={setPanelOpen}>
        <DialogContent className="futsal-app-dialog">
          <DialogHeader>
            <DialogTitle>{activeHotspot.label}</DialogTitle>
            <DialogDescription>{activeHotspot.description}</DialogDescription>
          </DialogHeader>
          <Tabs value={activePanel} onValueChange={(value) => setActivePanel(value as typeof activePanel)}>
            <TabsList className="futsal-tabs-list">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="futsal-dialog-scroll">
              <div className="futsal-dialog-grid">
                {projects.slice(0, 6).map((project) => (
                  <Card key={project.title} size="sm" className="futsal-dialog-card">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between gap-3">
                        <span>{project.title}</span>
                        <Badge variant="secondary">{project.category}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <p className="text-sm leading-6 text-white/66">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 5).map((technology) => (
                          <Badge key={technology} variant="outline">
                            {technology}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" render={<Link href={project.liveHref} target="_blank" />}>
                          Live
                          <ArrowUpRightIcon data-icon="inline-end" />
                        </Button>
                        <Button size="sm" variant="outline" render={<Link href={project.githubHref} target="_blank" />}>
                          Code
                          <CodeXmlIcon data-icon="inline-end" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="experience" className="futsal-dialog-scroll">
              <div className="grid gap-3">
                {experiences.map((experience) => (
                  <Card key={`${experience.company}-${experience.role}`} size="sm" className="futsal-dialog-card">
                    <CardHeader>
                      <CardTitle>{experience.role}</CardTitle>
                      <p className="text-sm text-white/58">
                        {experience.company} / {experience.period}
                      </p>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <p className="text-sm leading-6 text-white/68">{experience.summary}</p>
                      <div className="grid gap-2">
                        {experience.highlights.map((highlight) => (
                          <p key={highlight} className="text-sm text-white/62">
                            {highlight}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="skills" className="futsal-dialog-scroll">
              <div className="futsal-dialog-grid">
                {skillGroups.map((group) => (
                  <Card key={group.title} size="sm" className="futsal-dialog-card">
                    <CardHeader>
                      <CardTitle>{group.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resume" className="futsal-dialog-scroll">
              <Card size="sm" className="futsal-dialog-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileTextIcon className="size-4 text-[#d9ff75]" />
                    Resume
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <p className="text-sm leading-6 text-white/68">
                    The sideline pass opens the current resume PDF without leaving the court shell.
                  </p>
                  <Button render={<Link href={profile.resumeHref} target="_blank" />}>
                    Open resume
                    <FileTextIcon data-icon="inline-end" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="futsal-dialog-scroll">
              <Card size="sm" className="futsal-dialog-card">
                <CardHeader>
                  <CardTitle>Final whistle</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <p className="text-sm leading-6 text-white/68">{profile.summary}</p>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    <Button render={<Link href={profile.email} />}>
                      Email
                      <MailIcon data-icon="inline-end" />
                    </Button>
                    <Button variant="outline" render={<Link href={profile.links[0]?.href ?? "#"} target="_blank" />}>
                      GitHub
                      <CodeXmlIcon data-icon="inline-end" />
                    </Button>
                    <Button variant="outline" render={<Link href={profile.links[1]?.href ?? "#"} target="_blank" />}>
                      LinkedIn
                      <ContactIcon data-icon="inline-end" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <div className="futsal-webgl-fallback" aria-hidden={!webglFailed}>
        <Card className="futsal-app-card max-w-sm">
          <CardHeader>
            <CardTitle>{profile.shortName} FC</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <p className="text-sm text-white/68">
              The interactive WebGL court did not initialize, but the full court menu is still available.
            </p>
            <Button onClick={() => openPanel("projects")}>
              Open projects
              <ArrowUpRightIcon data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
