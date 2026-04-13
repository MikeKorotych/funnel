"use client";

import { useState, useEffect } from "react";

export function CountdownTimer({
  minutes = 15,
  text,
}: {
  minutes?: number;
  text?: string;
}) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="flex items-center justify-center gap-2 text-[#c9a96e]">
      <span className="text-sm">{text ?? "Special price expires in"}</span>
      <span className="font-mono font-bold text-base tabular-nums">
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}
