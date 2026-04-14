'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export function TextGenerateEffect({
  text,
  speed = 0.08,
  delay = 0,
  className,
  start = true,
  periodPause = 0,
  commaPause = 0,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  start?: boolean;
  /** Extra pause (seconds) after a word ending with . ! ? */
  periodPause?: number;
  /** Extra pause (seconds) after a word ending with , ; : */
  commaPause?: number;
}) {
  const tokens = useMemo(() => {
    const wordList = text.split(' ');
    let cumDelay = 0;

    return wordList.map((word, i) => {
      if (i > 0) {
        const prev = wordList[i - 1];
        const last = prev[prev.length - 1];
        if (last === '.' || last === '!' || last === '?') {
          cumDelay += periodPause;
        } else if (last === ',' || last === ';' || last === ':') {
          cumDelay += commaPause;
        }
        cumDelay += speed;
      }
      return { word, delay: cumDelay };
    });
  }, [text, speed, periodPause, commaPause]);

  return (
    <p className={cn(className)}>
      {tokens.map((token, i) => (
        <motion.span
          key={`${token.word}-${i}`}
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={
            start
              ? { opacity: 1, filter: 'blur(0px)' }
              : { opacity: 0, filter: 'blur(8px)' }
          }
          transition={{
            duration: 0.4,
            delay: delay + token.delay,
            ease: 'easeOut',
          }}
          className="inline-block mr-[0.25em]"
        >
          {token.word}
        </motion.span>
      ))}
    </p>
  );
}
