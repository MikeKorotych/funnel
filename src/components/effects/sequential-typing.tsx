'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type Step =
  | { type: 'type'; text: string; speed?: number }
  | { type: 'delete'; speed?: number }
  | { type: 'pause'; ms: number }
  | { type: 'newline' }
  | { type: 'fade-in'; text: string; duration?: number };

export function SequentialTyping({
  steps,
  className,
  onComplete,
}: {
  steps: Step[];
  className?: string;
  onComplete?: () => void;
}) {
  const linesRef = useRef<string[]>(['']);
  const currentLineRef = useRef(0);
  const fadeTextsRef = useRef<string[]>([]);
  const showCursorRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const [viewState, setViewState] = useState({
    lines: [''],
    currentLine: 0,
    fadeTexts: [] as string[],
    showCursor: true,
  });
  const rerender = useCallback(
    () =>
      setViewState({
        lines: [...linesRef.current],
        currentLine: currentLineRef.current,
        fadeTexts: [...fadeTextsRef.current],
        showCursor: showCursorRef.current,
      }),
    [],
  );

  useEffect(() => {
    // Abort any previous run
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Reset
    linesRef.current = [''];
    currentLineRef.current = 0;
    fadeTextsRef.current = [];
    showCursorRef.current = true;
    rerender();

    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const id = setTimeout(resolve, ms);
        controller.signal.addEventListener('abort', () => {
          clearTimeout(id);
          reject(new Error('aborted'));
        });
      });

    const execute = async () => {
      try {
        await wait(200);

        for (const step of steps) {
          if (controller.signal.aborted) return;

          if (step.type === 'type') {
            const speed = step.speed ?? 40;
            for (let i = 1; i <= step.text.length; i++) {
              linesRef.current[currentLineRef.current] = step.text.slice(0, i);
              rerender();
              await wait(speed);
            }
          } else if (step.type === 'delete') {
            const speed = step.speed ?? 20;
            while (
              (linesRef.current[currentLineRef.current] ?? '').length > 0 ||
              currentLineRef.current > 0
            ) {
              if ((linesRef.current[currentLineRef.current] ?? '').length > 0) {
                linesRef.current[currentLineRef.current] =
                  linesRef.current[currentLineRef.current].slice(0, -1);
              } else {
                linesRef.current.pop();
                currentLineRef.current = Math.max(
                  0,
                  linesRef.current.length - 1,
                );
              }
              rerender();
              await wait(speed);
            }
          } else if (step.type === 'pause') {
            await wait(step.ms);
          } else if (step.type === 'newline') {
            linesRef.current.push('');
            currentLineRef.current = linesRef.current.length - 1;
            rerender();
          } else if (step.type === 'fade-in') {
            fadeTextsRef.current.push(step.text);
            rerender();
            await wait((step.duration ?? 500) + 200);
          }
        }

        showCursorRef.current = false;
        rerender();
        onComplete?.();
      } catch {
        // aborted — do nothing
      }
    };

    execute();

    return () => controller.abort();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={cn('text-lg font-medium text-text-primary leading-relaxed', className)}>
      {viewState.lines.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
          {i === viewState.currentLine && viewState.showCursor && (
            <span className="cursor-blink text-text-secondary ml-0.5">|</span>
          )}
        </span>
      ))}

      {viewState.fadeTexts.map((text, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="block mt-3 text-sm text-text-secondary"
        >
          {text}
        </motion.span>
      ))}
    </div>
  );
}
