import React from "react";

export function DoctorIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Healing Aura */}
      <circle cx="50" cy="50" r="44" className="fill-emerald-500/10 stroke-emerald-500/30" strokeWidth="1.5" />
      {/* Satchel / Medicine Bag */}
      <rect x="28" y="44" width="44" height="36" rx="6" className="fill-emerald-900/80 stroke-emerald-400" strokeWidth="2" />
      {/* Satchel Handle */}
      <path d="M40 44V34C40 31 60 31 60 34V44" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      {/* Medical Cross */}
      <rect x="46" y="52" width="8" height="20" rx="1" className="fill-emerald-200" />
      <rect x="40" y="58" width="20" height="8" rx="1" className="fill-emerald-200" />
      {/* Herbal Leaves */}
      <path d="M68 28C68 28 78 26 78 36C68 36 68 28 68 28Z" className="fill-emerald-400 stroke-emerald-300" strokeWidth="1" />
      <path d="M32 28C32 28 22 26 22 36C32 36 32 28 32 28Z" className="fill-emerald-400 stroke-emerald-300" strokeWidth="1" />
    </svg>
  );
}
