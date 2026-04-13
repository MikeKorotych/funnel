'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

type Direction = 'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT';
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type Ripple = { id: number; x: number; y: number };

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const movingMap: Record<Direction, string> = {
  TOP: 'radial-gradient(50% 70% at 50% 0%, #ffffff 0%, #808080 40%, transparent 100%)',
  LEFT: 'radial-gradient(40% 70% at 0% 50%, #ffffff 0%, #808080 40%, transparent 100%)',
  BOTTOM:
    'radial-gradient(50% 70% at 50% 100%, #ffffff 0%, #808080 40%, transparent 100%)',
  RIGHT:
    'radial-gradient(40% 70% at 100% 50%, #ffffff 0%, #808080 40%, transparent 100%)',
};

const hoverHighlight =
  'radial-gradient(80% 200% at 50% 50%, #ffffff 0%, #a0a0a0 30%, transparent 100%)';

function rotateDirection(current: Direction, clockwise: boolean): Direction {
  const dirs: Direction[] = ['TOP', 'LEFT', 'BOTTOM', 'RIGHT'];
  const i = dirs.indexOf(current);
  return clockwise
    ? dirs[(i - 1 + dirs.length) % dirs.length]
    : dirs[(i + 1) % dirs.length];
}

const variantBase: Record<ButtonVariant, string> = {
  primary: 'bg-white text-[#0a0a0a] font-semibold',
  secondary: 'bg-[#171717] text-[#ededed]',
  ghost: 'bg-transparent text-[#a3a3a3] hover:text-white hover:bg-white/5',
};

export function Button({
  className,
  variant = 'primary',
  children,
  disabled,
  onClick,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>('TOP');
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [pressing, setPressing] = useState(false);

  const showBorder = variant === 'primary' && !disabled;

  // Rotate the gradient light around the border
  useEffect(() => {
    if (hovered || !showBorder) return;
    const interval = setInterval(() => {
      setDirection((d) => rotateDirection(d, true));
    }, 1000);
    return () => clearInterval(interval);
  }, [hovered, showBorder]);

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

  // Simple button for non-primary variants
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

  // Primary button with hover-border-gradient effect
  return (
    <motion.div
      className="relative flex rounded-xl content-center bg-[#2a2a2a] transition duration-500 items-center flex-col h-min justify-center overflow-visible p-[2px] w-full"
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
        {/* Ripple on click */}
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

      {/* Travelling gradient border */}
      <motion.div
        className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        style={{
          filter: 'blur(5px)',
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], hoverHighlight]
            : movingMap[direction],
        }}
        transition={{ ease: 'linear', duration: 1 }}
      />

      {/* Inner mask — fills everything except the 2px border */}
      <div className="bg-white absolute z-1 flex-none inset-[2px] rounded-[10px]" />
    </motion.div>
  );
}
