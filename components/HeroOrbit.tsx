"use client";

import { useEffect, useRef } from "react";

type OrbitDef = {
  radius: number;
  speed: number;
  satSize: number;
  color: string;
  alpha: number;
};

const ORBITS: OrbitDef[] = [
  { radius: 0.42, speed: 0.55, satSize: 3.2, color: "255, 150, 120", alpha: 0.38 },
  { radius: 0.58, speed: -0.34, satSize: 4.4, color: "225, 6, 0", alpha: 0.72 },
  { radius: 0.74, speed: 0.2, satSize: 3, color: "255, 90, 74", alpha: 0.42 },
];

const LABEL_RIDES = [
  { orbit: 2, offset: Math.PI / 2 },
  { orbit: 2, offset: 0.2 },
  { orbit: 2, offset: Math.PI },
  { orbit: 2, offset: -Math.PI / 2 },
];

function onOrbit(radius: number, angle: number) {
  return {
    x: Math.cos(angle) * radius,
    y: 0,
    z: Math.sin(angle) * radius,
  };
}

function project(
  x: number,
  y: number,
  z: number,
  yaw: number,
  pitch: number,
) {
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  const y2 = y * cosP - z1 * sinP;
  const z2 = y * sinP + z1 * cosP;
  const depth = 4.2;
  const scale = depth / (depth + z2);
  return { x: x1 * scale, y: y2 * scale, z: z2, s: scale };
}

type HeroOrbitProps = {
  initials: string;
  labels: string[];
};

export default function HeroOrbit({ initials, labels }: HeroOrbitProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !stage || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;
    let time = 0;
    let frame = 0;
    let running = true;

    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const nx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.5);
      const ny = (event.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.5);
      tmx = Math.max(-1, Math.min(1, nx));
      tmy = Math.max(-1, Math.min(1, ny));
    };

    const onLeave = () => {
      tmx = 0;
      tmy = 0;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!running) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const half = Math.min(w, h) / 2;
      ctx.clearRect(0, 0, w, h);

      if (!reduce) {
        time += 0.016;
        mx += (tmx - mx) * 0.12;
        my += (tmy - my) * 0.12;
      }

      const yaw = mx * 0.45;
      const pitch = 0.58 - my * 0.4;
      const cx = w / 2;
      const cy = h / 2;
      stage.style.transform = `translate3d(0, ${my * 36}px, 0)`;

      const bodies: { x: number; y: number; z: number; s: number; size: number; color: string }[] = [];

      ORBITS.forEach((orbit) => {
        const spin = reduce ? 0 : time * orbit.speed;
        const steps = 120;
        ctx.beginPath();
        for (let step = 0; step <= steps; step++) {
          const angle = (step / steps) * Math.PI * 2;
          const p3 = onOrbit(orbit.radius, angle);
          const p = project(p3.x, p3.y, p3.z, yaw, pitch);
          const px = cx + p.x * half;
          const py = cy + p.y * half;
          if (step === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.setLineDash([8, 7]);
        ctx.strokeStyle = `rgba(${orbit.color}, ${orbit.alpha})`;
        ctx.lineWidth = 1.25;
        ctx.stroke();
        ctx.setLineDash([]);

        const p3 = onOrbit(orbit.radius, spin);
        const p = project(p3.x, p3.y, p3.z, yaw, pitch);
        bodies.push({
          x: cx + p.x * half,
          y: cy + p.y * half,
          z: p.z,
          s: p.s,
          size: orbit.satSize,
          color: orbit.color,
        });
      });

      bodies
        .sort((a, b) => b.z - a.z)
        .forEach((body) => {
          const near = Math.min(1, Math.max(0.28, 0.62 - body.z));
          const radius = body.size * body.s * (0.8 + near * 0.4);
          ctx.beginPath();
          ctx.fillStyle = `rgba(${body.color}, ${0.18 * near})`;
          ctx.arc(body.x, body.y, radius * 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = `rgba(${body.color}, ${0.45 + near * 0.55})`;
          ctx.arc(body.x, body.y, radius, 0, Math.PI * 2);
          ctx.fill();
        });

      labels.forEach((label, index) => {
        const el = chipRefs.current[index];
        if (!el) return;
        const ride = LABEL_RIDES[index % LABEL_RIDES.length];
        const orbit = ORBITS[ride.orbit];
        const p3 = onOrbit(orbit.radius, ride.offset);
        const p = project(p3.x, p3.y, p3.z, yaw, pitch);
        const vx = p.x * half;
        const vy = p.y * half;
        const dist = Math.hypot(vx, vy) || 1;
        const pushed = Math.max(1, (half * 0.62) / dist);
        const x = cx + vx * pushed;
        const y = cy + vy * pushed;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        el.style.opacity = "1";
        el.style.zIndex = "3";
        el.textContent = label;
      });

      if (!reduce) frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, [labels]);

  return (
    <div ref={wrapRef} className="hero-orbit" aria-hidden="true">
      <div ref={stageRef} className="hero-orbit-stage">
      <canvas ref={canvasRef} className="hero-orbit-canvas" />
      <div className="hero-orbit-chips">
        {labels.map((label) => (
          <span
            key={label}
            ref={(node) => {
              const index = labels.indexOf(label);
              chipRefs.current[index] = node;
            }}
            className="hero-orbit-chip"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="hero-orbit-core">
        <span className="hero-orbit-badge">
          <svg viewBox="0 0 100 110" className="hero-orbit-hex">
            <polygon
              points="50,4 93,28 93,82 50,106 7,82 7,28"
              fill="rgba(225,6,0,0.12)"
              stroke="currentColor"
              strokeWidth="2.5"
            />
          </svg>
          <span className="hero-orbit-initials">{initials}</span>
        </span>
      </div>
      </div>
    </div>
  );
}
