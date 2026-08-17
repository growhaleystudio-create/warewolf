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
        <div className="w-full max-w-lg bg-gradient-to-b from-stone-900 via-amber-950/60 to-stone-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-950/90 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-xl animate-pulse">
            <Moon className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Prolog Kisah Desa</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-100 tracking-tight">
              Misteri di Lembah Bayang
            </h2>
          </div>

          {/* Narrative Text */}
          <div className="p-4 sm:p-5 bg-stone-950/85 rounded-2xl border border-stone-800 text-stone-200 text-xs sm:text-sm leading-relaxed text-left space-y-3 font-serif">
            <p>
              Kabut pekat turun dari puncak bukit terlarang, menyelimuti desa yang selama berabad-abad hidup tenteram.
            </p>
            <p className="text-amber-300 font-semibold">
              Namun malam ini, lolongan mengerikan memecah keheningan. Makhluk buas berwujud manusia telah menyusup ke tengah-tengah warga.
            </p>
            <p className="text-stone-300">
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
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-serif font-black text-sm tracking-wide shadow-xl shadow-amber-950/60 border border-amber-400/60 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
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
            ? "bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 border-amber-500/60 shadow-amber-950/60"
            : isWerewolfWin
            ? "bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 border-amber-600/60 shadow-stone-950/60"
            : "bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 border-amber-500/60 shadow-amber-950/60"
        }`}
      >
        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isVillageWin ? "bg-amber-500/20" : isWerewolfWin ? "bg-amber-700/20" : "bg-amber-600/20"
          }`}
        />

        {/* Victory Icon */}
        <div
          className={`w-20 h-20 mx-auto rounded-full border flex items-center justify-center shadow-xl animate-bounce ${
            isVillageWin
              ? "bg-amber-950 text-amber-300 border-amber-500/40"
              : isWerewolfWin
              ? "bg-stone-900 text-amber-400 border-amber-600/40"
              : "bg-amber-950 text-amber-300 border-amber-500/40"
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
                ? "bg-amber-500/20 text-amber-300 border-amber-400/30"
                : isWerewolfWin
                ? "bg-amber-600/20 text-amber-300 border-amber-500/30"
                : "bg-amber-500/20 text-amber-300 border-amber-400/30"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Epilog Akhir Permainan</span>
          </div>

          <h2
            className={`font-serif text-2xl sm:text-3xl font-black tracking-tight ${
              isVillageWin ? "text-amber-200" : isWerewolfWin ? "text-amber-100" : "text-amber-200"
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
              <p className="text-amber-300 font-semibold">
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
              <p className="text-amber-300 font-semibold">
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
              <p className="text-amber-300 font-semibold">
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
          className="w-full py-4 px-6 rounded-2xl font-serif font-black text-sm tracking-wide shadow-xl bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 border border-amber-400/60"
        >
          <span>📜 Buka Rekapitulasi & Identitas Seluruh Peran</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
