"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Player, GameLogEntry } from "@/lib/types";
import { ROLES } from "@/lib/roles";
import { RoleIcon } from "../illustrations/RoleIcon";
import { Trophy, RotateCcw, Sliders, ScrollText, Sparkles, BookOpen } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";
import { StoryNarrativeModal } from "./StoryNarrativeModal";

interface WinnerScreenProps {
  winner: "VILLAGE" | "WEREWOLF" | "JESTER";
  players: Player[];
  historyLogs: GameLogEntry[];
  onPlayAgain: (keepSettings: boolean) => void;
}

export function WinnerScreen({
  winner,
  players,
  historyLogs,
  onPlayAgain,
}: WinnerScreenProps) {
  useEffect(() => {
    audioEngine.stopAmbient();
    audioEngine.playVictory();

    // Trigger colorful confetti burst
    const end = Date.now() + 3 * 1000;
    const colors = ["#f59e0b", "#ef4444", "#10b981", "#8b5cf6"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [winner]);

  const getWinnerTitle = () => {
    switch (winner) {
      case "VILLAGE":
        return {
          title: "WARGA DESA MENANG!",
          subtitle: "Seluruh kawanan serigala berhasil dimusnahkan. Desa kembali aman dan damai!",
          badge: "🛡️ Kemenangan Warga Desa",
          color: "from-emerald-500 to-amber-500 text-emerald-300",
          border: "border-emerald-500/50",
        };
      case "WEREWOLF":
        return {
          title: "SERIGALA MENANG!",
          subtitle: "Kawanan serigala berhasil menguasai desa dan menaklukkan warga!",
          badge: "🐺 Kemenangan Serigala",
          color: "from-red-600 to-amber-600 text-red-400",
          border: "border-red-500/50",
        };
      case "JESTER":
        return {
          title: "ORANG GILA (JESTER) MENANG!",
          subtitle: "Jester berhasil memperdaya seluruh desa untuk menggantung dirinya!",
          badge: "🎭 Kemenangan Tunggal Jester",
          color: "from-purple-600 to-pink-600 text-purple-300",
          border: "border-purple-500/50",
        };
    }
  };

  const [showEpilogue, setShowEpilogue] = useState(true);
  const meta = getWinnerTitle();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-8 animate-fadeIn">
      {/* Victory Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Hasil Akhir Pertandingan</span>
        </div>

        <h1 className={`font-serif text-3xl sm:text-5xl font-black bg-gradient-to-r ${meta.color} bg-clip-text text-transparent`}>
          {meta.title}
        </h1>

        <p className="text-stone-300 text-sm sm:text-base max-w-lg mx-auto">
          {meta.subtitle}
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              audioEngine.playTap();
              setShowEpilogue(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-800/90 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all shadow-md active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 Baca Ulang Epilog Kemenangan</span>
          </button>
        </div>
      </div>

      {/* Epilogue Narrative Modal */}
      <StoryNarrativeModal
        type="EPILOGUE"
        winner={winner}
        isOpen={showEpilogue}
        onContinue={() => setShowEpilogue(false)}
      />

      {/* Full Roles Reveal Grid */}
      <div className="bg-stone-900/80 border border-stone-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-800 text-amber-200 font-semibold text-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Pengungkapan Seluruh Identitas Peran Pemain</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {players.map((player) => {
            const roleDef = ROLES[player.role];
            return (
              <div
                key={player.id}
                className={`p-4 rounded-2xl border flex flex-col items-center text-center space-y-2 ${
                  player.isAlive
                    ? "bg-stone-950/80 border-stone-700"
                    : "bg-stone-950/40 border-stone-900 opacity-70"
                }`}
              >
                <RoleIcon role={player.role} className="w-12 h-12" />
                <span className="font-bold text-sm text-stone-100">{player.name}</span>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    roleDef.faction === "WEREWOLF"
                      ? "bg-red-950/60 text-red-300 border-red-500/40"
                      : roleDef.faction === "NEUTRAL"
                      ? "bg-purple-950/60 text-purple-300 border-purple-500/40"
                      : "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                  }`}
                >
                  {roleDef.name}
                </span>
                <span className="text-[10px] text-stone-400">
                  {player.isAlive ? "✅ Selamat" : "💀 Gugur"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Timeline / History Logs */}
      {historyLogs.length > 0 && (
        <div className="bg-stone-900/80 border border-stone-700/80 rounded-3xl p-6 space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-800 text-stone-300 font-semibold text-sm">
            <ScrollText className="w-4 h-4 text-amber-400" />
            <span>Kronologi & Riwayat Permainan</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
            {historyLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 flex items-start justify-between text-xs gap-3"
              >
                <div>
                  <span className="font-bold text-amber-400 mr-2">{log.title}:</span>
                  <span className="text-stone-300">{log.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={() => {
            audioEngine.playTap();
            onPlayAgain(true);
          }}
          className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-base tracking-wide shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>MAIN LAGI (PENGATURAN SAMA)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            audioEngine.playTap();
            onPlayAgain(false);
          }}
          className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-sm border border-stone-600 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>UBAH PENGATURAN BARU</span>
        </button>
      </div>
    </div>
  );
}
