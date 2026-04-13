'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * Animated gradient blobs — canvas-based, slow-moving colored orbs.
 */
export function GradientAnimationBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
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

    const blobs = [
      {
        x: 0.2,
        y: 0.3,
        r: 250,
        color: 'rgba(56,189,248,0.08)',
        sx: 0.000004,
        sy: 0.000005,
      },
      {
        x: 0.8,
        y: 0.7,
        r: 300,
        color: 'rgba(192,132,252,0.07)',
        sx: 0.000005,
        sy: 0.000003,
      },
      {
        x: 0.5,
        y: 0.5,
        r: 200,
        color: 'rgba(232,121,249,0.06)',
        sx: 0.000006,
        sy: 0.000003,
      },
      {
        x: 0.3,
        y: 0.8,
        r: 220,
        color: 'rgba(34,211,238,0.05)',
        sx: 0.000003,
        sy: 0.000006,
      },
    ];

    let t = 0;

    const draw = () => {
      const { width, height } = canvas;
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      for (const blob of blobs) {
        const bx = width * (blob.x + Math.sin(t * blob.sx * 1000) * 0.15);
        const by = height * (blob.y + Math.cos(t * blob.sy * 1000) * 0.15);

        const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, blob.r);
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      t += 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{ filter: 'blur(40px)' }}
      />
      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  );
}
