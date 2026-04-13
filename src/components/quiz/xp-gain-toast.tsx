"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function XpGainToast({ xp }: { xp: number }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timer);
  }, [xp]);

  return (
    <AnimatePresence>
      {visible && xp > 0 && (
        <motion.div
          key={xp}
          initial={{ opacity: 1, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -20, scale: 1 }}
          exit={{ opacity: 0, y: -60, scale: 1.1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="fixed top-20 right-6 z-50 pointer-events-none"
        >
          <span className="text-lg font-bold text-accent drop-shadow-lg">
            +{xp} XP
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
