"use client";

import React, { useState, useEffect } from "react";
import { 
  Player, 
  NightStep, 
  NightActionsState, 
  WitchPotions 
} from "@/lib/types";
import { ROLES } from "@/lib/roles";
import { RoleIcon } from "../illustrations/RoleIcon";
import { PlayerCard } from "../ui/PlayerCard";
import { Timer } from "../ui/Timer";
import { Moon, Sparkles, Eye, CheckCircle2, Skull, Shield, Heart } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface NightPhaseScreenProps {
  roundNumber: number;
  players: Player[];
  activeStepIndex: number;
  nightSteps: NightStep[];
  nightActions: NightActionsState;
  witchPotions: WitchPotions;
  durationSeconds: number;
  onSetNightAction: (action: Partial<NightActionsState>) => void;
  onAdvanceStep: () => void;
}

export function NightPhaseScreen({
  roundNumber,
  players,
  activeStepIndex,
  nightSteps,
  nightActions,
  witchPotions,
  durationSeconds,
  onSetNightAction,
  onAdvanceStep,
}: NightPhaseScreenProps) {
  const [seerResult, setSeerResult] = useState<string | null>(null);
  const [isSeerInspecting, setIsSeerInspecting] = useState(false);

  const currentStep = nightSteps[activeStepIndex];
  const alivePlayers = players.filter((p) => p.isAlive);

  useEffect(() => {
    audioEngine.startAmbient("NIGHT");
    audioEngine.playNightChime();
    setSeerResult(null);
    setIsSeerInspecting(false);
  }, [activeStepIndex]);

  const handleNextStep = () => {
    audioEngine.playTap();
    onAdvanceStep();
  };

  // 1. Seer Inspection Action
  const handleSeerSelect = (target: Player) => {
    audioEngine.playTap();
    onSetNightAction({ seerInspectedId: target.id });
    setIsSeerInspecting(true);
    if (target.role === "WEREWOLF") {
      setSeerResult(`⚠️ ${target.name} adalah SERIGALA!`);
    } else {
      setSeerResult(`🛡️ ${target.name} adalah BUKAN Serigala.`);
    }
  };

  // 2. Werewolf Attack Action
  const handleWerewolfSelect = (target: Player) => {
    audioEngine.playTap();
    onSetNightAction({ werewolfTargetId: target.id });
  };

  // 3. Doctor Heal Action
  const handleDoctorSelect = (target: Player) => {
    audioEngine.playTap();
    onSetNightAction({ doctorTargetId: target.id });
  };

  // 4. Bodyguard Protect Action
  const handleBodyguardSelect = (target: Player) => {
    audioEngine.playTap();
    onSetNightAction({ bodyguardTargetId: target.id });
  };

  // 5. Witch Actions
  const handleWitchHealToggle = () => {
    audioEngine.playTap();
    if (witchPotions.healUsed) return;
    if (nightActions.witchHealTargetId) {
      onSetNightAction({ witchHealTargetId: null });
    } else if (nightActions.werewolfTargetId) {
      onSetNightAction({ witchHealTargetId: nightActions.werewolfTargetId });
    }
  };

  const handleWitchPoisonSelect = (targetId: string | null) => {
    audioEngine.playTap();
    if (witchPotions.poisonUsed) return;
    onSetNightAction({ witchPoisonTargetId: targetId });
  };

  const werewolfTargetPlayer = players.find(
    (p) => p.id === nightActions.werewolfTargetId
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Night Sky Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Moon className="w-3.5 h-3.5 fill-indigo-400" />
          <span>Fase Malam — Putaran {roundNumber}</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-indigo-100 flex items-center justify-center gap-3">
          <span>MALAM TELAH TIBA</span>
        </h2>
        <p className="text-indigo-200/70 text-xs sm:text-sm">
          Semua pemain wajib memejamkan mata. Hanya peran yang dipanggil yang boleh membuka mata dan beraksi.
        </p>
      </div>

      {/* Role Action Container */}
      <div className="bg-slate-900/90 border-2 border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-indigo-950 pb-4">
          <div className="flex items-center gap-3">
            {currentStep && <RoleIcon role={currentStep} className="w-10 h-10" />}
            <div>
              <span className="text-xs text-indigo-400 uppercase font-semibold tracking-wider">
                Giliran Peran:
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-200">
                {currentStep ? ROLES[currentStep].name : "Malam Selesai"}
              </h3>
            </div>
          </div>

          <Timer
            durationSeconds={durationSeconds}
            isRunning={true}
            onComplete={handleNextStep}
            className="scale-75 sm:scale-90"
          />
        </div>

        {/* Step Specific Action Screens */}
        {currentStep === "SEER" && (
          <div className="space-y-4">
            <p className="text-sm text-stone-300 text-center">
              Pilih 1 pemain yang ingin diterawang identitasnya:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {alivePlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isSelected={nightActions.seerInspectedId === player.id}
                  onSelect={() => handleSeerSelect(player)}
                />
              ))}
            </div>

            {/* Inspection Reveal Popup */}
            {seerResult && (
              <div className="p-4 bg-indigo-950/90 border border-cyan-500/60 rounded-2xl text-center space-y-2 animate-bounce">
                <span className="text-xs text-cyan-300 font-semibold uppercase">Hasil Penerawangan:</span>
                <p className="font-serif text-lg font-bold text-cyan-100">{seerResult}</p>
              </div>
            )}
          </div>
        )}

        {currentStep === "WEREWOLF" && (
          <div className="space-y-4">
            <p className="text-sm text-red-300 text-center">
              Kawanan Serigala, tentukan 1 mangsa malam ini:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {alivePlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isSelected={nightActions.werewolfTargetId === player.id}
                  onSelect={() => handleWerewolfSelect(player)}
                  badgeText={nightActions.werewolfTargetId === player.id ? "TARGET" : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {currentStep === "DOCTOR" && (
          <div className="space-y-4">
            <p className="text-sm text-emerald-300 text-center">
              Dokter, pilih 1 pemain untuk diobati & diselamatkan:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {alivePlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isSelected={nightActions.doctorTargetId === player.id}
                  onSelect={() => handleDoctorSelect(player)}
                  badgeText={nightActions.doctorTargetId === player.id ? "DISEMBUHKAN" : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {currentStep === "BODYGUARD" && (
          <div className="space-y-4">
            <p className="text-sm text-blue-300 text-center">
              Bodyguard, pilih 1 pemain untuk dilindungi malam ini:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {alivePlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isSelected={nightActions.bodyguardTargetId === player.id}
                  onSelect={() => handleBodyguardSelect(player)}
                  badgeText={nightActions.bodyguardTargetId === player.id ? "DILINDUNGI" : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {currentStep === "WITCH" && (
          <div className="space-y-6">
            {/* Werewolf Victim Intel */}
            <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 text-center space-y-1">
              <span className="text-xs text-stone-400 font-medium uppercase">Korban Serigala Malam Ini:</span>
              <p className="text-base font-serif font-bold text-red-400">
                {werewolfTargetPlayer
                  ? werewolfTargetPlayer.name
                  : "Tidak ada korban yang diserang"}
              </p>
            </div>

            {/* Witch Potion Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Heal Potion */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-300 font-semibold text-sm">
                  <Heart className="w-4 h-4" />
                  <span>Ramuan Penyembuh</span>
                </div>
                <p className="text-xs text-stone-300">
                  {witchPotions.healUsed
                    ? "Ramuan sudah habis terpakai."
                    : "Selamatkan korban serigala malam ini."}
                </p>
                <button
                  type="button"
                  disabled={witchPotions.healUsed || !werewolfTargetPlayer}
                  onClick={handleWitchHealToggle}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all ${
                    nightActions.witchHealTargetId
                      ? "bg-emerald-500 text-stone-950 shadow-md"
                      : "bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/40"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {nightActions.witchHealTargetId ? "BATALKAN SEMBUH" : "GUNAKAN RAMUAN SEMBUH"}
                </button>
              </div>

              {/* Poison Potion */}
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-purple-300 font-semibold text-sm">
                  <Skull className="w-4 h-4" />
                  <span>Ramuan Racun</span>
                </div>
                <p className="text-xs text-stone-300">
                  {witchPotions.poisonUsed
                    ? "Ramuan racun sudah habis."
                    : "Pilih 1 pemain untuk dibunuh."}
                </p>
                <select
                  disabled={witchPotions.poisonUsed}
                  value={nightActions.witchPoisonTargetId || ""}
                  onChange={(e) => handleWitchPoisonSelect(e.target.value || null)}
                  className="w-full bg-stone-950 border border-purple-500/50 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-purple-400 disabled:opacity-40"
                >
                  <option value="">-- Tidak Menggunakan Racun --</option>
                  {alivePlayers.map((p) => (
                    <option key={p.id} value={p.id}>
                      Racuni: {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Advance Button */}
        <div className="pt-4 border-t border-indigo-950 flex justify-end">
          <button
            type="button"
            onClick={handleNextStep}
            className="w-full sm:w-auto py-3 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-serif font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {activeStepIndex < nightSteps.length - 1
                ? "SELESAI & PANGGIL PERAN BERIKUTNYA"
                : "SELESAIKAN MALAM & SAMBUT PAGI"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
