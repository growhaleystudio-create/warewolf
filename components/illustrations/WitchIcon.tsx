import React from "react";

export function WitchIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Mystical Ring */}
      <circle cx="50" cy="50" r="44" className="fill-fuchsia-950/20 stroke-fuchsia-500/30" strokeWidth="1.5" />
      {/* Cauldron */}
      <ellipse cx="50" cy="46" rx="22" ry="6" className="fill-stone-900 stroke-stone-600" strokeWidth="2" />
      <path
        d="M28 46C28 66 36 78 50 78C64 78 72 66 72 46"
        className="fill-stone-800 stroke-stone-600"
        strokeWidth="2"
      />
      {/* Cauldron Legs */}
      <path d="M34 74L28 84M66 74L72 84M50 78V85" stroke="#57534e" strokeWidth="3" strokeLinecap="round" />
      {/* Bubbling Magic Brew */}
      <ellipse cx="50" cy="46" rx="18" ry="4" className="fill-emerald-400/80" />
      <circle cx="44" cy="38" r="3" className="fill-emerald-400" />
      <circle cx="54" cy="34" r="2" className="fill-fuchsia-400" />
      <circle cx="58" cy="40" r="1.5" className="fill-emerald-300" />
      {/* Two Vials: Healing (Green) and Poison (Purple) */}
      <rect x="20" y="24" width="8" height="14" rx="2" className="fill-emerald-500/80 stroke-emerald-300" strokeWidth="1" />
      <rect x="72" y="24" width="8" height="14" rx="2" className="fill-purple-600/80 stroke-purple-300" strokeWidth="1" />
    </svg>
  );
}
