import { 
  GameState, 
  RoleId, 
  GameSettings, 
  Player, 
  NightStep 
} from "./types";
import { 
  gameReducer, 
  INITIAL_GAME_STATE, 
  DEFAULT_SETTINGS 
} from "./gameReducer";
import { getRecommendedRoles, assignRoles, ROLES } from "./roles";
import { getRandomBotName, generateAIBotNightActions, generateAIBotVotes } from "./aiBotEngine";

export interface RoomPlayer {
  id: string;
  name: string;
  role: RoleId;
  isAlive: boolean;
  isHost: boolean;
  connected: boolean;
  lastPing: number;
}

export interface GameRoom {
  roomCode: string;
  hostPlayerId: string;
  selectedRoles: RoleId[];
  settings: GameSettings;
  players: RoomPlayer[];
  gameState: GameState;
  createdAt: number;
  updatedAt: number;
}

// Global in-memory storage for Next.js API runtime
declare global {
  // eslint-disable-next-line no-var
  var __werewolf_rooms: Map<string, GameRoom> | undefined;
}

const rooms: Map<string, GameRoom> = global.__werewolf_rooms || new Map();
if (process.env.NODE_ENV !== "production") {
  global.__werewolf_rooms = rooms;
}

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function createRoom(
  hostName: string,
  customSettings?: Partial<GameSettings>,
  customRoles?: RoleId[]
): { roomCode: string; hostPlayerId: string } {
  let roomCode = generateRoomCode();
  while (rooms.has(roomCode)) {
    roomCode = generateRoomCode();
  }

  const hostPlayerId = `player-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const settings: GameSettings = {
    ...DEFAULT_SETTINGS,
    ...customSettings,
  };

  const initialRoles = customRoles || getRecommendedRoles(7);

  const initialPlayer: RoomPlayer = {
    id: hostPlayerId,
    name: hostName.trim() || "Host Desa",
    role: "VILLAGER",
    isAlive: true,
    isHost: true,
    connected: true,
    lastPing: Date.now(),
  };

  const newRoom: GameRoom = {
    roomCode,
    hostPlayerId,
    selectedRoles: initialRoles,
    settings,
    players: [initialPlayer],
    gameState: {
      ...INITIAL_GAME_STATE,
      settings,
      players: [
        {
          id: hostPlayerId,
          name: initialPlayer.name,
          role: "VILLAGER",
          isAlive: true,
          isProtectedByDoctor: false,
          isProtectedByBodyguard: false,
        },
      ],
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  rooms.set(roomCode, newRoom);
  return { roomCode, hostPlayerId };
}

export function joinRoom(
  roomCode: string,
  playerName: string
): { success: boolean; playerId?: string; error?: string } {
  const room = rooms.get(roomCode.toUpperCase().trim());
  if (!room) {
    return { success: false, error: "Kode Ruangan tidak ditemukan!" };
  }

  const trimmedName = playerName.trim() || `Warga ${room.players.length + 1}`;

  // Check if player with same name already in room (reconnection)
  const existingPlayer = room.players.find(
    (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
  );

  if (existingPlayer) {
    existingPlayer.connected = true;
    existingPlayer.lastPing = Date.now();
    room.updatedAt = Date.now();
    return { success: true, playerId: existingPlayer.id };
  }

  if (room.gameState.phase !== "SETUP") {
    return { success: false, error: "Permainan di ruangan ini sudah dimulai!" };
  }

  if (room.players.length >= 16) {
    return { success: false, error: "Ruangan sudah penuh (Maksimal 16 pemain)!" };
  }

  const newPlayerId = `player-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const newPlayer: RoomPlayer = {
    id: newPlayerId,
    name: trimmedName,
    role: "VILLAGER",
    isAlive: true,
    isHost: false,
    connected: true,
    lastPing: Date.now(),
  };

  room.players.push(newPlayer);

  // Update selected roles to match current player count
  room.selectedRoles = getRecommendedRoles(room.players.length);

  room.gameState.players = room.players.map((p) => ({
    id: p.id,
    name: p.name,
    role: "VILLAGER",
    isAlive: true,
    isProtectedByDoctor: false,
    isProtectedByBodyguard: false,
  }));

  room.updatedAt = Date.now();
  return { success: true, playerId: newPlayerId };
}

/**
 * Tambahkan Bot AI ke dalam Ruangan Lobby
 */
export function addBotPlayerToRoom(roomCode: string, hostPlayerId: string): boolean {
  const room = rooms.get(roomCode.toUpperCase().trim());
  if (!room || room.hostPlayerId !== hostPlayerId) return false;
  if (room.gameState.phase !== "SETUP" || room.players.length >= 16) return false;

  const existingNames = room.players.map((p) => p.name);
  const botName = getRandomBotName(existingNames);

  return joinRoom(roomCode, botName).success;
}

export function getRoom(roomCode: string): GameRoom | null {
  return rooms.get(roomCode.toUpperCase().trim()) || null;
}

export function updateRoomSettings(
  roomCode: string,
  hostPlayerId: string,
  settings: Partial<GameSettings>,
  selectedRoles?: RoleId[]
): boolean {
  const room = rooms.get(roomCode.toUpperCase().trim());
  if (!room || room.hostPlayerId !== hostPlayerId) return false;

  if (settings) {
    room.settings = { ...room.settings, ...settings };
    room.gameState.settings = room.settings;
  }
  if (selectedRoles) {
    room.selectedRoles = selectedRoles;
  }
  room.updatedAt = Date.now();
  return true;
}

export function startRoomGame(roomCode: string, hostPlayerId: string): boolean {
  const room = rooms.get(roomCode.toUpperCase().trim());
  if (!room || room.hostPlayerId !== hostPlayerId) return false;
  if (room.players.length < 5) return false;

  const playerNames = room.players.map((p) => p.name);
  const assigned = assignRoles(playerNames, room.selectedRoles);

  // Sync assigned roles back to room.players
  room.players.forEach((p, idx) => {
    p.role = assigned[idx].role;
    p.isAlive = true;
  });

  const nextState = gameReducer(room.gameState, {
    type: "INIT_GAME",
    payload: {
      playerNames,
      selectedRoles: room.selectedRoles,
      settings: room.settings,
    },
  });

  // Overwrite players in state to match room player IDs
  nextState.players = room.players.map((p) => ({
    id: p.id,
    name: p.name,
    role: p.role,
    isAlive: true,
    isProtectedByDoctor: false,
    isProtectedByBodyguard: false,
  }));

  nextState.phase = "NIGHT";
  nextState.activeNightStepIndex = 0;
  nextState.currentNightSteps = ["SEER", "WEREWOLF", "DOCTOR", "BODYGUARD", "WITCH"].filter(
    (step) => nextState.players.some((p) => p.role === step)
  ) as NightStep[];

  room.gameState = nextState;

  // Lakukan aksi bot jika peran pertama adalah bot
  triggerAIBotTurnIfApplicable(room);

  room.updatedAt = Date.now();
  return true;
}

function triggerAIBotTurnIfApplicable(room: GameRoom) {
  if (room.gameState.phase === "NIGHT") {
    const currentStep = room.gameState.currentNightSteps[room.gameState.activeNightStepIndex];
    if (currentStep) {
      const botUpdates = generateAIBotNightActions(room.gameState, room.players, currentStep);
      room.gameState.nightActions = {
        ...room.gameState.nightActions,
        ...botUpdates,
      };
    }
  } else if (room.gameState.phase === "VOTING") {
    const botVotes = generateAIBotVotes(room.gameState, room.players);
    room.gameState.votingTally = botVotes;
  }
}

export function dispatchActionToRoom(
  roomCode: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any
): boolean {
  const room = rooms.get(roomCode.toUpperCase().trim());
  if (!room) return false;

  const nextState = gameReducer(room.gameState, action);
  room.gameState = nextState;

  // Sync alive states back to room.players
  room.players.forEach((p) => {
    const matched = nextState.players.find((sp) => sp.id === p.id);
    if (matched) {
      p.isAlive = matched.isAlive;
    }
  });

  // Otomasi giliran bot AI berikutnya
  triggerAIBotTurnIfApplicable(room);

  room.updatedAt = Date.now();
  return true;
}

/**
 * Sanitasi data yang dikirim ke masing-masing HP pemain agar tidak bisa inspect-element
 */
export function getSanitizedRoomForPlayer(
  roomCode: string,
  playerId: string
): {
  roomCode: string;
  isHost: boolean;
  myPlayer: RoomPlayer | null;
  gameState: GameState;
  teammateWerewolves?: string[];
  currentActiveRole?: RoleId | null;
} | null {
  const room = rooms.get(roomCode.toUpperCase().trim());
  if (!room) return null;

  const myPlayer = room.players.find((p) => p.id === playerId) || null;
  const isHost = room.hostPlayerId === playerId;
  const isGameOver = room.gameState.phase === "WINNER";
  const myRole = myPlayer ? myPlayer.role : null;

  // Mask player roles for security
  const sanitizedPlayers: Player[] = room.gameState.players.map((p) => {
    const shouldRevealRole =
      isGameOver ||
      p.id === playerId ||
      (!p.isAlive && room.settings.revealRoleOnDeath);

    return {
      ...p,
      role: shouldRevealRole ? p.role : ("VILLAGER" as RoleId),
    };
  });

  // Jika saya werewolf, cari nama sesama werewolf hidup
  let teammateWerewolves: string[] = [];
  if (myRole === "WEREWOLF") {
    teammateWerewolves = room.players
      .filter((p) => p.role === "WEREWOLF" && p.id !== playerId && p.isAlive)
      .map((p) => p.name);
  }

  // Cek peran apa yang sedang aktif di malam hari
  let currentActiveRole: RoleId | null = null;
  if (room.gameState.phase === "NIGHT") {
    currentActiveRole =
      room.gameState.currentNightSteps[room.gameState.activeNightStepIndex] || null;
  }

  return {
    roomCode: room.roomCode,
    isHost,
    myPlayer,
    teammateWerewolves,
    currentActiveRole,
    gameState: {
      ...room.gameState,
      players: sanitizedPlayers,
    },
  };
}
