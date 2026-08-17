import React from "react";
import { Player } from "@/lib/types";
import { ROLES } from "@/lib/roles";
import { RoleIcon } from "../illustrations/RoleIcon";
import { Shield, Heart, Skull } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  showRole?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  badgeText?: string;
  className?: string;
}

export function PlayerCard({
  player,
  showRole = false,
  isSelected = false,
  onSelect,
  disabled = false,
  badgeText,
  className = "",
}: PlayerCardProps) {
  const roleDef = ROLES[player.role];

  return (
    <button
      type="button"
      disabled={disabled || !player.isAlive}
      onClick={onSelect}
      className={`relative group flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 ${
        !player.isAlive
          ? "bg-stone-900/40 border-stone-800/80 text-stone-500 opacity-60 cursor-not-allowed"
          : isSelected
          ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/20 scale-[1.02]"
          : "bg-stone-900/60 border-stone-700/60 text-stone-200 hover:border-amber-500/60 hover:bg-stone-800/60 active:scale-95"
      } ${className}`}
    >
      {/* Alive / Dead Indicator */}
      <div className="relative mb-2">
        <RoleIcon
          role={showRole ? player.role : "VILLAGER"}
          className={`w-14 h-14 ${!player.isAlive ? "grayscale opacity-50" : ""}`}
        />
        {!player.isAlive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
            <Skull className="w-8 h-8 text-red-500 animate-pulse" />
          </div>
        )}
      </div>

      {/* Player Name */}
      <span className="font-medium text-sm text-stone-100 truncate max-w-[110px]">
        {player.name}
      </span>

      {/* Role Tag (if revealed) */}
      {showRole && (
        <span
          className={`text-[11px] font-semibold mt-1 px-2 py-0.5 rounded-full border ${
            roleDef.faction === "WEREWOLF"
              ? "bg-red-950/60 text-red-300 border-red-500/40"
              : roleDef.faction === "NEUTRAL"
              ? "bg-purple-950/60 text-purple-300 border-purple-500/40"
              : "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
          }`}
        >
          {roleDef.name}
        </span>
      )}

      {/* Custom Badge Text (e.g. Vote count) */}
      {badgeText && (
        <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-stone-950 shadow-md">
          {badgeText}
        </span>
      )}

      {/* Status indicator icons */}
      <div className="absolute top-2 left-2 flex gap-1">
        {player.isProtectedByDoctor && player.isAlive && (
          <Heart className="w-3.5 h-3.5 text-emerald-400" />
        )}
        {player.isProtectedByBodyguard && player.isAlive && (
          <Shield className="w-3.5 h-3.5 text-blue-400" />
        )}
      </div>
    </button>
  );
}
