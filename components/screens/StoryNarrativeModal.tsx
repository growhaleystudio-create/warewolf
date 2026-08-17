"use client";

import React, { useState, useEffect } from "react";
import { audioEngine } from "@/lib/audioEngine";
import { Moon, Sun, Sparkles, Skull, Trophy, ArrowRight, ShieldCheck, Flame } from "lucide-react";

interface StoryNarrativeModalProps {
  type: "PROLOGUE" | "EPILOGUE";
  winner?: "VILLAGE" | "WEREWOLF" | "JESTER" | null;
  isOpen: boolean;
  onContinue: () => void;
  isHost?: boolean;
}

export function StoryNarrativeModal({
  type,
  winner,
  isOpen,
  onContinue,
  isHost = false,
}: StoryNarrativeModalProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (type === "PROLOGUE") {
        audioEngine.playHeartbeat();
      } else {
        audioEngine.playVictory();
      }
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  // PROLOGUE DATA
  if (type === "PROLOGUE") {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn">
        <div className="w-full max-w-lg bg-gradient-to-b from-stone-900 via-indigo-950/80 to-stone-950 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-indigo-950/90 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-xl animate-pulse">
            <Moon className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Prolog Kisah Desa</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-100 tracking-tight">
              Misteri di Lembah Bayang
            </h2>
          </div>

          {/* Narrative Text */}
          <div className="p-4 sm:p-5 bg-stone-950/80 rounded-2xl border border-indigo-900/60 text-stone-200 text-xs sm:text-sm leading-relaxed text-left space-y-3 font-serif">
            <p>
              Kabut pekat turun dari puncak bukit terlarang, menyelimuti desa yang selama berabad-abad hidup tenteram.
            </p>
            <p className="text-amber-200 font-semibold">
              Namun malam ini, lolongan mengerikan memecah keheningan. Makhluk buas berwujud manusia telah menyusup ke tengah-tengah warga.
            </p>
            <p className="text-indigo-200">
              Siapakah yang bisa dipercaya? Pejamkan mata kalian wahai penduduk desa... dan bersiaplah menyambut malam pertama!
            </p>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => {
              audioEngine.playTap();
              onContinue();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-serif font-bold text-sm tracking-wide shadow-xl shadow-indigo-500/30 border border-indigo-400/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <span>🌙 Masuki Malam Pertama</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // EPILOGUE DATA
  const isVillageWin = winner === "VILLAGE";
  const isWerewolfWin = winner === "WEREWOLF";
  const isJesterWin = winner === "JESTER";

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn">
      <div
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden border-2 ${
          isVillageWin
            ? "bg-gradient-to-b from-stone-900 via-emerald-950/90 to-stone-950 border-emerald-500/60 shadow-emerald-950/60"
            : isWerewolfWin
            ? "bg-gradient-to-b from-stone-900 via-red-950/90 to-stone-950 border-red-500/60 shadow-red-950/60"
            : "bg-gradient-to-b from-stone-900 via-fuchsia-950/90 to-stone-950 border-fuchsia-500/60 shadow-fuchsia-950/60"
        }`}
      >
        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isVillageWin ? "bg-emerald-500/20" : isWerewolfWin ? "bg-red-500/20" : "bg-fuchsia-500/20"
          }`}
        />

        {/* Victory Icon */}
        <div
          className={`w-20 h-20 mx-auto rounded-full border flex items-center justify-center shadow-xl animate-bounce ${
            isVillageWin
              ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
              : isWerewolfWin
              ? "bg-red-950 text-red-300 border-red-500/40"
              : "bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500/40"
          }`}
        >
          {isVillageWin ? (
            <Sun className="w-10 h-10" />
          ) : isWerewolfWin ? (
            <Skull className="w-10 h-10" />
          ) : (
            <Trophy className="w-10 h-10" />
          )}
        </div>

        <div className="space-y-1.5">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              isVillageWin
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                : isWerewolfWin
                ? "bg-red-500/20 text-red-300 border-red-400/30"
                : "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Epilog Akhir Permainan</span>
          </div>

          <h2
            className={`font-serif text-2xl sm:text-3xl font-black tracking-tight ${
              isVillageWin ? "text-emerald-200" : isWerewolfWin ? "text-red-200" : "text-fuchsia-200"
            }`}
          >
            {isVillageWin
              ? "FAJAR KEMENANGAN DESA"
              : isWerewolfWin
              ? "MALAM ABADI SERIGALA"
              : "TAWA KEMATIAN PELAWAK"}
          </h2>
        </div>

        {/* Narrative Box */}
        <div className="p-4 sm:p-5 bg-stone-950/85 rounded-2xl border border-stone-800 text-stone-200 text-xs sm:text-sm leading-relaxed text-left space-y-3 font-serif">
          {isVillageWin && (
            <>
              <p>
                Sinar fajar keemasan akhirnya menembus kabut kelam. Seluruh kawanan serigala pemangsa telah berhasil dihabisi.
              </p>
              <p className="text-emerald-300 font-semibold">
                Warga desa yang bertahan menyalakan api unggun di alun-alun, merayakan keselamatan desa dan mengenang para pejuang yang gugur.
              </p>
              <p className="text-stone-400 text-xs italic">
                Kedamaian telah kembali ke lembah... hingga bulan purnama berikutnya tiba.
              </p>
            </>
          )}

          {isWerewolfWin && (
            <>
              <p>
                Tiada lagi yang tersisa untuk melawan. Darah membasahi jalanan desa saat kawanan serigala menanggalkan penyamarannya.
              </p>
              <p className="text-red-300 font-semibold">
                Lolongan kemenangan memekakkan telinga bergema menembus langit malam. Lembah ini kini sepenuhnya menjadi wilayah perburuan serigala.
              </p>
              <p className="text-stone-400 text-xs italic">
                Malam abadi telah menelan desa untuk selamanya...
              </p>
            </>
          )}

          {isJesterWin && (
            <>
              <p>
                Tawa terbahak-bahak memecah keheningan saat tali gantungan terjerat. Semua warga terdiam menyadari kebodohan mereka.
              </p>
              <p className="text-fuchsia-300 font-semibold">
                Sang Pelawak berhasil memperdaya semua orang dan menuntaskan tipu daya terhebatnya!
              </p>
              <p className="text-stone-400 text-xs italic">
                Kematiannya adalah lelucon terbesar yang memenangkan permainannya sendiri.
              </p>
            </>
          )}
        </div>

        {/* Action Button to Reveal Roles */}
        <button
          type="button"
          onClick={() => {
            audioEngine.playBell();
            onContinue();
          }}
          className={`w-full py-4 px-6 rounded-2xl font-serif font-bold text-sm tracking-wide shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 ${
            isVillageWin
              ? "bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/25"
              : isWerewolfWin
              ? "bg-red-600 hover:bg-red-500 text-white shadow-red-500/25"
              : "bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-500/25"
          }`}
        >
          <span>📜 Buka Rekapitulasi & Identitas Seluruh Peran</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
