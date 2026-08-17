import React from "react";

export function VillagerIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Sun/Village Ring */}
      <circle cx="50" cy="50" r="44" className="fill-amber-500/10 stroke-amber-600/30" strokeWidth="1.5" />
      {/* Rustic Peasant Hood */}
      <path
        d="M32 40C32 26 68 26 68 40C68 54 62 62 50 64C38 62 32 54 32 40Z"
        className="fill-amber-800/40 stroke-amber-700"
        strokeWidth="2"
      />
      {/* Face */}
      <circle cx="50" cy="44" r="12" className="fill-amber-100/90 stroke-amber-800" strokeWidth="1.5" />
      {/* Eyes & Friendly Expression */}
      <circle cx="46" cy="42" r="1.5" className="fill-amber-900" />
      <circle cx="54" cy="42" r="1.5" className="fill-amber-900" />
      <path d="M47 48Q50 51 53 48" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Peasant Tunic & Collar */}
      <path d="M30 82L38 64H62L70 82H30Z" className="fill-stone-700 stroke-stone-800" strokeWidth="2" />
      {/* Wooden Pitchfork / Lantern */}
      <path d="M72 35V80M67 35H77M67 30V35M77 30V35M72 26V35" stroke="#ca8a04" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
