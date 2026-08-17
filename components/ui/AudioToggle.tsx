"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

export function AudioToggle() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(audioEngine.getMuted());
  }, []);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
    if (!nextMuted) {
      audioEngine.playTap();
    }
  };

  return (
    <button
      onClick={toggleSound}
      title={isMuted ? "Aktifkan Suara" : "Bisukan Suara"}
      aria-label={isMuted ? "Aktifkan Suara" : "Bisukan Suara"}
      className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-red-400" />
      ) : (
        <Volume2 className="w-5 h-5 text-amber-400" />
      )}
    </button>
  );
}
