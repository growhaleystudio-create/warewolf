import { GameState, RoleId, Player } from "./types";
import { RoomPlayer } from "./roomStore";

const BOT_NAMES = [
  "Bot Arthur",
  "Bot Luna",
  "Bot Rex",
  "Bot Freya",
  "Bot Oliver",
  "Bot Morgana",
  "Bot Cedric",
  "Bot Elena",
  "Bot Viktor",
  "Bot Diana",
  "Bot Tristan",
  "Bot Giselle",
  "Bot Roland",
  "Bot Valerie",
  "Bot Gavin",
];

export function getRandomBotName(existingNames: string[]): string {
  const available = BOT_NAMES.filter(
    (name) => !existingNames.some((en) => en.toLowerCase() === name.toLowerCase())
  );
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }
  return `Bot Warga ${existingNames.length + 1}`;
}

/**
 * Otomatisasi Logika Keputusan Bot AI pada Fase Malam
 */
export function generateAIBotNightActions(
  gameState: GameState,
  roomPlayers: RoomPlayer[],
  currentActiveStep: RoleId | null
): Partial<GameState["nightActions"]> {
  const updates: Partial<GameState["nightActions"]> = {};
  if (!currentActiveStep) return updates;

  const alivePlayers = gameState.players.filter((p) => p.isAlive);
  const botPlayersOfActiveRole = roomPlayers.filter(
    (rp) => rp.role === currentActiveStep && rp.name.startsWith("Bot") && rp.isAlive
  );

  if (botPlayersOfActiveRole.length === 0) return updates;

  switch (currentActiveStep) {
    case "WEREWOLF": {
      // Werewolf AI target: pilih target hidup yang bukan serigala
      const nonWerewolves = alivePlayers.filter((p) => p.role !== "WEREWOLF");
      if (nonWerewolves.length > 0 && !gameState.nightActions.werewolfTargetId) {
        const randomTarget = nonWerewolves[Math.floor(Math.random() * nonWerewolves.length)];
        updates.werewolfTargetId = randomTarget.id;
      }
      break;
    }

    case "SEER": {
      // Seer AI: terawang target hidup selain dirinya
      const seerBot = botPlayersOfActiveRole[0];
      const otherAlive = alivePlayers.filter((p) => p.id !== seerBot.id);
      if (otherAlive.length > 0 && !gameState.nightActions.seerInspectedId) {
        const randomTarget = otherAlive[Math.floor(Math.random() * otherAlive.length)];
        updates.seerInspectedId = randomTarget.id;
      }
      break;
    }

    case "DOCTOR": {
      // Doctor AI: sembuhkan pemain hidup secara acak
      if (alivePlayers.length > 0 && !gameState.nightActions.doctorTargetId) {
        const randomTarget = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
        updates.doctorTargetId = randomTarget.id;
      }
      break;
    }

    case "BODYGUARD": {
      // Bodyguard AI: lindungi pemain hidup selain dirinya
      const bgBot = botPlayersOfActiveRole[0];
      const otherAlive = alivePlayers.filter((p) => p.id !== bgBot.id);
      if (otherAlive.length > 0 && !gameState.nightActions.bodyguardTargetId) {
        const randomTarget = otherAlive[Math.floor(Math.random() * otherAlive.length)];
        updates.bodyguardTargetId = randomTarget.id;
      }
      break;
    }

    case "WITCH": {
      // Witch AI: jika serigala menyerang dan heal belum dipakai, ada 50% peluang menyelamatkan
      if (
        gameState.nightActions.werewolfTargetId &&
        !gameState.witchPotions.healUsed &&
        Math.random() > 0.4
      ) {
        updates.witchHealTargetId = gameState.nightActions.werewolfTargetId;
      }
      break;
    }
  }

  return updates;
}

/**
 * Otomatisasi Suara Voting Bot AI di Siang Hari
 */
export function generateAIBotVotes(
  gameState: GameState,
  roomPlayers: RoomPlayer[]
): Record<string, number> {
  const tally = { ...gameState.votingTally };
  const alivePlayers = gameState.players.filter((p) => p.isAlive);
  const aliveBots = roomPlayers.filter((rp) => rp.name.startsWith("Bot") && rp.isAlive);

  aliveBots.forEach((bot) => {
    // Cari calon target selain bot itu sendiri
    const validTargets = alivePlayers.filter((p) => p.id !== bot.id);
    if (validTargets.length > 0) {
      const chosen = validTargets[Math.floor(Math.random() * validTargets.length)];
      tally[chosen.id] = (tally[chosen.id] || 0) + 1;
    }
  });

  return tally;
}
