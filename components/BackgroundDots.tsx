"use client";

import { useEffect, useRef } from "react";

type Dot = {
  x: number;
  y: number;
  r: number;
  a: number;
  drift: number;
  color: string;
};

export default function BackgroundDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let dots: Dot[] = [];
    let frame = 0;
    let running = true;

    const makeDots = (w: number, h: number) => {
      const count = Math.round((w * h) / 7200);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2.1,
        a: 0.35 + Math.random() * 0.5,
        drift: 6 + Math.random() * 16,
        color: Math.random() > 0.45 ? "#ff6a55" : "#e10600",
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeDots(w, h);
    };

    const draw = (time: number) => {
      if (!running) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      dots.forEach((dot, i) => {
        const y = reduce
          ? dot.y
          : ((dot.y + Math.sin(time / 1800 + i) * dot.drift) % (h + 20) +
              h +
              20) %
            (h + 20);
        ctx.beginPath();
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = dot.a;
        ctx.arc(dot.x, y > h ? y - 20 : y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (!reduce) frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw(0);
    window.addEventListener("resize", resize);
    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
