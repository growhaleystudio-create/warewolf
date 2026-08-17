"use client";

import React, { useState } from "react";
import { RoleId, GameSettings } from "@/lib/types";
import { ROLES, getRecommendedRoles } from "@/lib/roles";
import { RoleIcon } from "../illustrations/RoleIcon";
import { RoleGuideModal } from "../ui/RoleGuideModal";
import { 
  Users, 
  Sparkles, 
  LogIn, 
  PlusCircle, 
  Copy, 
  Check, 
  Play, 
  ShieldCheck, 
  Crown,
  BookOpen,
  Bot,
  Gamepad2
} from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface LobbyAuthScreenProps {
  roomCode: string | null;
  playerId: string | null;
  isHost: boolean;
  playersInRoom: Array<{ id: string; name: string; isHost: boolean }>;
  onCreateRoom: (hostName: string, settings: GameSettings, selectedRoles: RoleId[]) => void;
  onJoinRoom: (roomCode: string, playerName: string) => void;
  onStartGame: () => void;
  onStartSoloGame?: (playerName: string) => void;
  onAddBot?: () => void;
  onLeaveRoom?: () => void;
}

export function LobbyAuthScreen({
  roomCode,
  playerId,
  isHost,
  playersInRoom,
  onCreateRoom,
  onJoinRoom,
  onStartGame,
  onStartSoloGame,
  onAddBot,
  onLeaveRoom,
}: LobbyAuthScreenProps) {
  const [tab, setTab] = useState<"JOIN" | "CREATE">("JOIN");
  const [playerName, setPlayerName] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [showRoleGuide, setShowRoleGuide] = useState(false);

  // Settings for Create Mode
  const [dayDuration, setDayDuration] = useState<number>(180);
  const [nightDuration, setNightDuration] = useState<number>(15);
  const [revealRoleOnDeath, setRevealRoleOnDeath] = useState<boolean>(true);
  const [selectedRoles, setSelectedRoles] = useState<RoleId[]>(getRecommendedRoles(7));

  const handleCopyLink = () => {
    if (!roomCode) return;
    audioEngine.playTap();
    const url = `${window.location.origin}/?room=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim() || !playerName.trim()) return;
    audioEngine.playTap();
    onJoinRoom(inputCode.toUpperCase().trim(), playerName.trim());
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    audioEngine.playBell();
    onCreateRoom(
      playerName.trim(),
      {
        dayDiscussionDurationSec: dayDuration,
        nightActionDurationSec: nightDuration,
        revealRoleOnDeath,
        allowDoctorSelfHealConsecutive: false,
        soundEnabled: true,
      },
      selectedRoles
    );
  };

  const handleSoloClick = () => {
    audioEngine.playBell();
    if (onStartSoloGame) {
      onStartSoloGame(playerName.trim() || "Pemain Utama");
    }
  };

  const toggleSpecialRole = (roleId: RoleId) => {
    audioEngine.playTap();
    if (roleId === "WEREWOLF" || roleId === "VILLAGER") return;

    setSelectedRoles((prev) => {
      const exists = prev.includes(roleId);
      if (exists) {
        return prev.filter((r) => r !== roleId).concat("VILLAGER");
      } else {
        const villagerIdx = prev.indexOf("VILLAGER");
        if (villagerIdx !== -1) {
          const next = [...prev];
          next.splice(villagerIdx, 1, roleId);
          return next;
        }
        return [...prev, roleId];
      }
    });
  };

  const specialRolesList: RoleId[] = ["SEER", "DOCTOR", "BODYGUARD", "WITCH", "HUNTER", "JESTER"];

  // If already in a Room Lobby
  if (roomCode && playerId) {
    const isReadyToStart = playersInRoom.length >= 5;

    return (
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
        {/* Lobby Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ruang Tunggu Permainan</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-100">
            LOBBY DESA
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm">
            Bagikan kode ruangan kepada teman-teman Anda atau tambahkan Bot AI untuk tes sendiri!
          </p>
        </div>

        {/* Room Code Card */}
        <div className="bg-stone-900/90 border-2 border-amber-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl backdrop-blur-md">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Kode Ruangan (Room Code):
          </span>
          <div className="font-mono text-4xl sm:text-5xl font-black tracking-widest text-amber-200 bg-stone-950/80 py-3 px-6 rounded-2xl border border-amber-500/30 inline-block shadow-inner">
            {roomCode}
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Tautan Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Tautan Game</span>
                </>
              )}
            </button>

            {isHost && onAddBot && (
              <button
                type="button"
                disabled={playersInRoom.length >= 16}
                onClick={() => {
                  audioEngine.playTap();
                  onAddBot();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition-all active:scale-95 disabled:opacity-40"
              >
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>+ Tambah Bot AI (Solo Test)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                audioEngine.playTap();
                setShowRoleGuide(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 text-xs font-semibold transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Panduan Peran</span>
            </button>
          </div>
        </div>

        {/* Joined Players List */}
        <div className="bg-stone-900/80 border border-stone-700/80 rounded-3xl p-6 space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Pemain yang Telah Masuk ({playersInRoom.length}/16)
            </span>
            {!isReadyToStart && (
              <span className="text-[11px] text-amber-400/80 font-medium">
                (Butuh min. 5 pemain — klik Tambah Bot jika main sendiri)
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
            {playersInRoom.map((p, idx) => (
              <div
                key={p.id}
                className="p-3 bg-stone-950/80 rounded-2xl border border-stone-800 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center text-[10px] font-bold text-amber-400">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-stone-100 truncate">
                    {p.name}
                  </span>
                </div>
                {p.isHost && (
                  <span title="Host">
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3 pt-2">
          {isHost ? (
            <button
              type="button"
              disabled={!isReadyToStart}
              onClick={() => {
                audioEngine.playBell();
                onStartGame();
              }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 text-stone-950 font-serif font-bold text-base tracking-wide shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>
                {isReadyToStart
                  ? "MULAI PERMAIKAN SEKARANG"
                  : `MENUNGGU PEMAIN (${playersInRoom.length}/5)`}
              </span>
            </button>
          ) : (
            <div className="p-4 bg-stone-900/80 border border-stone-800 rounded-2xl text-center text-xs text-amber-300 flex items-center justify-center gap-2 animate-pulse">
              <span>Menunggu Host ({playersInRoom.find((p) => p.isHost)?.name || "Host"}) memulai permainan...</span>
            </div>
          )}

          {onLeaveRoom && (
            <button
              type="button"
              onClick={onLeaveRoom}
              className="w-full py-2 text-xs text-stone-400 hover:text-stone-200 transition-colors"
            >
              Keluar dari Ruangan
            </button>
          )}
        </div>

        {/* Role Guide Modal */}
        <RoleGuideModal isOpen={showRoleGuide} onClose={() => setShowRoleGuide(false)} />
      </div>
    );
  }

  // Not in Room: Login & Join / Create Screen
  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Multiplayer & Mode Bot AI</span>
        </div>

        <div className="space-y-1">
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-amber-100 tracking-tight">
            LEMBAH BAYANG
          </h1>
          <p className="text-amber-400 font-serif text-xs sm:text-sm tracking-[0.25em] uppercase font-extrabold drop-shadow">
            Werewolf Chronicles
          </p>
        </div>
        <p className="text-stone-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Masuk dan bermain bersama teman dengan halaman dan peran rahasia di perangkat masing-masing!
        </p>

        {/* Quick 1-Click Solo vs AI Button */}
        {onStartSoloGame && (
          <div className="pt-1 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleSoloClick}
              className="w-full py-3.5 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-serif font-extrabold text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-950/60 border border-amber-400/60 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950 shrink-0" />
              <span className="whitespace-nowrap">Main Solo vs Bot AI (1-Klik Instan)</span>
            </button>
          </div>
        )}

        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              audioEngine.playTap();
              setShowRoleGuide(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pelajari Aturan & Peran</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="bg-stone-900/90 border border-stone-700/80 rounded-2xl p-1.5 flex gap-1 shadow-md w-full max-w-sm">
          <button
            type="button"
            onClick={() => {
              audioEngine.playTap();
              setTab("JOIN");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              tab === "JOIN"
                ? "bg-amber-500 text-stone-950 font-bold shadow-md"
                : "text-stone-300 hover:text-white"
            }`}
          >
            <LogIn className="w-3.5 h-3.5 shrink-0" />
            <span>Gabung Ruang</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioEngine.playTap();
              setTab("CREATE");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              tab === "CREATE"
                ? "bg-amber-500 text-stone-950 font-bold shadow-md"
                : "text-stone-300 hover:text-white"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Buat Ruang (Host)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Join Room Form */}
      {tab === "JOIN" && (
        <form
          onSubmit={handleJoinSubmit}
          className="bg-stone-900/80 border border-stone-700/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-md"
        >
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-200">Nama Anda:</label>
            <input
              type="text"
              required
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Contoh: Budi, Sarah, Andi"
              className="w-full bg-stone-950/90 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-200">Kode Ruangan (4 Huruf):</label>
            <input
              type="text"
              required
              maxLength={6}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Contoh: ABCD"
              className="w-full font-mono text-center uppercase tracking-widest text-lg font-bold bg-stone-950/90 border border-stone-700 rounded-xl px-4 py-3 text-amber-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>MASUK KE RUANGAN</span>
          </button>
        </form>
      )}

      {/* Tab 2: Create Room Form */}
      {tab === "CREATE" && (
        <form
          onSubmit={handleCreateSubmit}
          className="bg-stone-900/80 border border-stone-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md"
        >
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-200">Nama Anda (Host):</label>
            <input
              type="text"
              required
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Contoh: Raja Desa"
              className="w-full bg-stone-950/90 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Special Roles Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Pilihan Peran Khusus:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {specialRolesList.map((roleId) => {
                const roleDef = ROLES[roleId];
                const isSelected = selectedRoles.includes(roleId);
                return (
                  <button
                    key={roleId}
                    type="button"
                    onClick={() => toggleSpecialRole(roleId)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-400 text-amber-200"
                        : "bg-stone-950/40 border-stone-800 text-stone-400"
                    }`}
                  >
                    <RoleIcon role={roleId} className="w-6 h-6 shrink-0" />
                    <div className="truncate">
                      <div className="text-[11px] font-semibold truncate">{roleDef.name}</div>
                      <div className="text-[9px] text-stone-400">{isSelected ? "Aktif" : "Mati"}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timer Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-stone-300">Diskusi Siang:</label>
              <select
                value={dayDuration}
                onChange={(e) => setDayDuration(parseInt(e.target.value))}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value={60}>60 detik</option>
                <option value={120}>120 detik</option>
                <option value={180}>180 detik (Default)</option>
                <option value={300}>300 detik</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-stone-300">Aksi Malam:</label>
              <select
                value={nightDuration}
                onChange={(e) => setNightDuration(parseInt(e.target.value))}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value={10}>10 detik</option>
                <option value={15}>15 detik (Default)</option>
                <option value={25}>25 detik</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>BUAT RUANGAN & DAPATKAN KODE</span>
          </button>
        </form>
      )}

      {/* Role Guide Modal */}
      <RoleGuideModal isOpen={showRoleGuide} onClose={() => setShowRoleGuide(false)} />
    </div>
  );
}
