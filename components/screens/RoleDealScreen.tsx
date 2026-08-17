"use client";

import React from "react";
import { Player } from "@/lib/types";
import { ROLES } from "@/lib/roles";
import { RoleIcon } from "../illustrations/RoleIcon";
import { RoleIllustration } from "../illustrations/RoleIllustration";
import { Eye, EyeOff, UserCheck, ArrowRight, ShieldAlert } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface RoleDealScreenProps {
  players: Player[];
  currentIndex: number;
  isRevealed: boolean;
  onReveal: () => void;
  onNext: () => void;
}

export function RoleDealScreen({
  players,
  currentIndex,
  isRevealed,
  onReveal,
  onNext,
}: RoleDealScreenProps) {
  const currentPlayer = players[currentIndex];
  if (!currentPlayer) return null;

  const roleDef = ROLES[currentPlayer.role];
  const isLastPlayer = currentIndex === players.length - 1;

  const handleRevealCard = () => {
    audioEngine.playCardFlip();
    onReveal();
  };

  const handleNextPlayer = () => {
    audioEngine.playTap();
    onNext();
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 flex flex-col items-center justify-center min-h-[75vh] space-y-6">
      {/* Progress Indicator */}
      <div className="w-full space-y-2">
        <div className="flex justify-between items-center text-xs text-stone-400 font-mono">
          <span>Pembagian Kartu Rahasia</span>
          <span>
            Pemain {currentIndex + 1} dari {players.length}
          </span>
        </div>
        <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / players.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Card Container */}
      {!isRevealed ? (
        /* State 1: Privacy Shield Screen */
        <div className="w-full bg-stone-900/80 border border-stone-700/80 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-md animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <UserCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Serahkan Perangkat Ke:
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-stone-100">
              {currentPlayer.name}
            </h2>
          </div>

          <div className="p-4 bg-stone-950/60 rounded-xl border border-stone-800 text-stone-300 text-xs flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-left">
              Pastikan pemain lain tidak melihat layar sebelum menekan tombol buka di bawah!
            </p>
          </div>

          <button
            type="button"
            onClick={handleRevealCard}
            className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-base tracking-wide shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            <span>BUKA KARTU RAHASIA SAYA</span>
          </button>
        </div>
      ) : (
        /* State 2: Secret Role Revealed Card */
        <div className="w-full bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl backdrop-blur-md animate-fadeIn relative overflow-hidden">
          {/* Faction Banner */}
          <div className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 border border-amber-400/40 text-amber-300">
            {roleDef.faction === "WEREWOLF"
              ? "🐺 Faksi Serigala (Jahat)"
              : roleDef.faction === "NEUTRAL"
              ? "🎭 Faksi Netral"
              : "🛡️ Faksi Warga Desa (Baik)"}
          </div>

          {/* Role Illustration & Title */}
          <div className="space-y-4">
            <RoleIllustration role={currentPlayer.role} size="md" className="mx-auto shadow-2xl" />

            <div className="space-y-1">
              <span className="text-xs text-stone-400 font-medium">Peran Rahasia {currentPlayer.name}:</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-200">
                {roleDef.name}
              </h2>
            </div>
          </div>

          {/* Role Description */}
          <div className="p-4 bg-stone-950/70 rounded-2xl border border-stone-800/80 text-stone-200 text-sm leading-relaxed">
            <p>{roleDef.description}</p>
          </div>

          {/* Hide & Next CTA */}
          <button
            type="button"
            onClick={handleNextPlayer}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-stone-800 to-stone-700 hover:from-stone-700 hover:to-stone-600 text-amber-200 font-serif font-bold text-base tracking-wide border border-amber-500/30 shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <EyeOff className="w-5 h-5 text-amber-400" />
            <span>
              {isLastPlayer
                ? "SELESAI (MASUKI MALAM PERTAMA)"
                : "SEMBUNYIKAN & OPER KE PEMAIN BERIKUTNYA"}
            </span>
            <ArrowRight className="w-4 h-4 ml-1 text-amber-400" />
          </button>
        </div>
      )}
    </div>
  );
}
