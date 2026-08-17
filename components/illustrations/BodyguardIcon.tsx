import React from "react";

export function BodyguardIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background Ring */}
      <circle cx="50" cy="50" r="44" className="fill-blue-500/10 stroke-blue-500/30" strokeWidth="1.5" />
      {/* Heavy Steel Medieval Shield */}
      <path
        d="M50 20L74 28V52C74 68 50 82 50 82C50 82 26 68 26 52V28L50 20Z"
        className="fill-slate-800 stroke-blue-400"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner Shield Rim */}
      <path
        d="M50 28L66 34V52C66 64 50 74 50 74C50 74 34 64 34 52V34L50 28Z"
        className="fill-blue-950/60 stroke-amber-400"
        strokeWidth="1.5"
      />
      {/* Crest: Crossed Swords */}
      <path d="M42 42L58 58M58 42L42 58" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="50" r="3" className="fill-amber-300" />
    </svg>
  );
}
