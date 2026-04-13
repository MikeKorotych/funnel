"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

type Notification = {
  id: string;
  app: string;
  logo: ReactNode;
  text: string;
  color: string;
};

function AppLogo({ d, color, bg }: { d: string; color: string; bg: string }) {
  return (
    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
        <path d={d} />
      </svg>
    </div>
  );
}

// SVG paths for app logos (simplified)
const logos = {
  instagram: <AppLogo bg="#E4405F" color="#fff" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
  tiktok: <AppLogo bg="#000" color="#fff" d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-.81-.07z" />,
  twitter: <AppLogo bg="#1DA1F2" color="#fff" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
  discord: <AppLogo bg="#5865F2" color="#fff" d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-14.184c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.384 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.516.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z" />,
  whatsapp: <AppLogo bg="#25D366" color="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />,
  youtube: <AppLogo bg="#FF0000" color="#fff" d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
};

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: "1", app: "Instagram", logo: logos.instagram, text: "sarah_k liked your photo", color: "#E4405F" },
  { id: "2", app: "TikTok", logo: logos.tiktok, text: "Your video has 1.2K new views", color: "#000" },
  { id: "3", app: "Twitter", logo: logos.twitter, text: "5 new notifications", color: "#1DA1F2" },
  { id: "4", app: "Discord", logo: logos.discord, text: "Mike: Bro, all-nighter tonight? 🎮", color: "#5865F2" },
  { id: "5", app: "WhatsApp", logo: logos.whatsapp, text: "Mom: Are you coming for dinner?", color: "#25D366" },
  { id: "6", app: "YouTube", logo: logos.youtube, text: "New video from your subscription", color: "#FF0000" },
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
  const [phase, setPhase] = useState<"appearing" | "dissolving" | "done">("appearing");

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
        setTimeout(() => setPhase("dissolving"), dissolveAfterMs - notifications.length * intervalMs);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [notifications, intervalMs, dissolveAfterMs]);

  useEffect(() => {
    if (phase === "dissolving") {
      const timer = setTimeout(() => {
        setPhase("done");
        onComplete?.();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  if (phase === "done") return null;

  return (
    <div className={cn("flex flex-col gap-2 w-full max-w-[340px] mx-auto overflow-visible", className)}>
      <AnimatePresence mode="sync">
        {visible.map((notif, i) => {
          const scatter = scatterDirections[i % scatterDirections.length];
          return (
            <motion.div
              layout
              key={`notif-${notif.id}`}
              initial={{ opacity: 0, y: -40, scale: 0.8 }}
              animate={
                phase === "dissolving"
                  ? {
                      opacity: 0,
                      x: scatter.x,
                      y: scatter.y,
                      scale: 0.1,
                      rotate: scatter.rotate,
                      filter: "blur(12px) brightness(2)",
                    }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              transition={
                phase === "dissolving"
                  ? { duration: 0.7, delay: i * 0.06, ease: [0.36, 0, 0.66, -0.56] }
                  : { type: "spring", stiffness: 200, damping: 20, layout: { duration: 0.15 } }
              }
              className="flex items-center gap-3 bg-white/[0.06] backdrop-blur-md rounded-xl px-3 py-2.5 border border-white/[0.08]"
            >
              {notif.logo}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-white/70">{notif.app}</p>
                <p className="text-[13px] text-white/50 truncate">{notif.text}</p>
              </div>
              <span className="text-[10px] text-white/20">now</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
