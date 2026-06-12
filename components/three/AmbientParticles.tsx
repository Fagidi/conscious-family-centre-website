"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Subtle ambient particle field for the hero — slow-drifting motes of
 * light (think champagne dust in candlelight) with gentle mouse-driven
 * depth. Deliberately quiet: low count, low opacity, no theme.
 */
export default function AmbientParticles({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      60,
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Soft round sprite so particles read as motes, not squares
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.35)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(spriteCanvas);

    const COUNT = 320;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      speeds[i] = 0.12 + Math.random() * 0.35;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Two layers: warm white motes + a sparser amethyst shimmer
    const makePoints = (color: number, size: number, opacity: number) =>
      new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
          color,
          size,
          map: sprite,
          transparent: true,
          opacity,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        }),
      );

    const motes = makePoints(0xf5f3ee, 0.085, 0.55);
    const shimmer = makePoints(0x9061f9, 0.16, 0.3);
    shimmer.rotation.z = 0.6;
    scene.add(motes, shimmer);

    const target = new THREE.Vector2(0, 0);
    const onPointerMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.9;
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener("pointermove", onPointerMove);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const start = performance.now();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = (performance.now() - start) / 1000;

      const pos = geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i++) {
        const y = pos.getY(i) + speeds[i] * 0.0035;
        pos.setY(i, y > 8 ? -8 : y);
        pos.setX(i, pos.getX(i) + Math.sin(t * 0.25 + i) * 0.0009);
      }
      pos.needsUpdate = true;

      // Eased camera drift toward pointer for interactive depth
      camera.position.x += (target.x - camera.position.x) * 0.025;
      camera.position.y += (-target.y - camera.position.y) * 0.025;
      camera.lookAt(scene.position);

      motes.rotation.y = t * 0.012;
      shimmer.rotation.y = -t * 0.008;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      motes.material.dispose();
      shimmer.material.dispose();
      sprite.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
