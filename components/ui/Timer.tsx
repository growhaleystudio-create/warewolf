"use client";

import React, { useEffect, useState, useRef } from "react";
import { audioEngine } from "@/lib/audioEngine";

interface TimerProps {
  durationSeconds: number;
  isRunning: boolean;
  onComplete?: () => void;
  onTick?: (remaining: number) => void;
  className?: string;
}

export function Timer({
  durationSeconds,
  isRunning,
  onComplete,
  onTick,
  className = "",
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);
  const hasTriggeredCompleteRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    setTimeLeft(durationSeconds);
    hasTriggeredCompleteRef.current = false;
  }, [durationSeconds]);

  // Handle countdown interval
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 1);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Handle sound and callbacks on timeLeft change
  useEffect(() => {
    if (!isRunning) return;

    if (onTickRef.current) {
      onTickRef.current(timeLeft);
    }

    if (timeLeft <= 5 && timeLeft > 0) {
      audioEngine.playHeartbeat();
    }

    if (timeLeft === 0 && !hasTriggeredCompleteRef.current) {
      hasTriggeredCompleteRef.current = true;
      audioEngine.playBell();
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }
  }, [timeLeft, isRunning]);

  const progress = durationSeconds > 0 ? (timeLeft / durationSeconds) * 100 : 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  // SVG Circular stroke calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const isLowTime = timeLeft <= 10 && timeLeft > 0;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
        {/* Background Track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="stroke-amber-900/30"
          strokeWidth="6"
          fill="transparent"
        />
        {/* Progress Ring */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          className={`transition-all duration-1000 ease-linear ${
            isLowTime
              ? "stroke-red-500 animate-pulse"
              : "stroke-amber-400"
          }`}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>

      {/* Center Digital Display */}
      <div className="absolute flex flex-col items-center justify-center">
        <span
          className={`font-mono text-2xl font-bold tracking-wider ${
            timeLeft === 0
              ? "text-red-400 font-extrabold"
              : isLowTime
              ? "text-red-400 animate-pulse"
              : "text-amber-100"
          }`}
        >
          {formattedTime}
        </span>
        <span className="text-[10px] uppercase tracking-widest font-semibold text-amber-300/70">
          {timeLeft === 0 ? "Waktu Habis" : isRunning ? "Berjalan" : "Dijeda"}
        </span>
      </div>
    </div>
  );
}
