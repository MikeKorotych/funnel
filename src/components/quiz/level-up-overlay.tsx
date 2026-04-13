"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function LevelUpOverlay({
  level,
  onDismiss,
}: {
  level: number;
  onDismiss: () => void;
}) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onDismiss();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => {
            setShow(false);
            onDismiss();
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-6xl">⚡</span>
            <h2 className="text-3xl font-bold text-accent">Level Up!</h2>
            <p className="text-xl text-text-primary">Level {level}</p>
            <div className="mt-2 h-px w-32 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
