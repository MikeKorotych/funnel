"use client";

import { useEffect, useRef } from "react";

export function RainEffect({
  opacity = 0.3,
  color = "rgba(255, 255, 255, 0.25)",
  speed = 4,
}: {
  opacity?: number;
  color?: string;
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drops: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops.length = 0;
      const count = Math.floor(canvas.width / 8);
      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * -1,
          length: 15 + Math.random() * 30,
          speed: speed + Math.random() * 3,
          opacity: 0.1 + Math.random() * 0.3,
        });
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const drop of drops) {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.strokeStyle = color;
        ctx.globalAlpha = drop.opacity;
        ctx.lineWidth = 1;
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[5] pointer-events-none"
      style={{ opacity, transition: "opacity 0.8s ease" }}
    />
  );
}
