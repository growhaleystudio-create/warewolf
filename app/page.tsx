"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RoleId, GameSettings, GameState } from "@/lib/types";
import { RoomPlayer } from "@/lib/roomStore";
import { INITIAL_GAME_STATE } from "@/lib/gameReducer";
import { LobbyAuthScreen } from "@/components/screens/LobbyAuthScreen";
import { PlayerPersonalScreen } from "@/components/screens/PlayerPersonalScreen";
import { AudioToggle } from "@/components/ui/AudioToggle";

function WerewolfApp() {
  const searchParams = useSearchParams();
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [myPlayer, setMyPlayer] = useState<RoomPlayer | null>(null);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [playersInRoom, setPlayersInRoom] = useState<Array<{ id: string; name: string; isHost: boolean }>>([]);
  const [currentActiveRole, setCurrentActiveRole] = useState<RoleId | null>(null);
  const [teammateWerewolves, setTeammateWerewolves] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Restore saved session or read URL room code
  useEffect(() => {
    const urlRoom = searchParams.get("room");
    const savedRoom = localStorage.getItem("WEREWOLF_MULTI_ROOM");
    const savedPlayerId = localStorage.getItem("WEREWOLF_MULTI_PLAYER_ID");

    if (savedRoom && savedPlayerId) {
      setRoomCode(savedRoom);
      setPlayerId(savedPlayerId);
    } else if (urlRoom) {
      setRoomCode(urlRoom.toUpperCase());
    }
  }, [searchParams]);

  // Real-time synchronization polling (every 1.5 seconds)
  const syncRoom = useCallback(async () => {
    if (!roomCode || !playerId) return;

    try {
      const res = await fetch(`/api/rooms/${roomCode}?playerId=${playerId}`);
      if (!res.ok) {
        if (res.status === 404) {
          // Room expired / deleted
          localStorage.removeItem("WEREWOLF_MULTI_ROOM");
          localStorage.removeItem("WEREWOLF_MULTI_PLAYER_ID");
          setRoomCode(null);
          setPlayerId(null);
        }
        return;
      }

      const json = await res.json();
      if (json.success && json.data) {
        const data = json.data;
        setIsHost(data.isHost);
        setMyPlayer(data.myPlayer);
        setGameState(data.gameState);
        setCurrentActiveRole(data.currentActiveRole);
        setTeammateWerewolves(data.teammateWerewolves || []);
        setPlayersInRoom(
          data.gameState.players.map((p: { id: string; name: string }) => ({
            id: p.id,
            name: p.name,
            isHost: p.id === data.gameState.players[0]?.id,
          }))
        );
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  }, [roomCode, playerId]);

  useEffect(() => {
    if (!roomCode || !playerId) return;
    syncRoom();
    const interval = setInterval(syncRoom, 1500);
    return () => clearInterval(interval);
  }, [roomCode, playerId, syncRoom]);

  // Handlers
  const handleCreateRoom = async (
    hostName: string,
    settings: GameSettings,
    selectedRoles: RoleId[]
  ) => {
    setErrorMessage(null);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostName, settings, selectedRoles }),
      });
      const json = await res.json();
      if (json.success) {
        setRoomCode(json.roomCode);
        setPlayerId(json.hostPlayerId);
        setIsHost(true);
        localStorage.setItem("WEREWOLF_MULTI_ROOM", json.roomCode);
        localStorage.setItem("WEREWOLF_MULTI_PLAYER_ID", json.hostPlayerId);
      } else {
        setErrorMessage(json.error || "Gagal membuat ruangan.");
      }
    } catch {
      setErrorMessage("Koneksi gagal saat membuat ruangan.");
    }
  };

  const handleJoinRoom = async (code: string, playerName: string) => {
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/rooms/${code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName }),
      });
      const json = await res.json();
      if (json.success) {
        setRoomCode(json.roomCode);
        setPlayerId(json.playerId);
        localStorage.setItem("WEREWOLF_MULTI_ROOM", json.roomCode);
        localStorage.setItem("WEREWOLF_MULTI_PLAYER_ID", json.playerId);
      } else {
        setErrorMessage(json.error || "Gagal bergabung ke ruangan.");
      }
    } catch {
      setErrorMessage("Koneksi gagal saat bergabung ke ruangan.");
    }
  };

  const handleStartGame = async () => {
    if (!roomCode || !playerId) return;
    try {
      const res = await fetch(`/api/rooms/${roomCode}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "START_GAME", playerId }),
      });
      const json = await res.json();
      if (!json.success) {
        alert(json.error || "Gagal memulai game.");
      } else {
        syncRoom();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDispatchAction = async (type: string, payload?: unknown) => {
    if (!roomCode || !playerId) return;
    try {
      await fetch(`/api/rooms/${roomCode}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload, playerId }),
      });
      syncRoom();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestartGame = async () => {
    handleDispatchAction("RESTART_GAME");
  };

  const handleLeaveRoom = () => {
    localStorage.removeItem("WEREWOLF_MULTI_ROOM");
    localStorage.removeItem("WEREWOLF_MULTI_PLAYER_ID");
    setRoomCode(null);
    setPlayerId(null);
    setMyPlayer(null);
    setGameState(INITIAL_GAME_STATE);
  };

  const isNightPhase = gameState.phase === "NIGHT";
  const isInActiveGame = roomCode && playerId && myPlayer && gameState.phase !== "SETUP";

  return (
    <main
      className={`min-h-screen relative flex flex-col justify-between py-4 px-3 sm:px-6 transition-colors duration-700 ${
        isNightPhase ? "night-bg" : "day-bg"
      }`}
    >
      {/* Error alert toast */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 p-3 px-5 rounded-2xl bg-red-950/90 border border-red-500/60 text-red-200 text-xs font-semibold shadow-2xl backdrop-blur-md animate-bounce">
          {errorMessage}
        </div>
      )}

      {/* Dynamic Background Stars on Night */}
      {isNightPhase && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <div className="absolute top-10 left-1/4 w-1.5 h-1.5 bg-cyan-200 rounded-full animate-twinkle" />
          <div className="absolute top-24 right-1/3 w-1 h-1 bg-purple-200 rounded-full animate-twinkle delay-300" />
          <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-amber-100 rounded-full animate-twinkle delay-700" />
          <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-indigo-200 rounded-full animate-twinkle delay-500" />
        </div>
      )}

      {/* Screen Router */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
        {!isInActiveGame ? (
          <LobbyAuthScreen
            roomCode={roomCode}
            playerId={playerId}
            isHost={isHost}
            playersInRoom={playersInRoom}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onStartGame={handleStartGame}
            onAddBot={() => handleDispatchAction("ADD_BOT")}
            onLeaveRoom={handleLeaveRoom}
          />
        ) : (
          <PlayerPersonalScreen
            roomCode={roomCode!}
            isHost={isHost}
            myPlayer={myPlayer!}
            gameState={gameState}
            currentActiveRole={currentActiveRole}
            teammateWerewolves={teammateWerewolves}
            onDispatchAction={handleDispatchAction}
            onRestartGame={handleRestartGame}
          />
        )}
      </div>

      {/* Floating Audio Toggle */}
      <AudioToggle />

      {/* Footer Branding */}
      <footer className="relative z-10 text-center py-2 text-[11px] text-stone-500 font-mono">
        Werewolf Online Desa • Multiplayer Multi-Perangkat
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <WerewolfApp />
    </Suspense>
  );
}
