import React from "react";

export function JesterIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background Ring */}
      <circle cx="50" cy="50" r="44" className="fill-rose-500/10 stroke-rose-400/30" strokeWidth="1.5" />
      {/* Jester Hat (Two Horns with Bells) */}
      <path
        d="M24 46C20 28 36 20 44 32C50 20 66 28 62 46H24Z"
        className="fill-purple-700 stroke-purple-400"
        strokeWidth="2"
      />
      {/* Left & Right Bell */}
      <circle cx="20" cy="30" r="4" className="fill-amber-400 stroke-amber-200" strokeWidth="1" />
      <circle cx="66" cy="30" r="4" className="fill-amber-400 stroke-amber-200" strokeWidth="1" />
      {/* Dual Mask (Half Happy, Half Sinister) */}
      <path
        d="M32 46H68C68 64 58 74 50 76C42 74 32 64 32 46Z"
        className="fill-amber-100 stroke-purple-900"
        strokeWidth="2"
      />
      {/* Mask Split Line */}
      <path d="M50 46V76" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="2 2" />
      {/* Left Eye & Smile (Playful) */}
      <path d="M38 52C40 50 44 50 46 52" stroke="#4c1d95" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M38 64C41 68 47 68 49 64" stroke="#4c1d95" strokeWidth="1.5" strokeLinecap="round" />
      {/* Right Eye & Grin (Sinister/Crazy) */}
      <circle cx="58" cy="53" r="2.5" className="fill-red-600" />
      <path d="M51 64C53 69 60 70 63 62" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      {/* Collar Ruffles */}
      <path d="M28 78L36 72L44 78L50 72L56 78L64 72L72 78" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
