"use client";

import React, { useEffect } from "react";
import { Player } from "@/lib/types";
import { ROLES } from "@/lib/roles";
import { RoleIcon } from "../illustrations/RoleIcon";
import { Sun, Skull, ShieldCheck, ArrowRight, Bell } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface MorningRevealScreenProps {
  roundNumber: number;
  players: Player[];
  morningDeaths: string[];
  revealRoleOnDeath: boolean;
  onProceedToDay: () => void;
}

export function MorningRevealScreen({
  roundNumber,
  players,
  morningDeaths,
  revealRoleOnDeath,
  onProceedToDay,
}: MorningRevealScreenProps) {
  useEffect(() => {
    audioEngine.stopAmbient();
    audioEngine.playBell();
  }, []);

  const deadPlayers = players.filter((p) => morningDeaths.includes(p.id));
  const hasCasualties = deadPlayers.length > 0;

  const handleContinue = () => {
    audioEngine.playTap();
    onProceedToDay();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col items-center justify-center min-h-[75vh] space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Sun className="w-4 h-4 text-amber-400" />
          <span>Fajar Menyingsing — Putaran {roundNumber}</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-amber-100">
          PAGI HARI TELAH TIBA
        </h2>
        <p className="text-stone-300 text-sm">
          Semua warga desa dipersilakan membuka mata dan berkumpul di balai desa.
        </p>
      </div>

      {/* Main Casualties Card */}
      <div className="w-full bg-stone-900/80 border border-stone-700/80 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
        {hasCasualties ? (
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 animate-pulse">
              <Skull className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-red-400 font-bold">
                Kabar Duka Pagi Ini:
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-100">
                {deadPlayers.length} Warga Ditemukan Tewas
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {deadPlayers.map((player) => {
                const roleDef = ROLES[player.role];
                return (
                  <div
                    key={player.id}
                    className="p-4 rounded-2xl bg-stone-950/80 border border-red-900/50 flex items-center gap-4 text-left"
                  >
                    <RoleIcon
                      role={revealRoleOnDeath ? player.role : "VILLAGER"}
                      className="w-12 h-12 shrink-0 grayscale opacity-80"
                    />
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-base text-stone-100">
                        {player.name}
                      </h4>
                      {revealRoleOnDeath && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-800 text-amber-300 border border-stone-700">
                          {roleDef.name}
                        </span>
                      )}
                      <p className="text-[11px] text-red-400 font-medium">
                        {player.deathReason === "POISON"
                          ? "Tewas Diracun"
                          : "Dimangsa Serigala"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Malam yang Damai!
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-emerald-100">
                Tidak Ada Korban Jiwa
              </h3>
              <p className="text-xs text-stone-300 max-w-md mx-auto">
                Berkat kewaspadaan dan perlindungan yang tepat, seluruh warga desa selamat malam ini!
              </p>
            </div>
          </div>
        )}

        {/* CTA to Day Discussion */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-base tracking-wide shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
        >
          <span>MULAI DISKUSI SIANG</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
