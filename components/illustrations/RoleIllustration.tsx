"use client";

import React, { useState } from "react";
import { RoleId } from "@/lib/types";
import { ROLES } from "@/lib/roles";

interface RoleIllustrationProps {
  role: RoleId;
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
  showFrame?: boolean;
}

const ROLE_IMAGE_MAP: Record<RoleId, string> = {
  WEREWOLF: "/roles/werewolf.jpg",
  SEER: "/roles/seer.jpg",
  DOCTOR: "/roles/doctor.jpg",
  BODYGUARD: "/roles/bodyguard.jpg",
  WITCH: "/roles/witch.jpg",
  HUNTER: "/roles/hunter.jpg",
  VILLAGER: "/roles/villager.jpg",
  JESTER: "/roles/jester.jpg",
};

export function RoleIllustration({
  role,
  className = "",
  size = "md",
  showFrame = true,
}: RoleIllustrationProps) {
  const [imgError, setImgError] = useState(false);
  const roleInfo = ROLES[role];
  const imageSrc = ROLE_IMAGE_MAP[role];

  const sizeClasses = {
    sm: "w-24 h-32 text-xs",
    md: "w-44 h-60 text-sm",
    lg: "w-60 h-80 text-base",
    full: "w-full aspect-[3/4] text-base",
  }[size];

  // Render Full AI Dark Fantasy Art for all 8 roles
  if (imageSrc && !imgError) {
    return (
      <div
        className={`relative rounded-3xl overflow-hidden shadow-2xl border-2 transition-all group ${sizeClasses} ${className} ${
          role === "WEREWOLF"
            ? "border-red-500/70 shadow-red-950/60"
            : role === "SEER"
            ? "border-purple-500/70 shadow-purple-950/60"
            : role === "DOCTOR"
            ? "border-emerald-500/70 shadow-emerald-950/60"
            : role === "BODYGUARD"
            ? "border-amber-500/70 shadow-amber-950/60"
            : role === "WITCH"
            ? "border-fuchsia-500/70 shadow-fuchsia-950/60"
            : role === "HUNTER"
            ? "border-orange-500/70 shadow-orange-950/60"
            : role === "JESTER"
            ? "border-pink-500/70 shadow-pink-950/60"
            : "border-stone-500/70 shadow-stone-950/60"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={`${roleInfo.name} Illustration`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Ornate Gold Runic Tarot Corner Overlays */}
        {showFrame && (
          <div className="absolute inset-1.5 rounded-2xl border border-amber-500/40 pointer-events-none z-10 flex flex-col justify-between p-1.5">
            <div className="flex justify-between text-[8px] text-amber-300 font-serif drop-shadow">
              <span>᚛᚛</span>
              <span>✦</span>
              <span>᚜᚜</span>
            </div>
            <div className="flex justify-between text-[8px] text-amber-300 font-serif drop-shadow">
              <span>᚛᚛</span>
              <span>✦</span>
              <span>᚜᚜</span>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute bottom-2 inset-x-2 text-center pointer-events-none z-20">
          <span className="font-serif font-black text-amber-200 text-xs sm:text-sm drop-shadow-lg tracking-wider">
            {roleInfo.name.toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  // Fallback: High-Detail Dark Fantasy Vector Tarot Card Artworks
  return (
    <div
      className={`relative rounded-3xl overflow-hidden shadow-2xl border-2 transition-all group select-none ${sizeClasses} ${className} ${
        role === "WEREWOLF"
          ? "border-red-500/60 bg-gradient-to-b from-stone-950 via-red-950/80 to-stone-950 shadow-red-950/50"
          : role === "SEER"
          ? "border-purple-500/60 bg-gradient-to-b from-stone-950 via-indigo-950/80 to-stone-950 shadow-indigo-950/50"
          : role === "DOCTOR"
          ? "border-emerald-500/60 bg-gradient-to-b from-stone-950 via-emerald-950/80 to-stone-950 shadow-emerald-950/50"
          : role === "BODYGUARD"
          ? "border-amber-500/60 bg-gradient-to-b from-stone-950 via-yellow-950/80 to-stone-950 shadow-amber-950/50"
          : role === "WITCH"
          ? "border-purple-500/60 bg-gradient-to-b from-stone-950 via-fuchsia-950/80 to-stone-950 shadow-fuchsia-950/50"
          : role === "HUNTER"
          ? "border-orange-500/60 bg-gradient-to-b from-stone-950 via-orange-950/80 to-stone-950 shadow-orange-950/50"
          : role === "JESTER"
          ? "border-pink-500/60 bg-gradient-to-b from-stone-950 via-pink-950/80 to-stone-950 shadow-pink-950/50"
          : "border-stone-500/60 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950"
      }`}
    >
      {/* Ornate Gold Runic Tarot Border */}
      {showFrame && (
        <div className="absolute inset-1.5 rounded-2xl border border-amber-500/30 pointer-events-none z-10 flex flex-col justify-between p-1.5">
          <div className="flex justify-between text-[8px] text-amber-400/60 font-serif">
            <span>᚛᚛</span>
            <span>✦</span>
            <span>᚜᚜</span>
          </div>
          <div className="flex justify-between text-[8px] text-amber-400/60 font-serif">
            <span>᚛᚛</span>
            <span>✦</span>
            <span>᚜᚜</span>
          </div>
        </div>
      )}

      {/* Atmospheric Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity">
        <div
          className={`w-32 h-32 rounded-full blur-2xl ${
            role === "WEREWOLF"
              ? "bg-red-600"
              : role === "SEER"
              ? "bg-purple-500"
              : role === "DOCTOR"
              ? "bg-emerald-500"
              : role === "BODYGUARD"
              ? "bg-amber-500"
              : role === "WITCH"
              ? "bg-fuchsia-500"
              : role === "HUNTER"
              ? "bg-orange-500"
              : role === "JESTER"
              ? "bg-pink-500"
              : "bg-stone-500"
          }`}
        />
      </div>

      {/* Main Illustration SVG Content */}
      <div className="w-full h-full flex flex-col items-center justify-center p-3 relative z-0">
        {role === "WEREWOLF" && <WerewolfVectorArt />}
        {role === "SEER" && <SeerVectorArt />}
        {role === "DOCTOR" && <DoctorVectorArt />}
        {role === "BODYGUARD" && <BodyguardVectorArt />}
        {role === "WITCH" && <WitchVectorArt />}
        {role === "HUNTER" && <HunterVectorArt />}
        {role === "JESTER" && <JesterVectorArt />}
        {role === "VILLAGER" && <VillagerVectorArt />}
      </div>

      {/* Card Title Bottom Plate */}
      <div className="absolute bottom-2.5 inset-x-2 text-center z-10 pointer-events-none">
        <div className="inline-block px-3 py-1 rounded-xl bg-stone-950/80 border border-stone-800/90 shadow-md">
          <span className="font-serif font-black text-amber-200 text-xs sm:text-sm drop-shadow-md tracking-wider">
            {roleInfo.name}
          </span>
        </div>
      </div>
    </div>
  );
}

// 1. SEER (Peramal) - Mystic Celestial Oracle
function SeerVectorArt() {
  return (
    <svg viewBox="0 0 200 240" className="w-4/5 h-4/5 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
      <defs>
        <radialGradient id="seerOrb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#c084fc" />
          <stop offset="70%" stopColor="#7e22ce" />
          <stop offset="100%" stopColor="#3b0764" />
        </radialGradient>
        <linearGradient id="seerRobe" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6b21a8" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>

      {/* Starry Constellation Ring */}
      <circle cx="100" cy="110" r="70" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
      <circle cx="100" cy="110" r="85" fill="none" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.3" />

      {/* Hooded Seer Silhouette */}
      <path d="M60,190 C60,130 75,80 100,80 C125,80 140,130 140,190 Z" fill="url(#seerRobe)" />
      <path d="M75,100 C75,60 100,50 100,50 C100,50 125,60 125,100 C115,115 85,115 75,100 Z" fill="#4c1d95" />

      {/* Third Eye Glow on Forehead */}
      <ellipse cx="100" cy="75" rx="7" ry="4" fill="#fbbf24" opacity="0.9" />
      <circle cx="100" cy="75" r="2.5" fill="#ffffff" />

      {/* Floating Mystic Divination Crystal Orb */}
      <circle cx="100" cy="135" r="32" fill="url(#seerOrb)" className="animate-pulse" />
      <ellipse cx="94" cy="125" rx="8" ry="4" fill="#ffffff" opacity="0.7" />

      {/* Hand silhouettes cradling the orb */}
      <path d="M65,155 Q80,140 85,145 Q85,160 70,170 Z" fill="#e9d5ff" opacity="0.8" />
      <path d="M135,155 Q120,140 115,145 Q115,160 130,170 Z" fill="#e9d5ff" opacity="0.8" />

      {/* Floating Runes / Stars */}
      <polygon points="100,15 103,23 111,23 105,28 107,36 100,31 93,36 95,28 89,23 97,23" fill="#fbbf24" />
      <polygon points="45,65 47,70 52,70 48,73 50,78 45,75 40,78 42,73 38,70 43,70" fill="#c084fc" />
      <polygon points="155,65 157,70 162,70 158,73 160,78 155,75 150,78 152,73 148,70 153,70" fill="#c084fc" />
    </svg>
  );
}

// 2. DOCTOR (Dokter) - Plague Doctor & Healing Elixir
function DoctorVectorArt() {
  return (
    <svg viewBox="0 0 200 240" className="w-4/5 h-4/5 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
      <defs>
        <linearGradient id="doctorVial" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="40%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
        <linearGradient id="doctorCoat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
      </defs>

      {/* Cross of Life Light Ring */}
      <circle cx="100" cy="110" r="70" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.4" />
      
      {/* Plague Beak Mask Doctor */}
      <path d="M60,195 C60,135 75,90 100,90 C125,90 140,135 140,195 Z" fill="url(#doctorCoat)" />
      <path d="M70,85 L130,85 L120,65 L80,65 Z" fill="#1c1917" />
      <circle cx="100" cy="95" r="22" fill="#292524" />
      {/* Long Mask Beak */}
      <path d="M92,95 L108,95 L100,135 Z" fill="#d6d3d1" />
      {/* Glowing Goggles */}
      <circle cx="88" cy="92" r="6" fill="#10b981" />
      <circle cx="112" cy="92" r="6" fill="#10b981" />

      {/* Large Glowing Healing Potion Flask */}
      <path d="M92,145 L108,145 L118,185 C118,195 82,195 82,185 Z" fill="url(#doctorVial)" />
      <rect x="94" y="140" width="12" height="5" fill="#78350f" rx="1" />
      {/* Cross on Flask */}
      <rect x="97" y="162" width="6" height="16" fill="#ffffff" rx="1" />
      <rect x="92" y="167" width="16" height="6" fill="#ffffff" rx="1" />

      {/* Sparkling Healing Droplets */}
      <circle cx="70" cy="140" r="3" fill="#6ee7b7" />
      <circle cx="130" cy="140" r="3.5" fill="#6ee7b7" />
      <circle cx="100" cy="40" r="4" fill="#10b981" />
    </svg>
  );
}

// 3. BODYGUARD (Pengawal) - Armored Knight & Tower Shield
function BodyguardVectorArt() {
  return (
    <svg viewBox="0 0 200 240" className="w-4/5 h-4/5 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
      <defs>
        <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>
      </defs>

      {/* Protection Aegis Barrier */}
      <polygon points="100,20 170,50 170,140 100,210 30,140 30,50" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />

      {/* Great Knight Helm */}
      <path d="M82,75 C82,50 118,50 118,75 L115,100 L85,100 Z" fill="#57534e" />
      <rect x="88" y="78" width="24" height="4" fill="#facc15" />
      <line x1="100" y1="72" x2="100" y2="95" stroke="#1c1917" strokeWidth="2" />

      {/* Heavy Ornate Lion Crest Shield */}
      <path d="M65,95 L135,95 L130,165 C130,185 100,200 100,200 C100,200 70,185 70,165 Z" fill="url(#shieldGold)" stroke="#fef08a" strokeWidth="2" />

      {/* Cross & Lion Emblem on Shield */}
      <path d="M100,115 L100,175 M80,135 L120,135" stroke="#451a03" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="135" r="10" fill="#451a03" />

      {/* Bastion Wings / Swords behind */}
      <path d="M45,105 L65,115 L60,155 Z" fill="#78716c" />
      <path d="M155,105 L135,115 L140,155 Z" fill="#78716c" />
    </svg>
  );
}

// 4. WITCH (Penyihir) - Cauldron & Dual Potions (Heal & Poison)
function WitchVectorArt() {
  return (
    <svg viewBox="0 0 200 240" className="w-4/5 h-4/5 filter drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
      <defs>
        <radialGradient id="cauldronGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#c026d3" />
          <stop offset="100%" stopColor="#3b0764" />
        </radialGradient>
      </defs>

      {/* Pointy Witch Hat */}
      <polygon points="100,20 135,75 65,75" fill="#3b0764" stroke="#d946ef" strokeWidth="1" />
      <ellipse cx="100" cy="75" rx="45" ry="8" fill="#1e1b4b" />
      <rect x="85" y="70" width="30" height="5" fill="#f59e0b" />

      {/* Witch Face Silhouette */}
      <circle cx="100" cy="88" r="16" fill="#1c1917" />
      <path d="M96,96 Q100,102 104,96" stroke="#d946ef" strokeWidth="2" fill="none" />

      {/* Bubbling Witch Cauldron */}
      <path d="M60,150 C60,135 140,135 140,150 C140,185 130,200 100,200 C70,200 60,185 60,150 Z" fill="#1e1b4b" stroke="#7e22ce" strokeWidth="2" />
      <ellipse cx="100" cy="148" rx="38" ry="12" fill="url(#cauldronGlow)" />

      {/* Bubbles */}
      <circle cx="85" cy="135" r="6" fill="#34d399" opacity="0.8" />
      <circle cx="115" cy="130" r="8" fill="#e879f9" opacity="0.8" />
      <circle cx="100" cy="120" r="5" fill="#a7f3d0" opacity="0.9" />

      {/* Left Potion: Emerald Heal */}
      <rect x="35" y="145" width="14" height="24" rx="4" fill="#10b981" stroke="#34d399" strokeWidth="1" />
      {/* Right Potion: Violet Poison */}
      <rect x="151" y="145" width="14" height="24" rx="4" fill="#a855f7" stroke="#c084fc" strokeWidth="1" />
    </svg>
  );
}

// 5. HUNTER (Pemburu) - Marksman Crosshairs & Wolf Pelt
function HunterVectorArt() {
  return (
    <svg viewBox="0 0 200 240" className="w-4/5 h-4/5 filter drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">
      {/* Sniper Reticle Target Ring */}
      <circle cx="100" cy="105" r="65" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="8 6" opacity="0.7" />
      <line x1="100" y1="30" x2="100" y2="180" stroke="#f97316" strokeWidth="1" opacity="0.5" />
      <line x1="25" y1="105" x2="175" y2="105" stroke="#f97316" strokeWidth="1" opacity="0.5" />

      {/* Wolf-Pelt Hooded Hunter */}
      <path d="M70,75 C60,40 140,40 130,75 L145,185 L55,185 Z" fill="#431407" />
      {/* Wolf Ears on Pelt */}
      <polygon points="75,45 65,25 85,38" fill="#7c2d12" />
      <polygon points="125,45 135,25 115,38" fill="#7c2d12" />

      {/* Hunter Face */}
      <circle cx="100" cy="85" r="18" fill="#292524" />
      {/* Glowing Sharp Eye */}
      <circle cx="94" cy="82" r="3" fill="#f97316" />
      <circle cx="106" cy="82" r="3" fill="#f97316" />

      {/* Silver Crossbow / Rifle Silhouette */}
      <line x1="60" y1="170" x2="140" y2="110" stroke="#e5e5e5" strokeWidth="4" strokeLinecap="round" />
      <polygon points="145,106 135,108 140,118" fill="#f97316" />
      <circle cx="100" cy="140" r="8" fill="#ea580c" />
    </svg>
  );
}

// 6. JESTER (Pelawak) - Masquerade Mask & Bells
function JesterVectorArt() {
  return (
    <svg viewBox="0 0 200 240" className="w-4/5 h-4/5 filter drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
      {/* Multi-pronged Jester Hat with Bells */}
      <path d="M100,85 C60,35 25,60 20,70 Q45,85 75,95 Z" fill="#ec4899" />
      <path d="M100,85 C140,35 175,60 180,70 Q155,85 125,95 Z" fill="#8b5cf6" />
      <path d="M100,85 C100,25 105,15 100,10 Q95,45 100,85 Z" fill="#facc15" />

      {/* Golden Jester Bells */}
      <circle cx="18" cy="72" r="7" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
      <circle cx="182" cy="72" r="7" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
      <circle cx="100" cy="12" r="7" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />

      {/* Grinning Comedy Mask */}
      <ellipse cx="100" cy="120" rx="34" ry="40" fill="#fdf4ff" stroke="#db2777" strokeWidth="2" />
      {/* Split Face Diamond Eyes */}
      <polygon points="85,105 90,112 85,119 80,112" fill="#ec4899" />
      <polygon points="115,105 120,112 115,119 110,112" fill="#8b5cf6" />
      {/* Giant Mischievous Smile */}
      <path d="M80,135 Q100,158 120,135 Q100,148 80,135 Z" fill="#be185d" />

      {/* Jester Ruffled Collar */}
      <path d="M60,165 L75,185 L90,165 L100,185 L110,165 L125,185 L140,165 L100,195 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
    </svg>
  );
}

// 7. VILLAGER (Warga Desa) - Lantern in Foggy Village
function VillagerVectorArt() {
  return (
    <svg viewBox="0 0 200 240" className="w-4/5 h-4/5 filter drop-shadow-[0_0_15px_rgba(214,211,209,0.4)]">
      <defs>
        <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Background Village Cottages */}
      <polygon points="40,110 65,85 90,110" fill="#292524" />
      <polygon points="110,110 135,80 160,110" fill="#292524" />
      <rect x="45" y="110" width="40" height="40" fill="#1c1917" />
      <rect x="115" y="110" width="40" height="40" fill="#1c1917" />

      {/* Peasant Cloaked Silhouette */}
      <path d="M65,195 C65,130 80,85 100,85 C120,85 135,130 135,195 Z" fill="#44403c" />
      <circle cx="100" cy="85" r="18" fill="#1c1917" />

      {/* Glowing Warm Amber Lantern */}
      <circle cx="135" cy="140" r="30" fill="url(#lanternGlow)" />
      <rect x="125" y="125" width="20" height="30" rx="3" fill="#fef08a" stroke="#78350f" strokeWidth="2" />
      <line x1="125" y1="125" x2="135" y2="110" stroke="#78350f" strokeWidth="2" />
      <line x1="145" y1="125" x2="135" y2="110" stroke="#78350f" strokeWidth="2" />
    </svg>
  );
}

// 8. WEREWOLF VECTOR FALLBACK
function WerewolfVectorArt() {
  return (
    <svg viewBox="0 0 200 240" className="w-4/5 h-4/5 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">
      {/* Full Moon */}
      <circle cx="100" cy="75" r="50" fill="#fef08a" opacity="0.85" />
      <ellipse cx="85" cy="65" rx="8" ry="12" fill="#fde047" opacity="0.4" />

      {/* Howling Werewolf Silhouette on Cliff */}
      <path d="M60,195 L95,125 Q105,100 120,85 Q135,70 145,55 L135,80 Q130,105 140,125 L165,195 Z" fill="#0f0f12" />
      {/* Glowing Red Eyes & Snout */}
      <circle cx="130" cy="72" r="2.5" fill="#ef4444" />
      <polygon points="140,65 145,55 135,62" fill="#ef4444" />

      {/* Slash Claws */}
      <path d="M40,70 L55,100 M55,65 L70,95 M70,60 L85,90" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}
