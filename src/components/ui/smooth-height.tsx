'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function SmoothHeightContainer({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setHeight(el.offsetHeight);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn('overflow-hidden transition-[height] duration-150 ease-out', className)}
      style={{ height: height !== undefined ? `${height}px` : 'auto' }}
    >
      <div ref={innerRef} className={innerClassName}>{children}</div>
    </div>
  );
}
