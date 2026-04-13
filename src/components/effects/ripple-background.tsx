'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * Animated concentric ripple rings emanating from center — canvas-based.
 */
export function RippleBackground({
  children,
  className,
  color = 'rgba(255,255,255,0.08)',
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

    // Each ring: radius grows, opacity fades, then resets
    const rings = Array.from({ length: 6 }, (_, i) => ({
      radius: i * 80,
      maxRadius: 500,
      speed: 0.4 + i * 0.05,
      opacity: 1 - i * 0.15,
    }));

    const draw = () => {
      const { width, height } = canvas;
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (const ring of rings) {
        ring.radius += ring.speed;
        if (ring.radius > ring.maxRadius) {
          ring.radius = 0;
        }

        const alpha = Math.max(0, (1 - ring.radius / ring.maxRadius) * ring.opacity);
        ctx.beginPath();
        ctx.arc(cx, cy, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
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
