'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

type Notification = {
  id: string;
  app: string;
  logo: ReactNode;
  text: string;
  color: string;
};

function ImgLogo({
  src,
  bg,
  scale,
}: {
  src: string;
  bg: string;
  scale?: number;
}) {
  return (
    <div
      className="w-9 h-9 rounded-lg shrink-0 overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        style={scale ? { transform: `scale(${scale})` } : undefined}
      />
    </div>
  );
}

function SvgLogo({ d, color, bg }: { d: string; color: string; bg: string }) {
  return (
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
      style={{ backgroundColor: bg }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
        <path d={d} />
      </svg>
    </div>
  );
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    app: 'Instagram',
    logo: <ImgLogo src="/images/icons/instagram.svg" bg="#E4405F" />,
    text: 'sarah_k liked your photo',
    color: '#E4405F',
  },
  {
    id: '2',
    app: 'TikTok',
    logo: <ImgLogo src="/images/icons/tiktok.svg" bg="#000" scale={0.7} />,
    text: 'Your video has 1.2K new views',
    color: '#fff',
  },
  {
    id: '3',
    app: 'X',
    logo: <ImgLogo src="/images/icons/twitter.png" bg="#000000" />,
    text: '5 new notifications',
    color: '#fff',
  },
  {
    id: '4',
    app: 'Discord',
    logo: <ImgLogo src="/images/icons/discord.svg" bg="#5865F2" />,
    text: 'Mike: Bro, all-nighter tonight? 🎮',
    color: '#5865F2',
  },
  {
    id: '5',
    app: 'WhatsApp',
    logo: <ImgLogo src="/images/icons/whatsapp.png" bg="#25D366" />,
    text: 'Mom: Are you coming for dinner?',
    color: '#25D366',
  },
  {
    id: '6',
    app: 'YouTube',
    logo: (
      <SvgLogo
        bg="#FF0000"
        color="#fff"
        d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      />
    ),
    text: 'New video from your subscription',
    color: '#FF0000',
  },
];

const scatterDirections = [
  { x: -300, y: -150, rotate: -45 },
  { x: 250, y: -200, rotate: 30 },
  { x: -200, y: 100, rotate: -60 },
  { x: 350, y: -50, rotate: 50 },
  { x: -150, y: 200, rotate: -35 },
  { x: 200, y: 150, rotate: 40 },
];

export function AnimatedNotifications({
  notifications = DEFAULT_NOTIFICATIONS,
  intervalMs = 700,
  dissolveAfterMs = 3500,
  onComplete,
  className,
}: {
  notifications?: Notification[];
  intervalMs?: number;
  dissolveAfterMs?: number;
  onComplete?: () => void;
  className?: string;
}) {
  const [visible, setVisible] = useState<Notification[]>([]);
  const [phase, setPhase] = useState<'appearing' | 'dissolving' | 'done'>(
    'appearing',
  );

  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      if (idx < notifications.length) {
        const notif = notifications[idx];
        setVisible((prev) => {
          if (prev.some((n) => n.id === notif.id)) return prev;
          return [notif, ...prev];
        });
        idx++;
      } else {
        clearInterval(timer);
        setTimeout(
          () => setPhase('dissolving'),
          dissolveAfterMs - notifications.length * intervalMs,
        );
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [notifications, intervalMs, dissolveAfterMs]);

  useEffect(() => {
    if (phase === 'dissolving') {
      const timer = setTimeout(() => {
        setPhase('done');
        onComplete?.();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className={cn(
        'flex flex-col gap-2 w-full max-w-[340px] mx-auto overflow-visible',
        className,
      )}
    >
      <AnimatePresence mode="sync">
        {visible.map((notif, i) => {
          const scatter = scatterDirections[i % scatterDirections.length];
          return (
            <motion.div
              layout
              key={`notif-${notif.id}`}
              initial={{ opacity: 0, y: -40, scale: 0.8 }}
              animate={
                phase === 'dissolving'
                  ? {
                      opacity: 0,
                      x: scatter.x,
                      y: scatter.y,
                      scale: 0.1,
                      rotate: scatter.rotate,
                      filter: 'blur(12px) brightness(2)',
                    }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              transition={
                phase === 'dissolving'
                  ? {
                      duration: 0.7,
                      delay: i * 0.06,
                      ease: [0.36, 0, 0.66, -0.56],
                    }
                  : {
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                      layout: { duration: 0.15 },
                    }
              }
              className="flex items-center gap-3 bg-white/[0.06] backdrop-blur-md rounded-xl px-3 py-2.5 border border-white/[0.08]"
            >
              {notif.logo}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-white/70">
                  {notif.app}
                </p>
                <p className="text-[13px] text-white/50 truncate">
                  {notif.text}
                </p>
              </div>
              <span className="text-[10px] text-white/20">now</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
