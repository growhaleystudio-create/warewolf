import React from "react";

export function HunterIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Target Ring */}
      <circle cx="50" cy="50" r="44" className="fill-amber-900/10 stroke-amber-600/30" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="30" stroke="#d97706" strokeWidth="1" strokeDasharray="4 4" />
      {/* Crossbow Bow Arc */}
      <path
        d="M24 38C34 26 66 26 76 38"
        stroke="#b45309"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Bowstring */}
      <path d="M24 38L50 64L76 38" stroke="#fef08a" strokeWidth="1.5" />
      {/* Crossbow Stock & Trigger */}
      <path d="M50 24V78M44 58H56" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
      {/* Loaded Arrow */}
      <path d="M50 20V50" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <polygon points="50,14 46,24 54,24" className="fill-red-600 stroke-red-400" strokeWidth="1" />
      {/* Arrow Fletching */}
      <path d="M46 48L50 44L54 48" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
