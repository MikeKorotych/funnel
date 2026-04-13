"use client";

import { useEffect, useRef } from "react";

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FONT_SIZE = 14;
const DROP_SPEED = 0.25;

export function MatrixRain({
  opacity = 1,
  color = "#00ff41",
}: {
  opacity?: number;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columns = Math.floor(canvas.width / FONT_SIZE);
      dropsRef.current = Array.from({ length: columns }, () =>
        Math.random() * -canvas.height / FONT_SIZE,
      );
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${FONT_SIZE}px monospace`;

      const drops = dropsRef.current;
      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        // Brighter head
        ctx.globalAlpha = 0.9;
        ctx.fillText(char, x, y);

        // Dimmer trail
        if (Math.random() > 0.95) {
          ctx.globalAlpha = 0.3;
          ctx.fillText(
            CHARS[Math.floor(Math.random() * CHARS.length)],
            x,
            y - FONT_SIZE,
          );
        }

        ctx.globalAlpha = 1;

        drops[i] += DROP_SPEED + Math.random() * 0.1;

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        opacity,
        transition: "opacity 1s ease-in-out",
      }}
    />
  );
}
