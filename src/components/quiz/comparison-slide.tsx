'use client';

import { motion } from 'framer-motion';
import {
  Smartphone,
  Sun,
  Moon,
  Heart,
  Brain,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const addicted = [
  { icon: Moon, text: '73% report poor sleep' },
  { icon: TrendingDown, text: '40% increase in anxiety' },
  { icon: Smartphone, text: '96 phone checks per day' },
  { icon: Brain, text: '8-second average attention span' },
];

const free = [
  { icon: Sun, text: '1h+ extra quality sleep' },
  { icon: Heart, text: 'Significant drop in depression' },
  { icon: TrendingUp, text: '32% boost in productivity' },
  { icon: Brain, text: 'Better focus and memory' },
];

export function ComparisonSlide({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col flex-1 py-4">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Source */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-[10px] uppercase tracking-[0.3em] text-white/25 mb-8"
        >
          Based on research from NIH, UPenn, and Stanford
        </motion.p>

        {/* Shared container — both sections share one width, centered as a block */}
        <div className="flex flex-col items-center">
          {/* Addiction section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col gap-3"
          >
            <p className="text-[11px] uppercase tracking-[0.25em] text-red-400/60 flex items-center gap-2">
              <Smartphone size={12} className="text-red-400/50" />
              With phone addiction
            </p>

            <div className="flex flex-col gap-2.5 pl-5">
              {addicted.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.12 }}
                  className="flex items-center gap-2.5"
                >
                  <item.icon size={13} className="shrink-0 text-red-400/40" />
                  <span className="text-[13px] text-white/45">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="my-6 h-px w-16 origin-center bg-gradient-to-r from-transparent via-white/12 to-transparent"
          />

          {/* Detox section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="flex flex-col gap-3"
          >
            <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-400/60 flex items-center gap-2">
              <Sun size={12} className="text-emerald-400/50" />
              After digital detox
            </p>

            <div className="flex flex-col gap-2.5 pl-5">
              {free.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.4, delay: 1.25 + i * 0.12 }}
                  className="flex items-center gap-2.5"
                >
                  <item.icon
                    size={13}
                    className="shrink-0 text-emerald-400/40"
                  />
                  <span className="text-[13px] text-white/50">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Button pinned at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.5 }}
        className="pt-4 pb-8 shrink-0"
      >
        <Button onClick={onContinue} className="w-full">
          I Want to Change
        </Button>
      </motion.div>
    </div>
  );
}
