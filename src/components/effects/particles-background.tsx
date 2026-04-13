"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
};

export function ParticlesBackground({
  count = 60,
  color = "#00ff41",
  speed = 0.3,
  className,
}: {
  count?: number;
  color?: string;
  speed?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const countRef = useRef(count);

  // Update target count smoothly
  countRef.current = count;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const initParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
    });

    particlesRef.current = Array.from({ length: 100 }, initParticle);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const targetCount = countRef.current;

      // Parse color
      const hex = color;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fade out particles beyond target count
        const shouldBeVisible = i < targetCount;
        const targetOpacity = shouldBeVisible ? p.opacity : 0;
        const currentDrawOpacity = shouldBeVisible
          ? p.opacity
          : Math.max(0, p.opacity - 0.005);

        if (!shouldBeVisible) {
          p.opacity = currentDrawOpacity;
          if (p.opacity <= 0) continue;
        }

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${currentDrawOpacity})`;
        ctx.fill();

        // Subtle glow for larger particles
        if (p.size > 1.5 && currentDrawOpacity > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${currentDrawOpacity * 0.1})`;
          ctx.fill();
        }
      }

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
      className={className ?? "fixed inset-0 z-0 pointer-events-none"}
    />
  );
}
