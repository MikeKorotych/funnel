'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, Heart, Globe, Music, MapPin } from 'lucide-react';
import { NumberTicker } from '@/components/effects/number-ticker';

const reflectionItems = [
  { icon: Sparkles, text: 'Joy' },
  { icon: Compass, text: 'Curiosity' },
  { icon: Heart, text: 'Things that really mattered' },
] as const;

const alternativeItems = [
  { icon: Globe, text: 'Learn a language' },
  { icon: Music, text: 'Master an instrument' },
  { icon: MapPin, text: 'See half the world' },
] as const;

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
  const totalDays = useMemo(() => Math.round(totalHours / 24), [totalHours]);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStage(1), 1500),
      window.setTimeout(() => setStage(2), 2800),
      window.setTimeout(() => setStage(3), 6300),
      window.setTimeout(() => setStage(4), 9300),
      window.setTimeout(() => onComplete(), 10800),
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

        <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">
          In the last 5 years
        </p>

        <div className="mt-3 flex items-baseline gap-2">
          <NumberTicker
            value={totalHours}
            className="text-7xl font-black leading-none tracking-tight text-white sm:text-7xl"
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
        className="mt-5 text-center text-white/40"
      >
        That&apos;s{' '}
        <span className="text-xl font-bold text-white/70 tabular-nums">
          {totalDays}&nbsp;full&nbsp;days
        </span>
        . Gone.
      </motion.p>

      {/* ── Expanding divider — stage 2 ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          stage >= 2 ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
        }
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 h-px w-12 origin-center bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      {/* ── Soft reflection — stage 2 ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={stage >= 2 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-5 flex flex-col items-center gap-2.5"
      >
        <p
          className="text-[13px] mb-1"
          style={{ color: 'rgba(255,255,255,0.40)' }}
        >
          Not all of it was wasted. There was:
        </p>
        {reflectionItems.map(({ icon: Icon, text }, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
            animate={
              stage >= 2
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 6, filter: 'blur(6px)' }
            }
            transition={{ duration: 0.5, delay: 1.2 + i * 0.8 }}
            className="flex items-center gap-2.5"
          >
            <Icon
              className="h-4 w-4 shrink-0"
              style={{ color: `rgba(255,255,255,${0.48 + i * 0.08})` }}
            />
            <span
              className="text-[13px] leading-relaxed"
              style={{ color: `rgba(255,255,255,${0.48 + i * 0.08})` }}
            >
              {text}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Divider between blocks ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          stage >= 3 ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
        }
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 h-px w-12 origin-center bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      {/* ── Contrast beat — stage 3 ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={stage >= 3 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-5 flex flex-col items-center gap-2.5"
      >
        <p
          className="text-[13px] mb-1"
          style={{ color: 'rgba(255,255,255,0.72)' }}
        >
          But that was also enough time to:
        </p>
        {alternativeItems.map(({ icon: Icon, text }, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
            animate={
              stage >= 3
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 6, filter: 'blur(6px)' }
            }
            transition={{ duration: 0.5, delay: 0.6 + i * 0.8 }}
            className="flex items-center gap-2.5"
          >
            <Icon
              className="h-4 w-4 shrink-0"
              style={{ color: `rgba(255,255,255,${0.80 + i * 0.08})` }}
            />
            <span
              className="text-[13px] leading-relaxed"
              style={{ color: `rgba(255,255,255,${0.80 + i * 0.08})` }}
            >
              {text}
            </span>
          </motion.div>
        ))}
      </motion.div>

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
