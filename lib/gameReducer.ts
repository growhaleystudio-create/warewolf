import { 
  GameState, 
  GamePhase, 
  Player, 
  NightStep, 
  RoleId, 
  GameSettings,
  NightActionsState
} from "./types";
import { 
  assignRoles, 
  getActiveNightSteps, 
  resolveNightCalculations, 
  checkWinCondition, 
  getRecommendedRoles 
} from "./roles";

export type GameAction =
  | { type: "INIT_GAME"; payload: { playerNames: string[]; selectedRoles: RoleId[]; settings: GameSettings } }
  | { type: "REVEAL_DEAL_CARD" }
  | { type: "NEXT_DEAL_PLAYER" }
  | { type: "START_NIGHT" }
  | { type: "SET_NIGHT_ACTION"; payload: Partial<NightActionsState> }
  | { type: "ADVANCE_NIGHT_STEP" }
  | { type: "PROCEED_TO_DAY_DISCUSSION" }
  | { type: "START_VOTING" }
  | { type: "CAST_VOTE"; payload: { voterId: string; targetId: string | null } }
  | { type: "RESOLVE_VOTING"; payload?: { targetId?: string | null } }
  | { type: "EXECUTE_HUNTER_REVENGE"; payload: { targetId: string } }
  | { type: "RESTART_GAME"; payload?: { keepSettings?: boolean } }
  | { type: "LOAD_SAVED_STATE"; payload: GameState };

export const DEFAULT_SETTINGS: GameSettings = {
  dayDiscussionDurationSec: 180,
  nightActionDurationSec: 15,
  revealRoleOnDeath: true,
  allowDoctorSelfHealConsecutive: false,
  soundEnabled: true,
};

export const INITIAL_GAME_STATE: GameState = {
  phase: "SETUP",
  roundNumber: 1,
  players: [],
  settings: DEFAULT_SETTINGS,
  activeNightStepIndex: 0,
  currentNightSteps: [],
  nightActions: {
    werewolfTargetId: null,
    doctorTargetId: null,
    bodyguardTargetId: null,
    seerInspectedId: null,
    witchHealTargetId: null,
    witchPoisonTargetId: null,
  },
  witchPotions: {
    healUsed: false,
    poisonUsed: false,
  },
  lastDoctorTargetId: null,
  lastBodyguardTargetId: null,
  morningDeaths: [],
  votingTally: {},
  winner: null,
  hunterTriggerSource: null,
  hunterPlayerId: null,
  historyLogs: [],
  currentDealPlayerIndex: 0,
  isCardRevealed: false,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "INIT_GAME": {
      const { playerNames, selectedRoles, settings } = action.payload;
      const assignedPlayers = assignRoles(playerNames, selectedRoles);
      
      return {
        ...INITIAL_GAME_STATE,
        phase: "DEAL",
        players: assignedPlayers,
        settings,
        currentDealPlayerIndex: 0,
        isCardRevealed: false,
        historyLogs: [
          {
            id: `log-${Date.now()}-init`,
            roundNumber: 1,
            phase: "NIGHT",
            title: "Permainan Dimulai",
            description: `Permainan dimulai dengan ${assignedPlayers.length} pemain.`,
            timestamp: Date.now(),
          }
        ]
      };
    }

    case "REVEAL_DEAL_CARD": {
      return {
        ...state,
        isCardRevealed: true,
      };
    }

    case "NEXT_DEAL_PLAYER": {
      const nextIndex = state.currentDealPlayerIndex + 1;
      if (nextIndex < state.players.length) {
        return {
          ...state,
          currentDealPlayerIndex: nextIndex,
          isCardRevealed: false,
        };
      }
      // Semua pemain sudah melihat peran, lanjut ke Malam Pertama
      const nightSteps = getActiveNightSteps(state.players);
      return {
        ...state,
        phase: "NIGHT",
        activeNightStepIndex: 0,
        currentNightSteps: nightSteps,
        isCardRevealed: false,
      };
    }

    case "START_NIGHT": {
      const nightSteps = getActiveNightSteps(state.players);
      return {
        ...state,
        phase: "NIGHT",
        activeNightStepIndex: 0,
        currentNightSteps: nightSteps,
        nightActions: {
          werewolfTargetId: null,
          doctorTargetId: null,
          bodyguardTargetId: null,
          seerInspectedId: null,
          witchHealTargetId: null,
          witchPoisonTargetId: null,
        },
      };
    }

    case "SET_NIGHT_ACTION": {
      return {
        ...state,
        nightActions: {
          ...state.nightActions,
          ...action.payload,
        },
      };
    }

    case "ADVANCE_NIGHT_STEP": {
      const nextStepIndex = state.activeNightStepIndex + 1;
      if (nextStepIndex < state.currentNightSteps.length) {
        return {
          ...state,
          activeNightStepIndex: nextStepIndex,
        };
      }

      // Selesai seluruh langkah malam -> hitung hasil resolusi malam
      const resolution = resolveNightCalculations(
        state.players,
        state.nightActions,
        state.witchPotions
      );

      // Perbarui status pemain yang mati
      let updatedPlayers = state.players.map(p => {
        const deathInfo = resolution.deathsDetail.find(d => d.playerId === p.id);
        if (deathInfo) {
          return {
            ...p,
            isAlive: false,
            deathReason: deathInfo.reason,
            deathRound: state.roundNumber,
            deathPhase: 'NIGHT' as const,
          };
        }
        return p;
      });

      // Cek apakah ada Pemburu yang tewas malam ini
      const deadHunter = updatedPlayers.find(
        p => resolution.killedPlayerIds.includes(p.id) && p.role === "HUNTER"
      );

      // Tambahkan riwayat log
      const newLogs = resolution.logs.map((logMsg, i) => ({
        id: `log-${Date.now()}-${i}`,
        roundNumber: state.roundNumber,
        phase: "NIGHT" as const,
        title: `Malam ${state.roundNumber}`,
        description: logMsg,
        timestamp: Date.now(),
      }));

      // Cek win condition setelah kematian malam
      const winner = checkWinCondition(updatedPlayers);

      if (winner) {
        return {
          ...state,
          phase: "WINNER",
          players: updatedPlayers,
          morningDeaths: resolution.killedPlayerIds,
          witchPotions: resolution.witchPotionsUpdated,
          lastDoctorTargetId: state.nightActions.doctorTargetId,
          lastBodyguardTargetId: state.nightActions.bodyguardTargetId,
          winner,
          historyLogs: [...state.historyLogs, ...newLogs],
        };
      }

      if (deadHunter) {
        return {
          ...state,
          phase: "HUNTER_REVENGE",
          players: updatedPlayers,
          morningDeaths: resolution.killedPlayerIds,
          witchPotions: resolution.witchPotionsUpdated,
          lastDoctorTargetId: state.nightActions.doctorTargetId,
          lastBodyguardTargetId: state.nightActions.bodyguardTargetId,
          hunterTriggerSource: "NIGHT",
          hunterPlayerId: deadHunter.id,
          historyLogs: [...state.historyLogs, ...newLogs],
        };
      }

      return {
        ...state,
        phase: "MORNING_REVEAL",
        players: updatedPlayers,
        morningDeaths: resolution.killedPlayerIds,
        witchPotions: resolution.witchPotionsUpdated,
        lastDoctorTargetId: state.nightActions.doctorTargetId,
        lastBodyguardTargetId: state.nightActions.bodyguardTargetId,
        historyLogs: [...state.historyLogs, ...newLogs],
      };
    }

    case "PROCEED_TO_DAY_DISCUSSION": {
      return {
        ...state,
        phase: "DAY_DISCUSSION",
      };
    }

    case "START_VOTING": {
      return {
        ...state,
        phase: "VOTING",
        votingTally: {},
      };
    }

    case "CAST_VOTE": {
      const { targetId } = action.payload;
      if (!targetId) return state;

      const currentTally = { ...state.votingTally };
      currentTally[targetId] = (currentTally[targetId] || 0) + 1;

      return {
        ...state,
        votingTally: currentTally,
      };
    }

    case "RESOLVE_VOTING": {
      let targetIdToLynch: string | null = null;

      if (action.payload?.targetId !== undefined) {
        targetIdToLynch = action.payload.targetId;
      } else {
        // Cari suara terbanyak
        const tally = state.votingTally;
        const entries = Object.entries(tally);
        if (entries.length > 0) {
          entries.sort((a, b) => b[1] - a[1]);
          const highestVote = entries[0][1];
          const topCandidates = entries.filter(e => e[1] === highestVote);

          if (topCandidates.length === 1 && highestVote > 0) {
            targetIdToLynch = topCandidates[0][0];
          } else {
            // Hasil Seri (Tie)
            targetIdToLynch = null;
          }
        }
      }

      if (!targetIdToLynch) {
        // Hari Damai (Seri / Tidak ada yang dieksekusi)
        const tieLog = {
          id: `log-${Date.now()}-tie`,
          roundNumber: state.roundNumber,
          phase: "DAY" as const,
          title: `Voting Siang ${state.roundNumber}`,
          description: "Hasil pemungutan suara seri! Tidak ada warga yang dieksekusi hari ini.",
          timestamp: Date.now(),
        };

        const nightState = gameReducer(
          { ...state, roundNumber: state.roundNumber + 1 },
          { type: "START_NIGHT" }
        );

        return {
          ...nightState,
          roundNumber: state.roundNumber + 1,
          historyLogs: [...state.historyLogs, tieLog],
        };
      }

      // Pemain digantung
      const targetPlayer = state.players.find(p => p.id === targetIdToLynch);
      const updatedPlayers = state.players.map(p => {
        if (p.id === targetIdToLynch) {
          return {
            ...p,
            isAlive: false,
            deathReason: 'LYNCH' as const,
            deathRound: state.roundNumber,
            deathPhase: 'DAY' as const,
          };
        }
        return p;
      });

      const lynchLog = {
        id: `log-${Date.now()}-lynch`,
        roundNumber: state.roundNumber,
        phase: "DAY" as const,
        title: `Eksekusi Siang ${state.roundNumber}`,
        description: `${targetPlayer?.name || 'Warga'} dieksekusi gantung berdasarkan hasil voting terbanyak.`,
        timestamp: Date.now(),
      };

      // Cek apakah Jester digantung (Kemenangan Khusus Jester)
      const winner = checkWinCondition(updatedPlayers, targetIdToLynch);
      if (winner) {
        return {
          ...state,
          phase: "WINNER",
          players: updatedPlayers,
          winner,
          historyLogs: [...state.historyLogs, lynchLog],
        };
      }

      // Cek apakah yang digantung adalah Hunter
      if (targetPlayer && targetPlayer.role === "HUNTER") {
        return {
          ...state,
          phase: "HUNTER_REVENGE",
          players: updatedPlayers,
          hunterTriggerSource: "DAY",
          hunterPlayerId: targetPlayer.id,
          historyLogs: [...state.historyLogs, lynchLog],
        };
      }

      // Jika game berlanjut, naikkan ronde dan mulai malam berikutnya
      const nextNightState = gameReducer(
        { ...state, players: updatedPlayers, roundNumber: state.roundNumber + 1 },
        { type: "START_NIGHT" }
      );

      return {
        ...nextNightState,
        roundNumber: state.roundNumber + 1,
        players: updatedPlayers,
        historyLogs: [...state.historyLogs, lynchLog],
      };
    }

    case "EXECUTE_HUNTER_REVENGE": {
      const { targetId } = action.payload;
      const targetPlayer = state.players.find(p => p.id === targetId);

      const updatedPlayers = state.players.map(p => {
        if (p.id === targetId) {
          return {
            ...p,
            isAlive: false,
            deathReason: 'HUNTER' as const,
            deathRound: state.roundNumber,
            deathPhase: (state.hunterTriggerSource === 'NIGHT' ? 'NIGHT' : 'DAY') as 'NIGHT' | 'DAY',
          };
        }
        return p;
      });

      const hunterLog = {
        id: `log-${Date.now()}-hunter-shot`,
        roundNumber: state.roundNumber,
        phase: (state.hunterTriggerSource === 'NIGHT' ? 'NIGHT' : 'DAY') as 'NIGHT' | 'DAY',
        title: "Tembakan Terakhir Pemburu",
        description: `Sebelum gugur, Pemburu melepaskan panah maut dan menewaskan ${targetPlayer?.name || 'seorang pemain'}!`,
        timestamp: Date.now(),
      };

      const winner = checkWinCondition(updatedPlayers);
      if (winner) {
        return {
          ...state,
          phase: "WINNER",
          players: updatedPlayers,
          winner,
          hunterTriggerSource: null,
          hunterPlayerId: null,
          historyLogs: [...state.historyLogs, hunterLog],
        };
      }

      if (state.hunterTriggerSource === "NIGHT") {
        return {
          ...state,
          phase: "DAY_DISCUSSION",
          players: updatedPlayers,
          hunterTriggerSource: null,
          hunterPlayerId: null,
          historyLogs: [...state.historyLogs, hunterLog],
        };
      } else {
        // Hunter mati di siang hari, setelah tembakan lanjut ke malam berikutnya
        const nextNightState = gameReducer(
          { ...state, players: updatedPlayers, roundNumber: state.roundNumber + 1 },
          { type: "START_NIGHT" }
        );
        return {
          ...nextNightState,
          roundNumber: state.roundNumber + 1,
          players: updatedPlayers,
          hunterTriggerSource: null,
          hunterPlayerId: null,
          historyLogs: [...state.historyLogs, hunterLog],
        };
      }
    }

    case "RESTART_GAME": {
      if (action.payload?.keepSettings) {
        return {
          ...INITIAL_GAME_STATE,
          settings: state.settings,
        };
      }
      return INITIAL_GAME_STATE;
    }

    case "LOAD_SAVED_STATE": {
      return action.payload;
    }

    default:
      return state;
  }
}
