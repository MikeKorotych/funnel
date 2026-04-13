"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function SceneTransition({
  nodeId,
  children,
}: {
  nodeId: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={nodeId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
