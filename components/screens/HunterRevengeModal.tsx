"use client";

import React, { useState } from "react";
import { Player } from "@/lib/types";
import { HunterIcon } from "../illustrations/HunterIcon";
import { PlayerCard } from "../ui/PlayerCard";
import { Target, Flame } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface HunterRevengeModalProps {
  hunterPlayer: Player | undefined;
  players: Player[];
  onShootTarget: (targetId: string) => void;
}

export function HunterRevengeModal({
  hunterPlayer,
  players,
  onShootTarget,
}: HunterRevengeModalProps) {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const alivePlayers = players.filter((p) => p.isAlive && p.id !== hunterPlayer?.id);

  const handleTargetSelect = (player: Player) => {
    audioEngine.playTap();
    setSelectedTargetId(player.id);
  };

  const handleFireShot = () => {
    if (!selectedTargetId) return;
    audioEngine.playHeartbeat();
    onShootTarget(selectedTargetId);
  };

  const selectedPlayer = players.find((p) => p.id === selectedTargetId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-stone-900 border-2 border-red-500/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center p-2">
          <HunterIcon className="w-14 h-14" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-xs font-bold uppercase">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Tembakan Terakhir Pemburu</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-100">
            {hunterPlayer?.name} Telah Gugur!
          </h3>
          <p className="text-stone-300 text-xs sm:text-sm">
            Sebelum menghembuskan nafas terakhir, Pemburu menarik busurnya untuk menembak mati 1 pemain pilihannya:
          </p>
        </div>

        {/* Target Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
          {alivePlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isSelected={selectedTargetId === player.id}
              onSelect={() => handleTargetSelect(player)}
              badgeText={selectedTargetId === player.id ? "BIDIKAN" : undefined}
            />
          ))}
        </div>

        {/* CTA Fire Shot */}
        <button
          type="button"
          disabled={!selectedTargetId}
          onClick={handleFireShot}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-serif font-bold text-base tracking-wide shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Target className="w-5 h-5" />
          <span>
            LEPASKAN TEMBAKAN KE {selectedPlayer ? selectedPlayer.name.toUpperCase() : ""}
          </span>
        </button>
      </div>
    </div>
  );
}
