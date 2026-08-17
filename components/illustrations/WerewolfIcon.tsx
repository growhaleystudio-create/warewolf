import React from "react";

export function WerewolfIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Full Moon Background */}
      <circle cx="50" cy="50" r="44" className="fill-amber-100/10 stroke-amber-200/30" strokeWidth="1.5" />
      <circle cx="36" cy="36" r="6" className="fill-amber-200/20" />
      <circle cx="64" cy="30" r="4" className="fill-amber-200/20" />

      {/* Wolf Snout & Silhouette */}
      <path
        d="M26 68L22 42L36 50L50 24L64 50L78 42L74 68L62 82H38L26 68Z"
        className="fill-slate-900 stroke-red-500/80"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner Fur Lines */}
      <path d="M50 24V46M38 52L50 62L62 52M44 68L50 74L56 68" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-red-400" />
      {/* Glowing Predator Eyes */}
      <polygon points="38,48 44,50 40,54" className="fill-red-500" />
      <polygon points="62,48 56,50 60,54" className="fill-red-500" />
      {/* Sharp Fangs */}
      <polygon points="44,70 47,77 49,70" className="fill-amber-100" />
      <polygon points="56,70 53,77 51,70" className="fill-amber-100" />
    </svg>
  );
}
