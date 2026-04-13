'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

export function WavyBackground({
  children,
  className,
  colors,
  waveWidth = 50,
  backgroundFill = '#0a0a0a',
  blur = 10,
  speed = 'fast',
  waveOpacity = 0.5,
}: {
  children?: React.ReactNode;
  className?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: 'slow' | 'fast';
  waveOpacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const waveColors = colors ?? ['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#22d3ee'];

    let t = 0;
    const speedVal = speed === 'slow' ? 0.003 : 0.006;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drawWave = (color: string, offset: number, amplitude: number, yCenter: number) => {
      ctx.beginPath();

      for (let x = 0; x <= canvas.width; x += 3) {
        const y =
          yCenter +
          Math.sin(x / waveWidth + t + offset) * amplitude +
          Math.sin(x / (waveWidth * 0.7) + t * 1.5 + offset * 1.5) * (amplitude * 0.4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const animate = () => {
      ctx.fillStyle = backgroundFill;
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = waveOpacity;

      const centerY = canvas.height * 0.5;

      waveColors.forEach((color, i) => {
        const offset = i * 1.2;
        const amplitude = 25 + i * 8;
        const yOffset = (i - waveColors.length / 2) * 12;
        drawWave(color, offset, amplitude, centerY + yOffset);
      });

      ctx.globalAlpha = 1;
      t += speedVal;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [backgroundFill, waveWidth, speed, colors, waveOpacity]);

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{ filter: `blur(${blur}px)` }}
      />
      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  );
}
