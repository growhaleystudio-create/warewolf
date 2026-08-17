"use client";

import React from "react";
import { Player, RoleId } from "@/lib/types";
import { ROLES } from "@/lib/roles";
import { RoleIcon } from "../illustrations/RoleIcon";
import { Users, Crown, Skull, CheckCircle2 } from "lucide-react";

interface PlayerStatusRosterProps {
  players: Player[];
  currentUserId: string;
  isGameOver?: boolean;
  className?: string;
}

export function PlayerStatusRoster({
  players,
  currentUserId,
  isGameOver = false,
  className = "",
}: PlayerStatusRosterProps) {
  const aliveCount = players.filter((p) => p.isAlive).length;
  const deadCount = players.length - aliveCount;

  return (
    <div
      className={`bg-stone-900/95 border border-stone-700/80 rounded-3xl p-4 space-y-3 shadow-2xl backdrop-blur-md ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-400" />
          <span className="font-serif font-bold text-xs sm:text-sm text-stone-100">
            Daftar Pemain & Status
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold">
          <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30">
            ● {aliveCount} Hidup
          </span>
          <span className="px-2 py-0.5 rounded-full bg-stone-950 text-stone-400 border border-stone-800">
            💀 {deadCount} Gugur
          </span>
        </div>
      </div>

      {/* Players List Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
        {players.map((p) => {
          const isMe = p.id === currentUserId;
          const isAlive = p.isAlive;
          const roleDef = ROLES[p.role];

          return (
            <div
              key={p.id}
              className={`p-2 rounded-xl border flex items-center justify-between gap-1.5 transition-all ${
                isAlive
                  ? isMe
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-100"
                    : "bg-stone-950/80 border-stone-800/80 text-stone-200"
                  : "bg-stone-950/40 border-stone-800/40 opacity-60 text-stone-500"
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0 truncate">
                <div className="w-6 h-6 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center p-0.5 shrink-0">
                  <RoleIcon role={p.role} className="w-4 h-4" />
                </div>
                <div className="min-w-0 truncate">
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-xs font-bold truncate ${
                        !isAlive ? "line-through text-stone-500" : isMe ? "text-amber-300" : "text-stone-100"
                      }`}
                    >
                      {p.name}
                    </span>
                    {isMe && (
                      <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-semibold shrink-0">
                        Anda
                      </span>
                    )}
                  </div>
                  {(isGameOver || !isAlive) && p.role !== "VILLAGER" && (
                    <div className="text-[9px] text-stone-400 font-medium truncate">
                      {roleDef.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                {isAlive ? (
                  <span
                    className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-400"
                    title="Masih Hidup"
                  >
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-0.5 text-[9px] font-bold text-red-400"
                    title="Gugur"
                  >
                    <Skull className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
