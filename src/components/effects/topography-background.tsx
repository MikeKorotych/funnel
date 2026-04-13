'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * Animated topography contour lines — canvas-based, slowly shifting.
 */
export function TopographyBackground({
  children,
  className,
  color = 'rgba(255,255,255,0.06)',
}: {
  children?: React.ReactNode;
  className?: string;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;

    const draw = () => {
      const { width, height } = canvas;
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      // Draw ~12 contour lines that slowly shift
      for (let line = 0; line < 12; line++) {
        const baseY = (height / 12) * line + 30;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 4) {
          const y =
            baseY +
            Math.sin(x * 0.008 + t + line * 0.5) * 25 +
            Math.sin(x * 0.015 + t * 0.7 + line * 0.3) * 15 +
            Math.cos(x * 0.005 + t * 1.2 + line) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      t += 0.003;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [color]);

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  );
}
