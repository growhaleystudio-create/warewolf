import { GameState, RoleId, Player, ChatMessage, RoomPlayer } from "./types";

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

const ACCUSATION_TEMPLATES = [
  "Aku curiga banget sama {target}, dari tadi diam aja dan gerak-geriknya gelisah!",
  "Coba perhatikan {target}, argumennya aneh dan seperti mengalihkan isu!",
  "Firasatku kuat {target} adalah salah satu serigala di antara kita.",
  "Jangan terkecoh sama kepolosan {target}, kita harus selidiki dia!",
  "Kenapa {target} gak pernah membela siapa-siapa? Sangat mencurigakan.",
  "{target}, coba kasih alibi kamu semalam ngapain aja!",
  "Menurut analisisku, Serigala kemungkinan besar adalah {target}!",
];

const DEFENSE_TEMPLATES = [
  "Bukan aku serigalanya sumpah! Aku warga desa biasa yang mau desa kita menang!",
  "Kenapa kalian malah nuduh aku? Kalau aku digantung, desa bakal rugi!",
  "Tuduhan itu fitnah! Jangan sampai kita salah gantung warga tak bersalah!",
  "Aku berani bersumpah demi desa, aku bukan serigala!",
  "Kalian jangan termakan provokasi serigala asli yang mau menjebakku!",
];

const SEER_CALL_TEMPLATES = [
  "Peramal semalam cek siapa? Tolong kasih kode atau petunjuk dong!",
  "Ada yang punya info dari Peramal gak buat voting siang ini?",
  "Jangan sampai kita salah gantung, Peramal ada kabar siapa yang bersih?",
  "Siapa yang semalam diintip Peramal? Buka suara dong sebelum waktu habis!",
];

const COUNTER_TEMPLATES = [
  "Kenapa {target} ngotot banget mau gantung orang? Jangan-jangan kamu serigalanya yang panik!",
  "Orang yang paling berisik nuduh biasanya serigala aslinya! Hati-hati sama {target}.",
  "Tunggu dulu, kenapa fokusnya ke aku? {target} jauh lebih mencurigakan dari kemarin!",
];

const USER_REACTION_TEMPLATES = [
  "{user}, argumenmu masuk akal. Aku sependapat sama kamu!",
  "Tunggu dulu {user}, kenapa kamu yakin banget? Ada bukti kuat?",
  "Aku setuju sama {user}, ayo kita awasi pemain yang mencurigakan itu!",
  "{user}, jangan-jangan kamu cuma mau cuci tangan ya?",
];

/**
 * Generate a dynamic in-character chat message from an AI bot
 */
export function generateAIBotChatDialogue(
  gameState: GameState,
  roomPlayers: RoomPlayer[],
  lastUserMsg?: ChatMessage
): ChatMessage | null {
  const aliveBots = roomPlayers.filter((rp) => rp.name.startsWith("Bot") && rp.isAlive);
  if (aliveBots.length === 0) return null;

  const randomBot = aliveBots[Math.floor(Math.random() * aliveBots.length)];
  const aliveTargets = gameState.players.filter((p) => p.isAlive && p.id !== randomBot.id);
  if (aliveTargets.length === 0) return null;

  const randomTarget = aliveTargets[Math.floor(Math.random() * aliveTargets.length)];

  let messageText = "";

  // 1. React to human player's recent message if exists
  if (lastUserMsg && Math.random() > 0.45 && !lastUserMsg.isBot) {
    const tmpl = USER_REACTION_TEMPLATES[Math.floor(Math.random() * USER_REACTION_TEMPLATES.length)];
    messageText = tmpl.replace("{user}", lastUserMsg.senderName);
  } else {
    // 2. Mix of accusations, defenses, seer calls
    const randType = Math.random();
    if (randType < 0.45) {
      const tmpl = ACCUSATION_TEMPLATES[Math.floor(Math.random() * ACCUSATION_TEMPLATES.length)];
      messageText = tmpl.replace("{target}", randomTarget.name);
    } else if (randType < 0.70) {
      const tmpl = COUNTER_TEMPLATES[Math.floor(Math.random() * COUNTER_TEMPLATES.length)];
      messageText = tmpl.replace("{target}", randomTarget.name);
    } else if (randType < 0.85) {
      messageText = SEER_CALL_TEMPLATES[Math.floor(Math.random() * SEER_CALL_TEMPLATES.length)];
    } else {
      messageText = DEFENSE_TEMPLATES[Math.floor(Math.random() * DEFENSE_TEMPLATES.length)];
    }
  }

  return {
    id: `chat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    senderId: randomBot.id,
    senderName: randomBot.name,
    text: messageText,
    isBot: true,
    timestamp: Date.now(),
  };
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
      const nonWerewolves = alivePlayers.filter((p) => p.role !== "WEREWOLF");
      if (nonWerewolves.length > 0 && !gameState.nightActions.werewolfTargetId) {
        const randomTarget = nonWerewolves[Math.floor(Math.random() * nonWerewolves.length)];
        updates.werewolfTargetId = randomTarget.id;
      }
      break;
    }

    case "SEER": {
      const seerBot = botPlayersOfActiveRole[0];
      const otherAlive = alivePlayers.filter((p) => p.id !== seerBot.id);
      if (otherAlive.length > 0 && !gameState.nightActions.seerInspectedId) {
        const randomTarget = otherAlive[Math.floor(Math.random() * otherAlive.length)];
        updates.seerInspectedId = randomTarget.id;
      }
      break;
    }

    case "DOCTOR": {
      if (alivePlayers.length > 0 && !gameState.nightActions.doctorTargetId) {
        const randomTarget = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
        updates.doctorTargetId = randomTarget.id;
      }
      break;
    }

    case "BODYGUARD": {
      const bgBot = botPlayersOfActiveRole[0];
      const otherAlive = alivePlayers.filter((p) => p.id !== bgBot.id);
      if (otherAlive.length > 0 && !gameState.nightActions.bodyguardTargetId) {
        const randomTarget = otherAlive[Math.floor(Math.random() * otherAlive.length)];
        updates.bodyguardTargetId = randomTarget.id;
      }
      break;
    }

    case "WITCH": {
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
    const validTargets = alivePlayers.filter((p) => p.id !== bot.id);
    if (validTargets.length > 0) {
      const chosen = validTargets[Math.floor(Math.random() * validTargets.length)];
      tally[chosen.id] = (tally[chosen.id] || 0) + 1;
    }
  });

  return tally;
}
