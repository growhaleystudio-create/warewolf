"use client";

import React, { useState, useEffect } from "react";
import { Player } from "@/lib/types";
import { PlayerCard } from "../ui/PlayerCard";
import { Timer } from "../ui/Timer";
import { Sun, MessageSquare, Play, Pause, Plus, Vote, Users } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface DayPhaseScreenProps {
  roundNumber: number;
  players: Player[];
  durationSeconds: number;
  revealRoleOnDeath: boolean;
  onStartVoting: () => void;
}

export function DayPhaseScreen({
  roundNumber,
  players,
  durationSeconds,
  revealRoleOnDeath,
  onStartVoting,
}: DayPhaseScreenProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [currentDuration, setCurrentDuration] = useState(durationSeconds);

  useEffect(() => {
    setCurrentDuration(durationSeconds);
    setIsTimerRunning(true);
  }, [durationSeconds]);

  const alivePlayers = players.filter((p) => p.isAlive);
  const deadPlayers = players.filter((p) => !p.isAlive);

  const togglePause = () => {
    audioEngine.playTap();
    setIsTimerRunning(!isTimerRunning);
  };

  const addExtraTime = () => {
    audioEngine.playTap();
    setCurrentDuration((prev) => prev + 30);
  };

  const handleVotingClick = () => {
    audioEngine.playBell();
    onStartVoting();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Fase Siang — Putaran {roundNumber}</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-100">
          FORUM MUSYAWARAH DESA
        </h2>
        <p className="text-stone-300 text-xs sm:text-sm max-w-lg mx-auto">
          Diskusikan kecurigaan, cocokkan alibi, dan temukan siapa serigala yang bersembunyi di antara warga!
        </p>
      </div>

      {/* Timer & Discussion Controls Bar */}
      <div className="bg-stone-900/80 border border-stone-700/80 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-around gap-6 shadow-xl backdrop-blur-md">
        <Timer
          durationSeconds={currentDuration}
          isRunning={isTimerRunning}
          onComplete={() => setIsTimerRunning(false)}
        />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={togglePause}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 text-xs font-semibold transition-all active:scale-95"
          >
            {isTimerRunning ? (
              <>
                <Pause className="w-4 h-4 text-amber-400" />
                <span>Jeda Waktu</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Lanjutkan</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={addExtraTime}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 text-xs font-semibold transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>+30 Detik</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleVotingClick}
          className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Vote className="w-4 h-4" />
          <span>MULAI VOTING SEKARANG</span>
        </button>
      </div>

      {/* Living Players Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            Warga yang Masih Hidup ({alivePlayers.length})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {alivePlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>

      {/* Dead Players Section (if any) */}
      {deadPlayers.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-stone-800">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Warga yang Telah Gugur ({deadPlayers.length})
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {deadPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                showRole={revealRoleOnDeath}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
