'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type Ripple = { id: number; x: number; y: number };

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const variantBase: Record<ButtonVariant, string> = {
  primary: 'bg-white text-[#0a0a0a] font-semibold',
  secondary: 'bg-[#171717] text-[#ededed]',
  ghost: 'bg-transparent text-[#a3a3a3] hover:text-white hover:bg-white/5',
};

/** Convert angle (degrees) to a position on the border perimeter */
function angleToPosition(angle: number): { x: string; y: string } {
  const rad = (angle * Math.PI) / 180;
  const x = 50 + 50 * Math.cos(rad);
  const y = 50 + 50 * Math.sin(rad);
  return { x: `${x.toFixed(1)}%`, y: `${y.toFixed(1)}%` };
}

export function Button({
  className,
  variant = 'primary',
  children,
  disabled,
  onClick,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [gradient, setGradient] = useState('');
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);

  const showBorder = variant === 'primary' && !disabled;

  const sizeRef = useRef(40);
  const hoveredRef = useRef(false);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  // Continuous smooth rotation + smooth size interpolation via rAF
  useEffect(() => {
    if (!showBorder) return;

    const animate = () => {
      angleRef.current = (angleRef.current + 0.5) % 360;

      // Smoothly lerp size toward target
      const target = hoveredRef.current ? 160 : 40;
      sizeRef.current += (target - sizeRef.current) * 0.04;

      const { x, y } = angleToPosition(angleRef.current);
      const s = sizeRef.current;
      const s2 = s * 1.6;
      setGradient(
        `radial-gradient(${s.toFixed(0)}% ${s2.toFixed(0)}% at ${x} ${y}, #ffffff 0%, #808080 40%, transparent 100%)`,
      );
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [showBorder]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y }]);
      setTimeout(
        () => setRipples((prev) => prev.filter((r) => r.id !== id)),
        900,
      );
      onClick?.();
    },
    [disabled, onClick],
  );

  // Non-primary variants — simple button
  if (!showBorder) {
    return (
      <motion.button
        whileTap={disabled ? undefined : { scale: 0.97 }}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          'relative w-full rounded-xl px-6 py-4 text-base font-medium',
          'min-h-[48px] select-none cursor-pointer overflow-hidden',
          'disabled:opacity-30 disabled:pointer-events-none',
          variant === 'secondary' && 'border border-[#303030]',
          variantBase[variant],
          className,
        )}
      >
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }

  // Primary — hover border gradient
  return (
    <motion.div
      className="relative flex rounded-xl content-center bg-[#2a2a2a] items-center flex-col h-min justify-center overflow-visible p-[2px] w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressing(false);
      }}
      onPointerDown={() => setPressing(true)}
      onPointerUp={() => setPressing(false)}
      animate={pressing ? { scale: 0.97 } : { scale: 1 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      onClick={handleClick}
    >
      {/* Inner content */}
      <div
        className={cn(
          'w-full z-10 bg-white rounded-xl px-6 py-4 text-base font-semibold text-[#0a0a0a]',
          'min-h-[48px] select-none cursor-pointer overflow-hidden text-center relative',
          className,
        )}
      >
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ width: 0, height: 0, opacity: 0.4 }}
              animate={{ width: 400, height: 400, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: ripple.x - 200,
                top: ripple.y - 200,
                background:
                  'radial-gradient(circle, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.04) 50%, transparent 70%)',
              }}
            />
          ))}
        </AnimatePresence>
        <span className="relative z-10">{children}</span>
      </div>

      {/* Smooth gradient border — continuous angle, no snapping */}
      <div
        className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        style={{
          filter: 'blur(4px)',
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: gradient,
          transition: hovered ? 'none' : 'none',
        }}
      />

      {/* Inner mask */}
      <div className="bg-white absolute z-[1] flex-none inset-[2px] rounded-[10px]" />
    </motion.div>
  );
}
