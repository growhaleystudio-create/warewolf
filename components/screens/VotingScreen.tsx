"use client";

import React, { useState } from "react";
import { Player } from "@/lib/types";
import { PlayerCard } from "../ui/PlayerCard";
import { Vote, Gavel, UserCheck, ShieldAlert, Check, ArrowRight } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface VotingScreenProps {
  roundNumber: number;
  players: Player[];
  votingTally: Record<string, number>;
  onCastVote: (voterId: string, targetId: string | null) => void;
  onResolveVoting: (manualTargetId?: string | null) => void;
}

export function VotingScreen({
  roundNumber,
  players,
  votingTally,
  onCastVote,
  onResolveVoting,
}: VotingScreenProps) {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [isSecretMode, setIsSecretMode] = useState<boolean>(false);
  const [secretVoterIndex, setSecretVoterIndex] = useState<number>(0);
  const [hasSecretVoted, setHasSecretVoted] = useState<boolean>(false);

  const alivePlayers = players.filter((p) => p.isAlive);
  const currentSecretVoter = alivePlayers[secretVoterIndex];

  // Mode 1: Open Vote Selection
  const handleOpenSelect = (player: Player) => {
    audioEngine.playTap();
    if (selectedTargetId === player.id) {
      setSelectedTargetId(null);
    } else {
      setSelectedTargetId(player.id);
    }
  };

  // Mode 2: Secret Vote Selection
  const handleSecretVoteSelect = (player: Player) => {
    audioEngine.playTap();
    onCastVote(currentSecretVoter.id, player.id);
    setHasSecretVoted(true);
  };

  const handleNextSecretVoter = () => {
    audioEngine.playTap();
    setHasSecretVoted(false);
    if (secretVoterIndex + 1 < alivePlayers.length) {
      setSecretVoterIndex(secretVoterIndex + 1);
    } else {
      // Selesai seluruh secret ballot, langsung resolusikan
      audioEngine.playBell();
      onResolveVoting();
    }
  };

  const handleExecuteLynch = () => {
    audioEngine.playBell();
    onResolveVoting(selectedTargetId);
  };

  const handleTiePeacefulDay = () => {
    audioEngine.playTap();
    onResolveVoting(null);
  };

  const selectedPlayer = players.find((p) => p.id === selectedTargetId);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-semibold uppercase tracking-wider">
          <Gavel className="w-3.5 h-3.5 text-red-400" />
          <span>Pengadilan Desa — Putaran {roundNumber}</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-100">
          PEMUNGUTAN SUARA (VOTING)
        </h2>
        <p className="text-stone-300 text-xs sm:text-sm max-w-lg mx-auto">
          Tentukan siapa warga yang paling dicurigai untuk dieksekusi gantung hari ini demi menyelamatkan desa!
        </p>
      </div>

      {/* Mode Selector Toggle */}
      <div className="flex justify-center">
        <div className="bg-stone-900/90 border border-stone-700/80 rounded-2xl p-1.5 flex gap-1 shadow-md">
          <button
            type="button"
            onClick={() => {
              audioEngine.playTap();
              setIsSecretMode(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              !isSecretMode
                ? "bg-amber-500 text-stone-950 shadow-md font-bold"
                : "text-stone-300 hover:text-white"
            }`}
          >
            Mode Voting Terbuka (Musyawarah)
          </button>
          <button
            type="button"
            onClick={() => {
              audioEngine.playTap();
              setIsSecretMode(true);
              setSecretVoterIndex(0);
              setHasSecretVoted(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isSecretMode
                ? "bg-amber-500 text-stone-950 shadow-md font-bold"
                : "text-stone-300 hover:text-white"
            }`}
          >
            Mode Voting Rahasia (Pass & Play)
          </button>
        </div>
      </div>

      {/* Mode 1: Open Voting UI */}
      {!isSecretMode && (
        <div className="bg-stone-900/80 border border-stone-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
          <div className="text-center space-y-1">
            <span className="text-xs text-stone-400 uppercase font-semibold">
              Pilih Warga yang Terpilih Berdasarkan Suara Terbanyak di Meja:
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {alivePlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isSelected={selectedTargetId === player.id}
                onSelect={() => handleOpenSelect(player)}
                badgeText={selectedTargetId === player.id ? "TERPILIH" : undefined}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-stone-800">
            <button
              type="button"
              disabled={!selectedTargetId}
              onClick={handleExecuteLynch}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-serif font-bold text-sm tracking-wide shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Gavel className="w-4 h-4" />
              <span>
                EKSEKUSI GANTUNG {selectedPlayer ? selectedPlayer.name.toUpperCase() : ""}
              </span>
            </button>

            <button
              type="button"
              onClick={handleTiePeacefulDay}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs border border-stone-600 transition-all active:scale-95"
            >
              Hasil Seri / Hari Damai (Tidak Ada Eksekusi)
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Secret Ballot UI */}
      {isSecretMode && currentSecretVoter && (
        <div className="bg-stone-900/80 border border-stone-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md text-center max-w-xl mx-auto">
          {!hasSecretVoted ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">
                  Giliran Memilih ({secretVoterIndex + 1}/{alivePlayers.length}):
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-100">
                  {currentSecretVoter.name}
                </h3>
                <p className="text-xs text-stone-400">
                  Pilih 1 pemain yang ingin kamu gantung:
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {alivePlayers
                  .filter((p) => p.id !== currentSecretVoter.id)
                  .map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      onSelect={() => handleSecretVoteSelect(player)}
                    />
                  ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-serif text-xl font-bold text-stone-100">
                  Suara Berhasil Dicatat!
                </h4>
                <p className="text-xs text-stone-300">
                  Silakan oper perangkat kepada pemilih berikutnya.
                </p>
              </div>

              <button
                type="button"
                onClick={handleNextSecretVoter}
                className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-sm tracking-wide shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>
                  {secretVoterIndex + 1 < alivePlayers.length
                    ? "OPER KE PEMILIH BERIKUTNYA"
                    : "LIHAT HASIL PERHITUNGAN SUARA"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
