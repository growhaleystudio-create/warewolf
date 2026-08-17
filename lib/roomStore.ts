import { 
  GameState, 
  RoleId, 
  GameSettings, 
  Player, 
  NightStep,
  ChatMessage 
} from "./types";
import { 
  gameReducer, 
  INITIAL_GAME_STATE, 
  DEFAULT_SETTINGS 
} from "./gameReducer";
import { getRecommendedRoles, assignRoles, ROLES } from "./roles";
import { 
  getRandomBotName, 
  generateAIBotNightActions, 
  generateAIBotVotes, 
  generateAIBotChatDialogue 
} from "./aiBotEngine";

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
  chatMessages: ChatMessage[];
  lastBotChatTime: number;
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
    chatMessages: [
      {
        id: `chat-${Date.now()}-welcome`,
        senderId: "system",
        senderName: "Moderator Desa",
        text: "Selamat datang di Balai Musyawarah Desa! Ruangan telah dibuka.",
        isBot: true,
        timestamp: Date.now(),
      }
    ],
    lastBotChatTime: 0,
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
      chatMessages: [],
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  rooms.set(roomCode, newRoom);
  return { roomCode, hostPlayerId };
}

/**
 * 1-Klik Buat Game Solo vs AI
 */
export function createSoloGame(playerName: string): { roomCode: string; hostPlayerId: string } {
  const { roomCode, hostPlayerId } = createRoom(playerName || "Pemain Utama", {
    dayDiscussionDurationSec: 120,
    nightActionDurationSec: 15,
  });

  // Tambahkan 6 AI Bot
  for (let i = 0; i < 6; i++) {
    addBotPlayerToRoom(roomCode, hostPlayerId);
  }

  // Langsung mulai game
  startRoomGame(roomCode, hostPlayerId);
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
  triggerAIBotTurnIfApplicable(room);

  room.updatedAt = Date.now();
  return true;
}

export function addChatMessageToRoom(
  roomCode: string,
  senderId: string,
  text: string
): boolean {
  const room = rooms.get(roomCode.toUpperCase().trim());
  if (!room || !text.trim()) return false;

  const sender = room.players.find((p) => p.id === senderId);
  const senderName = sender ? sender.name : "Warga";

  const newMsg: ChatMessage = {
    id: `chat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    senderId,
    senderName,
    text: text.trim(),
    isBot: senderName.startsWith("Bot"),
    timestamp: Date.now(),
  };

  room.chatMessages.push(newMsg);
  room.gameState.chatMessages = room.chatMessages;

  // Trigger possible AI response to user message
  if (!newMsg.isBot) {
    const aiResponse = generateAIBotChatDialogue(room.gameState, room.players, newMsg);
    if (aiResponse) {
      setTimeout(() => {
        if (room.chatMessages) {
          room.chatMessages.push(aiResponse);
          room.gameState.chatMessages = room.chatMessages;
          room.updatedAt = Date.now();
        }
      }, 1200);
    }
  }

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
  } else if (room.gameState.phase === "DAY_DISCUSSION") {
    // Generate autonomous bot dialogue in Day Discussion periodically
    const now = Date.now();
    if (now - room.lastBotChatTime > 5000) {
      const dialogue = generateAIBotChatDialogue(room.gameState, room.players);
      if (dialogue) {
        room.chatMessages.push(dialogue);
        room.gameState.chatMessages = room.chatMessages;
        room.lastBotChatTime = now;
      }
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

  room.players.forEach((p) => {
    const matched = nextState.players.find((sp) => sp.id === p.id);
    if (matched) {
      p.isAlive = matched.isAlive;
    }
  });

  triggerAIBotTurnIfApplicable(room);

  room.updatedAt = Date.now();
  return true;
}

export function getSanitizedRoomForPlayer(
  roomCode: string,
  playerId: string
): {
  roomCode: string;
  isHost: boolean;
  myPlayer: RoomPlayer | null;
  gameState: GameState;
  chatMessages: ChatMessage[];
  teammateWerewolves?: string[];
  currentActiveRole?: RoleId | null;
} | null {
  const room = rooms.get(roomCode.toUpperCase().trim());
  if (!room) return null;

  // Maintain bot periodic discussion if in DAY_DISCUSSION
  if (room.gameState.phase === "DAY_DISCUSSION") {
    triggerAIBotTurnIfApplicable(room);
  }

  const myPlayer = room.players.find((p) => p.id === playerId) || null;
  const isHost = room.hostPlayerId === playerId;
  const isGameOver = room.gameState.phase === "WINNER";
  const myRole = myPlayer ? myPlayer.role : null;

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

  let teammateWerewolves: string[] = [];
  if (myRole === "WEREWOLF") {
    teammateWerewolves = room.players
      .filter((p) => p.role === "WEREWOLF" && p.id !== playerId && p.isAlive)
      .map((p) => p.name);
  }

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
    chatMessages: room.chatMessages || [],
    gameState: {
      ...room.gameState,
      chatMessages: room.chatMessages || [],
      players: sanitizedPlayers,
    },
  };
}
