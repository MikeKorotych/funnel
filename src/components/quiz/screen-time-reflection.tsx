'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { NumberTicker } from '@/components/effects/number-ticker';
import { TextGenerateEffect } from '@/components/effects/text-generate-effect';

export function ScreenTimeReflection({
  dailyHours,
  onComplete,
}: {
  dailyHours: number;
  onComplete: () => void;
}) {
  const [stage, setStage] = useState(0);

  const totalHours = useMemo(
    () => Math.round(dailyHours * 365 * 5),
    [dailyHours],
  );
  const totalDays = useMemo(
    () => Math.round(totalHours / 24),
    [totalHours],
  );

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStage(1), 1500),
      window.setTimeout(() => setStage(2), 2800),
      window.setTimeout(() => setStage(3), 7500),
      window.setTimeout(() => setStage(4), 11700),
      window.setTimeout(() => onComplete(), 13200),
    ];

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 overflow-hidden">
      {/* ── Hero number ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center"
      >
        {/* Ambient glow anchored behind the number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 45%, transparent 70%)',
          }}
        />

        <p className="text-[10px] uppercase tracking-[0.35em] text-white/25">
          In the last 5 years
        </p>

        <div className="mt-3 flex items-baseline gap-2">
          <NumberTicker
            value={totalHours}
            className="text-7xl font-black leading-none tracking-tight text-white sm:text-8xl"
          />
          <span className="pb-1 text-xs uppercase tracking-[0.28em] text-white/30">
            hours
          </span>
        </div>
      </motion.div>

      {/* ── "X full days. Gone." — stage 1 ── */}
      <motion.p
        initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
        animate={
          stage >= 1
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y: 8, filter: 'blur(6px)' }
        }
        transition={{ duration: 0.6 }}
        className="mt-5 text-center text-base text-white/40"
      >
        That&apos;s{' '}
        <span className="font-semibold text-white/60 tabular-nums">
          {totalDays}&nbsp;full&nbsp;days
        </span>
        . Gone.
      </motion.p>

      {/* ── Expanding divider — stage 2 ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          stage >= 2
            ? { scaleX: 1, opacity: 1 }
            : { scaleX: 0, opacity: 0 }
        }
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 h-px w-12 origin-center bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      {/* ── Soft reflection — stage 2 (text-generate) ── */}
      <TextGenerateEffect
        text="Not all of it was wasted. There was joy, curiosity, and things that really mattered."
        start={stage >= 2}
        speed={0.16}
        delay={0.3}
        periodPause={0.7}
        commaPause={0.36}
        className="mt-5 max-w-[17rem] text-center text-[13px] leading-relaxed text-white/35"
      />

      {/* ── Contrast beat — stage 3 (text-generate) ── */}
      <TextGenerateEffect
        text="But that was also enough time to learn a language, master an instrument, or see half the world."
        start={stage >= 3}
        speed={0.16}
        periodPause={0.7}
        commaPause={0.36}
        className="mt-4 max-w-[17rem] text-center text-[13px] leading-relaxed text-white/50"
      />

      {/* ── Whisper — stage 4 ── */}
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={stage >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.45 }}
        className="mt-8 text-center text-[10px] uppercase tracking-[0.35em] text-white/20"
      >
        Let&apos;s see what keeps pulling you back
      </motion.p>
    </div>
  );
}
