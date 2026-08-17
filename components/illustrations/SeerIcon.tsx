import React from "react";

export function SeerIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Mystical Ring */}
      <circle cx="50" cy="50" r="44" className="fill-purple-900/20 stroke-purple-400/40" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Crystal Ball Stand */}
      <path d="M40 82L44 68H56L60 82H40Z" className="fill-amber-700/80 stroke-amber-500" strokeWidth="1.5" />
      {/* Crystal Orb */}
      <circle cx="50" cy="48" r="24" className="fill-indigo-950/80 stroke-cyan-400" strokeWidth="2" />
      <circle cx="50" cy="48" r="20" className="fill-cyan-500/20" />
      {/* All-Seeing Eye inside orb */}
      <path d="M35 48C40 40 60 40 65 48C60 56 40 56 35 48Z" className="fill-cyan-100 stroke-cyan-300" strokeWidth="1.5" />
      <circle cx="50" cy="48" r="4.5" className="fill-indigo-900 stroke-cyan-400" strokeWidth="1.5" />
      <circle cx="51.5" cy="46.5" r="1.5" className="fill-white" />
      {/* Mystical Sparkles */}
      <path d="M50 14L52 20L58 22L52 24L50 30L48 24L42 22L48 20L50 14Z" className="fill-cyan-300" />
      <circle cx="26" cy="32" r="1.5" className="fill-purple-300" />
      <circle cx="74" cy="32" r="1.5" className="fill-purple-300" />
    </svg>
  );
}
