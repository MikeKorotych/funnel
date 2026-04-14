'use client';

import { useState, useEffect, useRef } from 'react';

export function EyeOpenReveal({
  duration = 4,
  onComplete,
}: {
  duration?: number;
  onComplete?: () => void;
}) {
  const [done, setDone] = useState(false);
  const [blur, setBlur] = useState(24);
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

    const startTime = performance.now();
    const totalMs = duration * 1000;

    // Simple 3-phase: closed → half-open → blink → full open
    const keyframes: [number, number][] = [
      [0, 0], // закрыт
      [0.15, 0], // пауза
      [0.45, 0.45], // полуоткрыт
      [0.58, 0.3], // лёгкое моргание (было 0.15 — слишком сильно)
      [1, 1], // полностью открыт
    ];

    function interpolate(progress: number): number {
      for (let i = 0; i < keyframes.length - 1; i++) {
        const [t0, v0] = keyframes[i];
        const [t1, v1] = keyframes[i + 1];
        if (progress >= t0 && progress <= t1) {
          const local = (progress - t0) / (t1 - t0);
          const smooth = local * local * (3 - 2 * local);
          return v0 + (v1 - v0) * smooth;
        }
      }
      return 1;
    }

    const draw = (now: number) => {
      const { width, height } = canvas;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalMs, 1);
      const openness = interpolate(progress);

      // Blur: stays at 24px for most of animation, drops to 0 in last 15%
      const blurFade = progress < 0.85 ? 1 : 1 - (progress - 0.85) / 0.15;
      setBlur(24 * blurFade);

      if (progress >= 1) {
        setDone(true);
        onComplete?.();
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw black overlay
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Cut out eye shape with soft edge via shadow blur
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';

      const cx = width / 2;
      const cy = height / 2;
      const maxDim = Math.max(width, height);

      // Eye dimensions — fully closed at openness=0, huge when fully open
      const eyeW = maxDim * 2 * openness;
      const eyeH = maxDim * 2 * openness * openness;

      // Soft edge — always blurred, more when closed
      const softness = 40 + 60 * (1 - openness);
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = softness;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = '#ffffff';

      // Eye path
      ctx.beginPath();
      ctx.moveTo(cx - eyeW / 2, cy);
      ctx.bezierCurveTo(
        cx - eyeW / 3,
        cy - eyeH / 2,
        cx + eyeW / 3,
        cy - eyeH / 2,
        cx + eyeW / 2,
        cy,
      );
      ctx.bezierCurveTo(
        cx + eyeW / 3,
        cy + eyeH / 2,
        cx - eyeW / 3,
        cy + eyeH / 2,
        cx - eyeW / 2,
        cy,
      );
      ctx.closePath();
      ctx.fill();

      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [duration, onComplete]);

  if (done) return null;

  return (
    <>
      {/* Eye mask canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[100] pointer-events-none"
      />
      {/* Blur overlay — on top of everything including the mask */}
      <div
        className="fixed inset-0 z-[101] pointer-events-none"
        style={{
          backdropFilter: `blur(${blur.toFixed(1)}px)`,
          WebkitBackdropFilter: `blur(${blur.toFixed(1)}px)`,
        }}
      />
    </>
  );
}
