"use client";

import React, { useState, useEffect } from "react";
import { RoleId, GameSettings } from "@/lib/types";
import { ROLES, getRecommendedRoles } from "@/lib/roles";
import { RoleIcon } from "../illustrations/RoleIcon";
import { Users, Sparkles, Clock, Volume2, ShieldCheck, Play } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface SetupScreenProps {
  onStartGame: (playerNames: string[], selectedRoles: RoleId[], settings: GameSettings) => void;
}

export function SetupScreen({ onStartGame }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState<number>(7);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<RoleId[]>([]);
  const [dayDuration, setDayDuration] = useState<number>(180);
  const [nightDuration, setNightDuration] = useState<number>(15);
  const [revealRoleOnDeath, setRevealRoleOnDeath] = useState<boolean>(true);
  const [allowDoctorSelfHealConsecutive, setAllowDoctorSelfHealConsecutive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Inisialisasi daftar pemain dan rekomendasi peran saat jumlah pemain berubah
  useEffect(() => {
    setPlayerNames((prev) => {
      const updated = [...prev];
      while (updated.length < playerCount) {
        updated.push(`Pemain ${updated.length + 1}`);
      }
      return updated.slice(0, playerCount);
    });

    const recommended = getRecommendedRoles(playerCount);
    setSelectedRoles(recommended);
  }, [playerCount]);

  const handleNameChange = (index: number, newName: string) => {
    const updated = [...playerNames];
    updated[index] = newName;
    setPlayerNames(updated);
  };

  const toggleSpecialRole = (roleId: RoleId) => {
    audioEngine.playTap();
    if (roleId === "WEREWOLF" || roleId === "VILLAGER") return;

    setSelectedRoles((prev) => {
      const exists = prev.includes(roleId);
      let updated: RoleId[];
      if (exists) {
        // Ganti dengan Villager
        updated = prev.filter((r) => r !== roleId);
        updated.push("VILLAGER");
      } else {
        // Ganti 1 Villager dengan Role ini
        const villagerIndex = prev.indexOf("VILLAGER");
        if (villagerIndex !== -1) {
          updated = [...prev];
          updated.splice(villagerIndex, 1, roleId);
        } else {
          updated = [...prev, roleId].slice(0, playerCount);
        }
      }
      return updated;
    });
  };

  const handleStart = () => {
    audioEngine.playBell();
    onStartGame(playerNames, selectedRoles, {
      dayDiscussionDurationSec: dayDuration,
      nightActionDurationSec: nightDuration,
      revealRoleOnDeath,
      allowDoctorSelfHealConsecutive,
      soundEnabled,
    });
  };

  const werewolfCount = selectedRoles.filter((r) => r === "WEREWOLF").length;
  const specialRolesList: RoleId[] = ["SEER", "DOCTOR", "BODYGUARD", "WITCH", "HUNTER", "JESTER"];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Auto-Moderator Papan Permainan
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-amber-100 tracking-wide">
          WEREWOLF DESA
        </h1>
        <p className="text-stone-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Moderator digital satu layar untuk bermain bersama teman. Bagikan layar secara bergiliran tanpa ada pemain yang harus mengalah jadi narator.
        </p>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Player Count & Names */}
        <div className="bg-stone-900/70 border border-stone-700/60 rounded-2xl p-5 space-y-5 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2 text-amber-200 font-semibold">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Jumlah Pemain ({playerCount})</span>
            </div>
            <span className="text-xs text-stone-400">Rentang: 5 - 16</span>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="5"
              max="16"
              value={playerCount}
              onChange={(e) => setPlayerCount(parseInt(e.target.value))}
              className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-mono">
              <span>5 Pemain</span>
              <span>10 Pemain</span>
              <span>16 Pemain</span>
            </div>
          </div>

          {/* Player Names List */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-stone-300">Nama Pemain (Dapat Diubah):</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {playerNames.map((name, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  placeholder={`Pemain ${idx + 1}`}
                  className="bg-stone-950/80 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              ))}
            </div>
          </div>

          {/* Faction Ratio Overview */}
          <div className="p-3 bg-stone-950/50 rounded-xl border border-stone-800 flex items-center justify-around text-xs">
            <div className="text-center">
              <div className="text-red-400 font-bold text-base">{werewolfCount}</div>
              <div className="text-stone-400 text-[11px]">Serigala</div>
            </div>
            <div className="h-6 w-px bg-stone-800" />
            <div className="text-center">
              <div className="text-emerald-400 font-bold text-base">
                {selectedRoles.filter((r) => ROLES[r].faction === "VILLAGE").length}
              </div>
              <div className="text-stone-400 text-[11px]">Warga Desa</div>
            </div>
            {selectedRoles.some((r) => r === "JESTER") && (
              <>
                <div className="h-6 w-px bg-stone-800" />
                <div className="text-center">
                  <div className="text-purple-400 font-bold text-base">1</div>
                  <div className="text-stone-400 text-[11px]">Netral</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Roles & Settings */}
        <div className="space-y-6">
          {/* Roles Selector */}
          <div className="bg-stone-900/70 border border-stone-700/60 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2 text-amber-200 font-semibold">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Pilih Peran Khusus</span>
              </div>
              <span className="text-xs text-stone-400">Klik untuk Toggle</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {specialRolesList.map((roleId) => {
                const roleDef = ROLES[roleId];
                const isSelected = selectedRoles.includes(roleId);

                return (
                  <button
                    key={roleId}
                    type="button"
                    onClick={() => toggleSpecialRole(roleId)}
                    className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm"
                        : "bg-stone-950/40 border-stone-800 text-stone-400 hover:border-stone-700"
                    }`}
                  >
                    <RoleIcon role={roleId} className="w-8 h-8 mb-1" />
                    <span className="text-xs font-semibold">{roleDef.name}</span>
                    <span className="text-[9px] text-stone-400 truncate max-w-full">
                      {isSelected ? "Aktif" : "Nonaktif"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timers & Options */}
          <div className="bg-stone-900/70 border border-stone-700/60 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-200 font-semibold pb-2 border-b border-stone-800">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Durasi & Pengaturan Timer</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-stone-300">Diskusi Siang (Detik):</label>
                <select
                  value={dayDuration}
                  onChange={(e) => setDayDuration(parseInt(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value={60}>60 detik (1 menit)</option>
                  <option value={120}>120 detik (2 menit)</option>
                  <option value={180}>180 detik (3 menit)</option>
                  <option value={300}>300 detik (5 menit)</option>
                  <option value={600}>600 detik (10 menit)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-300">Aksi Malam (Detik):</label>
                <select
                  value={nightDuration}
                  onChange={(e) => setNightDuration(parseInt(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value={10}>10 detik</option>
                  <option value={15}>15 detik (Direkomendasikan)</option>
                  <option value={25}>25 detik</option>
                  <option value={30}>30 detik</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Button CTA */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={handleStart}
          className="w-full max-w-md py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 font-serif font-bold text-lg tracking-wide shadow-xl shadow-amber-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 border border-amber-300/40"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>MULAI BAGIKAN KARTU RAHASIA</span>
        </button>
      </div>
    </div>
  );
}
