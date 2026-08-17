"use client";

import React, { useState } from "react";
import { 
  GameState, 
  Player, 
  RoleId, 
  NightActionsState,
  RoomPlayer
} from "@/lib/types";
import { ROLES } from "@/lib/roles";
import { RoleIcon } from "../illustrations/RoleIcon";
import { PlayerCard } from "../ui/PlayerCard";
import { Timer } from "../ui/Timer";
import { RoleGuideModal } from "../ui/RoleGuideModal";
import { ChatBox } from "../ui/ChatBox";
import { 
  Eye, 
  EyeOff, 
  Moon, 
  Sun, 
  Gavel, 
  Skull, 
  Shield, 
  Heart, 
  Target, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  Crown,
  RotateCcw,
  Check,
  BookOpen,
  MessageSquare
} from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface PlayerPersonalScreenProps {
  roomCode: string;
  isHost: boolean;
  myPlayer: RoomPlayer;
  gameState: GameState;
  currentActiveRole: RoleId | null;
  teammateWerewolves?: string[];
  onDispatchAction: (type: string, payload?: unknown) => void;
  onSendChatMessage: (text: string) => void;
  onRestartGame: () => void;
}

export function PlayerPersonalScreen({
  roomCode,
  isHost,
  myPlayer,
  gameState,
  currentActiveRole,
  teammateWerewolves = [],
  onDispatchAction,
  onSendChatMessage,
  onRestartGame,
}: PlayerPersonalScreenProps) {
  const [showSecretRoleModal, setShowSecretRoleModal] = useState(false);
  const [showRoleGuide, setShowRoleGuide] = useState(false);
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const [seerInspectionResult, setSeerInspectionResult] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [myVoteTargetId, setMyVoteTargetId] = useState<string | null>(null);

  const myRoleDef = ROLES[myPlayer.role];
  const isMyTurnAtNight = gameState.phase === "NIGHT" && currentActiveRole === myPlayer.role && myPlayer.isAlive;
  const alivePlayers = gameState.players.filter((p) => p.isAlive);
  const deadPlayers = gameState.players.filter((p) => !p.isAlive);

  // 1. Seer Action
  const handleSeerInspect = (target: Player) => {
    audioEngine.playTap();
    onDispatchAction("SET_NIGHT_ACTION", { seerInspectedId: target.id });
    if (target.role === "WEREWOLF") {
      setSeerInspectionResult(`⚠️ ${target.name} adalah SERIGALA!`);
    } else {
      setSeerInspectionResult(`🛡️ ${target.name} adalah BUKAN Serigala.`);
    }
  };

  // 2. Werewolf Action
  const handleWerewolfKill = (target: Player) => {
    audioEngine.playTap();
    onDispatchAction("SET_NIGHT_ACTION", { werewolfTargetId: target.id });
  };

  // 3. Doctor Action
  const handleDoctorHeal = (target: Player) => {
    audioEngine.playTap();
    onDispatchAction("SET_NIGHT_ACTION", { doctorTargetId: target.id });
  };

  // 4. Bodyguard Action
  const handleBodyguardProtect = (target: Player) => {
    audioEngine.playTap();
    onDispatchAction("SET_NIGHT_ACTION", { bodyguardTargetId: target.id });
  };

  // 5. Witch Action
  const handleWitchHealToggle = () => {
    audioEngine.playTap();
    if (gameState.witchPotions.healUsed) return;
    if (gameState.nightActions.witchHealTargetId) {
      onDispatchAction("SET_NIGHT_ACTION", { witchHealTargetId: null });
    } else if (gameState.nightActions.werewolfTargetId) {
      onDispatchAction("SET_NIGHT_ACTION", { witchHealTargetId: gameState.nightActions.werewolfTargetId });
    }
  };

  const handleWitchPoison = (targetId: string | null) => {
    audioEngine.playTap();
    if (gameState.witchPotions.poisonUsed) return;
    onDispatchAction("SET_NIGHT_ACTION", { witchPoisonTargetId: targetId });
  };

  // 6. Voting Action
  const handleCastVote = (targetPlayer: Player) => {
    audioEngine.playTap();
    setHasVoted(true);
    setMyVoteTargetId(targetPlayer.id);
    onDispatchAction("CAST_VOTE", { voterId: myPlayer.id, targetId: targetPlayer.id });
  };

  // 7. Hunter Action
  const handleHunterShoot = (targetPlayer: Player) => {
    audioEngine.playHeartbeat();
    onDispatchAction("EXECUTE_HUNTER_REVENGE", { targetId: targetPlayer.id });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Game Controller & Current Phase */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {/* Personalized Player Header Bar */}
          <div className="bg-stone-900/90 border border-stone-700/80 rounded-2xl p-3.5 flex items-center justify-between shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-10 h-10 rounded-full bg-stone-950 border border-amber-500/30 flex items-center justify-center p-1 shrink-0">
            <RoleIcon role={myPlayer.role} className="w-7 h-7" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-stone-100 truncate">{myPlayer.name}</span>
              {isHost && (
                <span title="Host">
                  <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className={myPlayer.isAlive ? "text-emerald-400 font-medium" : "text-red-400 font-bold"}>
                {myPlayer.isAlive ? "● Hidup" : "💀 Gugur"}
              </span>
              <span className="text-stone-500">•</span>
              <span className="text-stone-400 font-mono">Room: {roomCode}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons in Header */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              audioEngine.playTap();
              setShowRoleGuide(true);
            }}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-300 text-xs font-semibold transition-all active:scale-95"
            title="Buka Panduan Peran"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Panduan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioEngine.playCardFlip();
              setShowSecretRoleModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Peran Saya</span>
          </button>
        </div>
      </div>

      {/* Secret Role Peek Modal */}
      {showSecretRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-500/60 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-stone-950 border border-amber-500/40 flex items-center justify-center p-2 shadow-inner">
              <RoleIcon role={myPlayer.role} className="w-16 h-16" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-stone-400">Identitas Rahasia Anda:</span>
              <h3 className="font-serif text-2xl font-extrabold text-amber-200">{myRoleDef.name}</h3>
              <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {myRoleDef.faction === "WEREWOLF" ? "Faksi Serigala (Jahat)" : myRoleDef.faction === "NEUTRAL" ? "Faksi Netral" : "Faksi Warga Desa (Baik)"}
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/60 p-3 rounded-xl border border-stone-800">
              {myRoleDef.description}
            </p>

            {myPlayer.role === "WEREWOLF" && teammateWerewolves.length > 0 && (
              <div className="p-2.5 bg-red-950/60 rounded-xl border border-red-500/40 text-xs text-red-300">
                <span className="font-bold">Rekan Serigala: </span>
                {teammateWerewolves.join(", ")}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                audioEngine.playTap();
                setShowSecretRoleModal(false);
              }}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-xs tracking-wide shadow-md"
            >
              TUTUP & SEMBUNYIKAN
            </button>
          </div>
        </div>
      )}

      {/* PHASE 1: NIGHT PHASE */}
      {gameState.phase === "NIGHT" && (
        <div className="bg-slate-900/90 border-2 border-indigo-500/30 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl backdrop-blur-md">
          {/* Phase Header */}
          <div className="flex items-center justify-between border-b border-indigo-950 pb-3">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Fase Malam (Putaran {gameState.roundNumber})</span>
            </div>
            <Timer durationSeconds={gameState.settings.nightActionDurationSec} isRunning={true} className="scale-75" />
          </div>

          {/* If It's My Turn at Night */}
          {isMyTurnAtNight ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase">⚡ Giliran Anda Beraksi:</span>
                <h3 className="font-serif text-2xl font-extrabold text-stone-100">{myRoleDef.name}</h3>
              </div>

              {/* Seer Night View */}
              {myPlayer.role === "SEER" && (
                <div className="space-y-3">
                  <p className="text-xs text-center text-stone-300">Pilih 1 pemain untuk diterawang identitasnya:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {alivePlayers.filter((p) => p.id !== myPlayer.id).map((p) => (
                      <PlayerCard
                        key={p.id}
                        player={p}
                        isSelected={gameState.nightActions.seerInspectedId === p.id}
                        onSelect={() => handleSeerInspect(p)}
                      />
                    ))}
                  </div>
                  {seerInspectionResult && (
                    <div className="p-3 bg-cyan-950/90 border border-cyan-500/60 rounded-xl text-center text-sm font-bold text-cyan-200 animate-bounce">
                      {seerInspectionResult}
                    </div>
                  )}
                </div>
              )}

              {/* Werewolf Night View */}
              {myPlayer.role === "WEREWOLF" && (
                <div className="space-y-3">
                  <p className="text-xs text-center text-red-300">Tentukan 1 mangsa malam ini bersama kawanan:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {alivePlayers.filter((p) => p.role !== "WEREWOLF").map((p) => (
                      <PlayerCard
                        key={p.id}
                        player={p}
                        isSelected={gameState.nightActions.werewolfTargetId === p.id}
                        onSelect={() => handleWerewolfKill(p)}
                        badgeText={gameState.nightActions.werewolfTargetId === p.id ? "MANGSA" : undefined}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Doctor Night View */}
              {myPlayer.role === "DOCTOR" && (
                <div className="space-y-3">
                  <p className="text-xs text-center text-emerald-300">Pilih 1 pemain untuk diobati & diselamatkan:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {alivePlayers.map((p) => (
                      <PlayerCard
                        key={p.id}
                        player={p}
                        isSelected={gameState.nightActions.doctorTargetId === p.id}
                        onSelect={() => handleDoctorHeal(p)}
                        badgeText={gameState.nightActions.doctorTargetId === p.id ? "SEMBUH" : undefined}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Bodyguard Night View */}
              {myPlayer.role === "BODYGUARD" && (
                <div className="space-y-3">
                  <p className="text-xs text-center text-blue-300">Pilih 1 pemain lain untuk dilindungi:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {alivePlayers.filter((p) => p.id !== myPlayer.id).map((p) => (
                      <PlayerCard
                        key={p.id}
                        player={p}
                        isSelected={gameState.nightActions.bodyguardTargetId === p.id}
                        onSelect={() => handleBodyguardProtect(p)}
                        badgeText={gameState.nightActions.bodyguardTargetId === p.id ? "LINDUNGI" : undefined}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Witch Night View */}
              {myPlayer.role === "WITCH" && (
                <div className="space-y-3 text-center">
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs">
                    Korban Serigala: <span className="text-red-400 font-bold">{gameState.players.find(p => p.id === gameState.nightActions.werewolfTargetId)?.name || "Belum ada"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={gameState.witchPotions.healUsed || !gameState.nightActions.werewolfTargetId}
                      onClick={handleWitchHealToggle}
                      className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold disabled:opacity-40"
                    >
                      {gameState.nightActions.witchHealTargetId ? "Batalkan Sembuh" : "Gunakan Ramuan Sembuh"}
                    </button>
                    <select
                      disabled={gameState.witchPotions.poisonUsed}
                      value={gameState.nightActions.witchPoisonTargetId || ""}
                      onChange={(e) => handleWitchPoison(e.target.value || null)}
                      className="bg-stone-950 border border-purple-500/50 rounded-xl p-2 text-xs text-stone-200 disabled:opacity-40"
                    >
                      <option value="">-- Opsi Racun --</option>
                      {alivePlayers.map((p) => (
                        <option key={p.id} value={p.id}>Racuni: {p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Not My Turn: Atmospheric Sleep Screen */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-300 animate-pulse">
                <Moon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-indigo-100">Mata Terpejam...</h3>
                <p className="text-xs text-indigo-300/70 max-w-xs mx-auto">
                  Malam sedang berlangsung. Tunggu giliran peran Anda dipanggil.
                </p>
              </div>
            </div>
          )}

          {/* Host Next Step Controller */}
          {isHost && (
            <div className="pt-3 border-t border-indigo-950 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  audioEngine.playTap();
                  onDispatchAction("ADVANCE_NIGHT_STEP");
                }}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-serif font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Lanjut ke Peran Berikutnya / Sambut Pagi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* PHASE 2: MORNING REVEAL */}
      {gameState.phase === "MORNING_REVEAL" && (
        <div className="bg-stone-900/90 border border-stone-700/80 rounded-3xl p-6 text-center space-y-5 shadow-2xl backdrop-blur-md animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Pengumuman Pagi Hari</span>
          </div>

          {gameState.morningDeaths.length > 0 ? (
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 animate-pulse">
                <Skull className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-extrabold text-stone-100">
                {gameState.morningDeaths.length} Warga Ditemukan Gugur
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {gameState.players.filter((p) => gameState.morningDeaths.includes(p.id)).map((p) => (
                  <div key={p.id} className="p-3 bg-stone-950 rounded-xl border border-red-900/50 text-xs font-bold text-red-300">
                    💀 {p.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2 py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-extrabold text-emerald-300">Malam Berlangsung Damai!</h3>
              <p className="text-xs text-stone-300">Seluruh warga desa selamat malam ini.</p>
            </div>
          )}

          {isHost ? (
            <button
              type="button"
              onClick={() => {
                audioEngine.playTap();
                onDispatchAction("PROCEED_TO_DAY_DISCUSSION");
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-sm shadow-md"
            >
              MULAI DISKUSI SIANG
            </button>
          ) : (
            <p className="text-xs text-stone-400 animate-pulse">Menunggu Host memulai diskusi...</p>
          )}
        </div>
      )}

      {/* PHASE 3: DAY DISCUSSION */}
      {gameState.phase === "DAY_DISCUSSION" && (
        <div className="bg-stone-900/90 border border-stone-700/80 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl backdrop-blur-md animate-fadeIn">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase">
              <Sun className="w-3.5 h-3.5" />
              <span>Musyawarah Siang</span>
            </div>
            <h3 className="font-serif text-2xl font-extrabold text-stone-100">Diskusikan & Cari Serigala!</h3>
          </div>

          <div className="flex justify-center">
            <Timer durationSeconds={gameState.settings.dayDiscussionDurationSec} isRunning={true} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-stone-300 uppercase">Warga Hidup ({alivePlayers.length}):</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {alivePlayers.map((p) => (
                <PlayerCard key={p.id} player={p} />
              ))}
            </div>
          </div>

          {/* Mobile Only: Embedded Interactive Village Chat Box in Day Discussion */}
          <div className="pt-2 lg:hidden">
            <ChatBox
              messages={gameState.chatMessages || []}
              currentUserId={myPlayer.id}
              currentUserName={myPlayer.name}
              onSendMessage={onSendChatMessage}
            />
          </div>

          {isHost && (
            <button
              type="button"
              onClick={() => {
                audioEngine.playBell();
                onDispatchAction("START_VOTING");
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-sm shadow-md"
            >
              MULAI PEMUNGUTAN SUARA (VOTING)
            </button>
          )}
        </div>
      )}

      {/* PHASE 4: VOTING */}
      {gameState.phase === "VOTING" && (
        <div className="bg-stone-900/90 border border-stone-700/80 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl backdrop-blur-md animate-fadeIn">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 text-red-400 text-xs font-bold uppercase">
              <Gavel className="w-3.5 h-3.5" />
              <span>Kotak Suara Rahasia di HP Anda</span>
            </div>
            <h3 className="font-serif text-2xl font-extrabold text-stone-100">Pilih Siapa yang Ingin Digantung:</h3>
          </div>

          {!hasVoted ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {alivePlayers.filter((p) => p.id !== myPlayer.id).map((p) => (
                <PlayerCard
                  key={p.id}
                  player={p}
                  onSelect={() => handleCastVote(p)}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 bg-stone-950/80 rounded-2xl border border-emerald-500/40 text-center space-y-2">
              <Check className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-stone-100 text-sm">Suara Anda Telah Masuk!</h4>
              <p className="text-xs text-stone-400">
                Pilihan Anda: <span className="text-amber-300 font-bold">{gameState.players.find(p => p.id === myVoteTargetId)?.name}</span>
              </p>
            </div>
          )}

          {isHost && (
            <button
              type="button"
              onClick={() => {
                audioEngine.playBell();
                onDispatchAction("RESOLVE_VOTING");
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-serif font-bold text-sm shadow-md"
            >
              SELESAIKAN & HITUNG HASIL SUARA
            </button>
          )}
        </div>
      )}

      {/* PHASE 5: HUNTER REVENGE */}
      {gameState.phase === "HUNTER_REVENGE" && (
        <div className="bg-stone-900/90 border-2 border-red-500/60 rounded-3xl p-6 text-center space-y-5 shadow-2xl backdrop-blur-md animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-950 border border-red-500/40 flex items-center justify-center p-2">
            <RoleIcon role="HUNTER" className="w-10 h-10" />
          </div>

          {myPlayer.role === "HUNTER" ? (
            <div className="space-y-3">
              <h3 className="font-serif text-2xl font-extrabold text-red-300">Lepaskan Tembakan Terakhir Anda!</h3>
              <p className="text-xs text-stone-300">Pilih 1 pemain untuk ditembak mati sebelum gugur:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {alivePlayers.filter((p) => p.id !== myPlayer.id).map((p) => (
                  <PlayerCard key={p.id} player={p} onSelect={() => handleHunterShoot(p)} />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-red-300">Pemburu Sedang Membidik...</h3>
              <p className="text-xs text-stone-300">Tunggu tembakan terakhir pemburu sebelum melanjutkan.</p>
            </div>
          )}
        </div>
      )}

      {/* PHASE 6: WINNER */}
      {gameState.phase === "WINNER" && gameState.winner && (
        <div className="bg-stone-900/90 border border-stone-700/80 rounded-3xl p-6 text-center space-y-6 shadow-2xl backdrop-blur-md animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="font-serif text-3xl font-black text-amber-200">
            {gameState.winner === "VILLAGE" ? "WARGA DESA MENANG!" : gameState.winner === "WEREWOLF" ? "SERIGALA MENANG!" : "JESTER MENANG!"}
          </h2>

          {/* Reveal All Roles */}
          <div className="space-y-2 text-left">
            <span className="text-xs font-semibold text-stone-300 uppercase">Peran Seluruh Pemain:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {gameState.players.map((p) => (
                <div key={p.id} className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs">
                  <div className="font-bold text-stone-100">{p.name}</div>
                  <div className="text-amber-300 font-semibold">{ROLES[p.role].name}</div>
                </div>
              ))}
            </div>
          </div>

          {isHost && (
            <button
              type="button"
              onClick={onRestartGame}
              className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-sm shadow-md"
            >
              MAIN LAGI DI RUANGAN INI
            </button>
          )}
        </div>
      )}
        </div>

        {/* Right Column: Persistent Desktop Village Chat & AI Debates */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-6">
          <ChatBox
            className="h-[calc(100vh-4rem)] min-h-[580px] max-h-[820px]"
            messages={gameState.chatMessages || []}
            currentUserId={myPlayer.id}
            currentUserName={myPlayer.name}
            onSendMessage={onSendChatMessage}
          />
        </div>
      </div>

      {/* Mobile Only: Floating Chat Modal (when opened outside DAY_DISCUSSION) */}
      {showFloatingChat && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="w-full max-w-lg relative">
            <button
              type="button"
              onClick={() => setShowFloatingChat(false)}
              className="absolute -top-10 right-0 text-stone-300 hover:text-white text-xs font-bold px-3 py-1 bg-stone-800 rounded-full"
            >
              ✕ Tutup Chat
            </button>
            <ChatBox
              messages={gameState.chatMessages || []}
              currentUserId={myPlayer.id}
              currentUserName={myPlayer.name}
              onSendMessage={onSendChatMessage}
            />
          </div>
        </div>
      )}

      {/* Mobile Only: Floating Chat Toggle Button (when not in DAY_DISCUSSION) */}
      {gameState.phase !== "DAY_DISCUSSION" && (
        <button
          type="button"
          onClick={() => {
            audioEngine.playTap();
            setShowFloatingChat(!showFloatingChat);
          }}
          className="lg:hidden fixed bottom-16 right-4 z-40 p-3 rounded-full bg-indigo-950/90 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 shadow-xl backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5"
          title="Buka Chat Desa"
        >
          <MessageSquare className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold pr-1">Chat</span>
        </button>
      )}

      {/* Role Guide Modal */}
      <RoleGuideModal isOpen={showRoleGuide} onClose={() => setShowRoleGuide(false)} />
    </div>
  );
}
