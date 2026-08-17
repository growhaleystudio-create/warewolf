export type RoleId = 
  | 'WEREWOLF' 
  | 'VILLAGER' 
  | 'SEER' 
  | 'DOCTOR' 
  | 'BODYGUARD' 
  | 'WITCH' 
  | 'HUNTER' 
  | 'JESTER';

export type Faction = 'VILLAGE' | 'WEREWOLF' | 'NEUTRAL';

export interface RoleDefinition {
  id: RoleId;
  name: string;
  faction: Faction;
  description: string;
  nightOrder: number; // 0 jika tidak ada aksi malam
  hasNightAction: boolean;
  defaultIncluded: boolean;
  minRecommendedPlayers: number;
}

export type DeathReason = 'WEREWOLF' | 'POISON' | 'LYNCH' | 'HUNTER';

export interface Player {
  id: string;
  name: string;
  role: RoleId;
  isAlive: boolean;
  isProtectedByDoctor: boolean;
  isProtectedByBodyguard: boolean;
  deathReason?: DeathReason;
  deathRound?: number;
  deathPhase?: 'NIGHT' | 'DAY';
}

export type GamePhase = 
  | 'SETUP' 
  | 'DEAL' 
  | 'NIGHT' 
  | 'MORNING_REVEAL' 
  | 'DAY_DISCUSSION' 
  | 'VOTING' 
  | 'HUNTER_REVENGE' 
  | 'WINNER';

export type NightStep = 
  | 'SEER' 
  | 'WEREWOLF' 
  | 'DOCTOR' 
  | 'BODYGUARD' 
  | 'WITCH';

export interface WitchPotions {
  healUsed: boolean;
  poisonUsed: boolean;
}

export interface NightActionsState {
  werewolfTargetId: string | null;
  doctorTargetId: string | null;
  bodyguardTargetId: string | null;
  seerInspectedId: string | null;
  witchHealTargetId: string | null;
  witchPoisonTargetId: string | null;
}

export interface GameSettings {
  dayDiscussionDurationSec: number;
  nightActionDurationSec: number;
  revealRoleOnDeath: boolean;
  allowDoctorSelfHealConsecutive: boolean;
  soundEnabled: boolean;
}

export interface GameLogEntry {
  id: string;
  roundNumber: number;
  phase: 'NIGHT' | 'DAY';
  title: string;
  description: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  isBot?: boolean;
  timestamp: number;
}

export interface GameState {
  phase: GamePhase;
  roundNumber: number;
  players: Player[];
  settings: GameSettings;
  activeNightStepIndex: number;
  currentNightSteps: NightStep[];
  nightActions: NightActionsState;
  witchPotions: WitchPotions;
  lastDoctorTargetId: string | null;
  lastBodyguardTargetId: string | null;
  morningDeaths: string[]; // Player IDs killed in current night
  votingTally: Record<string, number>; // TargetId -> Count
  winner: 'VILLAGE' | 'WEREWOLF' | 'JESTER' | null;
  hunterTriggerSource: 'NIGHT' | 'DAY' | null;
  hunterPlayerId: string | null;
  historyLogs: GameLogEntry[];
  chatMessages?: ChatMessage[];
  currentDealPlayerIndex: number;
  isCardRevealed: boolean;
}
