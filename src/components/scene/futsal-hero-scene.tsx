"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import * as THREE from "three";
import { ArrowRightIcon, TrophyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sceneHotspots, sceneProjects, sceneStats } from "@/data/scene";
import { profile } from "@/data/profile";

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
    vec3 base = mix(vec3(0.045, 0.19, 0.13), vec3(0.07, 0.27, 0.18), vUv.y);
    float grain = fract(sin(dot(vUv * 180.0, vec2(12.9898, 78.233))) * 43758.5453);
    float concrete = smoothstep(0.42, 0.98, grain) * 0.05;
    float stripes = sin((vUv.x + uTime * 0.015) * 42.0) * 0.018;
    float courtLines = line(vUv.x, 0.5, 0.006) + line(vUv.y, 0.5, 0.006);
    courtLines += line(vUv.x, 0.08, 0.004) + line(vUv.x, 0.92, 0.004);
    courtLines += line(vUv.y, 0.08, 0.004) + line(vUv.y, 0.92, 0.004);
    vec3 color = base + concrete + stripes + courtLines * vec3(0.72, 0.92, 0.78);
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

class FutsalRuntime {
  private readonly canvas: HTMLCanvasElement;
  private readonly onScore: () => void;
  private readonly onHotspot: (id: string) => void;
  private readonly reducedMotion: boolean;
  private readonly scene = new THREE.Scene();
  private readonly clock = new THREE.Clock();
  private readonly raycaster = new THREE.Raycaster();
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
  private player!: THREE.Group;
  private ball!: THREE.Mesh;
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

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    this.camera.position.set(7.5, 6.4, 9.2);
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
    this.renderer.dispose();
  }

  kick() {
    if (this.ballScoring) return;
    const distance = this.player.position.distanceTo(this.ball.position);
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

    const keyLight = new THREE.DirectionalLight(0xf7ffe2, 2.2);
    keyLight.position.set(-4, 7, 5);
    this.scene.add(keyLight);

    this.addField();
    this.addFence();
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
    this.scene.add(field);

    const curbMaterial = this.material(0x1b2420, 0.52, 0.58);
    const curbGeometry = new THREE.BoxGeometry(12.6, 0.25, 0.32);
    const curbFront = new THREE.Mesh(curbGeometry, curbMaterial);
    curbFront.position.set(0, 0.12, 4.25);
    const curbBack = curbFront.clone();
    curbBack.position.z = -4.25;
    curbBack.scale.z = 1;
    const sideGeometry = new THREE.BoxGeometry(0.32, 0.25, 8.5);
    const curbLeft = new THREE.Mesh(sideGeometry, curbMaterial);
    curbLeft.position.set(-6.25, 0.12, 0);
    const curbRight = curbLeft.clone();
    curbRight.position.x = 6.25;
    this.disposables.push(curbGeometry, sideGeometry, curbMaterial);
    this.scene.add(curbFront, curbBack, curbLeft, curbRight);
  }

  private addFence() {
    const postMaterial = this.material(0x26332d, 0.36, 0.72);
    const wireMaterial = this.material(0x49655b, 0.28, 0.55);
    const postGeometry = new THREE.BoxGeometry(0.08, 2.2, 0.08);
    const railGeometry = new THREE.BoxGeometry(12.8, 0.045, 0.045);
    const sideRailGeometry = new THREE.BoxGeometry(0.045, 0.045, 8.6);
    this.disposables.push(postMaterial, wireMaterial, postGeometry, railGeometry, sideRailGeometry);

    for (let x = -6; x <= 6; x += 1.5) {
      [-4.35, 4.35].forEach((z) => {
        const post = new THREE.Mesh(postGeometry, postMaterial);
        post.position.set(x, 1.05, z);
        this.scene.add(post);
      });
    }

    for (let z = -3.75; z <= 3.75; z += 1.5) {
      [-6.35, 6.35].forEach((x) => {
        const post = new THREE.Mesh(postGeometry, postMaterial);
        post.position.set(x, 1.05, z);
        this.scene.add(post);
      });
    }

    [0.7, 1.35, 2].forEach((y) => {
      const back = new THREE.Mesh(railGeometry, wireMaterial);
      back.position.set(0, y, -4.35);
      const front = back.clone();
      front.position.z = 4.35;
      const left = new THREE.Mesh(sideRailGeometry, wireMaterial);
      left.position.set(-6.35, y, 0);
      const right = left.clone();
      right.position.x = 6.35;
      this.scene.add(back, front, left, right);
    });
  }

  private addGoal() {
    const material = this.material(0xdfeee6, 0.3, 0.45);
    const postGeometry = new THREE.BoxGeometry(0.12, 1.35, 0.12);
    const barGeometry = new THREE.BoxGeometry(2.7, 0.12, 0.12);
    const left = new THREE.Mesh(postGeometry, material);
    left.position.set(-1.35, 0.7, -3.95);
    const right = left.clone();
    right.position.x = 1.35;
    const top = new THREE.Mesh(barGeometry, material);
    top.position.set(0, 1.35, -3.95);
    const netGeometry = new THREE.PlaneGeometry(2.7, 1.35, 8, 5);
    const netMaterial = new THREE.MeshBasicMaterial({
      color: 0xdbeee6,
      transparent: true,
      opacity: 0.16,
      wireframe: true,
    });
    const net = new THREE.Mesh(netGeometry, netMaterial);
    net.position.set(0, 0.7, -4.05);
    this.disposables.push(material, postGeometry, barGeometry, netGeometry, netMaterial);
    this.scene.add(left, right, top, net);
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
    frame.position.set(0, 2.9, -4.52);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.05, 1.12), this.scoreboardMaterial);
    screen.position.set(0, 2.9, -4.42);
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
    const kitMaterial = this.material(0xf3f7ef, 0.35, 0.42);
    const accentMaterial = this.material(0x37ff9b, 0.2, 0.35);
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.55, 8, 16), kitMaterial);
    body.position.y = 0.55;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 16), this.material(0xd8a876, 0.48, 0.45));
    head.position.y = 1.02;
    const marker = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.025, 8, 36), accentMaterial);
    marker.rotation.x = Math.PI / 2;
    marker.position.y = 0.05;
    this.player.add(body, head, marker);
    this.player.position.set(0, 0, 2.1);
    this.scene.add(this.player);
    this.disposables.push(
      kitMaterial,
      accentMaterial,
      body.geometry,
      head.geometry,
      marker.geometry,
      head.material
    );
  }

  private addBall() {
    const ballMaterial = this.material(0xf8f8f1, 0.28, 0.46);
    const seamMaterial = this.material(0x111917, 0.5, 0.45);
    this.ball = new THREE.Mesh(new THREE.SphereGeometry(0.18, 28, 18), ballMaterial);
    this.ball.position.set(0.85, 0.2, 1.4);
    const seam = new THREE.Mesh(new THREE.TorusGeometry(0.185, 0.008, 6, 24), seamMaterial);
    seam.rotation.x = Math.PI / 2;
    this.ball.add(seam);
    this.scene.add(this.ball);
    this.disposables.push(ballMaterial, seamMaterial, this.ball.geometry, seam.geometry);
  }

  private addLights() {
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
      this.scene.add(pole, bulb, light);
    });
    this.disposables.push(poleMaterial, bulbMaterial, poleGeo, bulbGeo);
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
      this.clock.getDelta();
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
    const delta = Math.min(this.clock.getDelta(), 0.04);
    const elapsed = this.clock.elapsedTime;
    this.fieldMaterial.uniforms.uTime.value = elapsed;
    this.scoreboardMaterial.uniforms.uTime.value = elapsed;

    if (!this.reducedMotion) {
      this.updatePlayer(delta);
      this.ball.rotation.x += this.ballVelocity.z * 1.8;
      this.ball.rotation.z += this.ballVelocity.x * 1.8;
      this.player.children[2].rotation.z += delta * 0.9;
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
  const [activeHotspot, setActiveHotspot] = useState(sceneHotspots[0]);
  const activeProject = sceneProjects[activeProjectIndex] ?? sceneProjects[0];

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
          setActiveHotspot(sceneHotspots[0]);
        },
        onHotspot: (id) => {
          const hotspot = sceneHotspots.find((item) => item.id === id);
          if (!hotspot) return;
          setActiveHotspot(hotspot);
          if (hotspot.href.startsWith("#")) {
            document.querySelector(hotspot.href)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
          } else {
            window.open(hotspot.href, "_blank", "noreferrer");
          }
        },
      });
      runtimeRef.current = runtime;
    } catch {
      canvasRef.current.classList.add("opacity-0");
    }

    return () => {
      runtime?.dispose();
      runtimeRef.current = null;
    };
  }, [reducedMotion]);

  return (
    <div className="futsal-scene-shell">
      <canvas
        ref={canvasRef}
        className="futsal-canvas"
        aria-label="Interactive street futsal court with portfolio hotspots"
      />
      <div className="futsal-scene-vignette" />
      <div className="futsal-score-card">
        <span>Score</span>
        <strong>{score.toString().padStart(2, "0")}</strong>
      </div>
      <div className="futsal-project-card">
        <span className="futsal-card-kicker">Scoreboard</span>
        <strong>{activeProject?.title ?? "Featured project"}</strong>
        <p>{activeProject?.description ?? "Score a goal to cycle project highlights."}</p>
      </div>
      <div className="futsal-hotspot-card">
        <TrophyIcon className="size-4" />
        <div>
          <span>{activeHotspot.label}</span>
          <p>{activeHotspot.description}</p>
        </div>
      </div>
      <div className="futsal-controls">
        <button type="button" onClick={() => runtimeRef.current?.kick()}>
          Kick / Space
        </button>
        <span>WASD or arrows to move</span>
      </div>
      <div className="futsal-mobile-hotspots" aria-label="Portfolio court hotspots">
        {sceneHotspots.map((hotspot) => (
          <Link key={hotspot.id} href={hotspot.href}>
            {hotspot.label}
          </Link>
        ))}
      </div>
      <div className="futsal-stat-strip">
        {sceneStats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
      <div className="futsal-webgl-fallback" aria-hidden="true">
        <span>{profile.shortName} FC</span>
        <p>Street futsal portfolio court</p>
        <Button render={<Link href="#projects" />} size="sm">
          View work
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}
