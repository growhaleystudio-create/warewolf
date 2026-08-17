import { RoleId, RoleDefinition, Player, NightActionsState, WitchPotions, NightStep } from "./types";

export const ROLES: Record<RoleId, RoleDefinition> = {
  WEREWOLF: {
    id: "WEREWOLF",
    name: "Serigala",
    faction: "WEREWOLF",
    description: "Membunuh 1 warga desa setiap malam bersama kawanan serigala.",
    nightOrder: 2,
    hasNightAction: true,
    defaultIncluded: true,
    minRecommendedPlayers: 5,
  },
  VILLAGER: {
    id: "VILLAGER",
    name: "Warga Desa",
    faction: "VILLAGE",
    description: "Warga biasa tanpa kekuatan malam. Mengandalkan intuisi, analisis, dan voting.",
    nightOrder: 0,
    hasNightAction: false,
    defaultIncluded: true,
    minRecommendedPlayers: 5,
  },
  SEER: {
    id: "SEER",
    name: "Peramal",
    faction: "VILLAGE",
    description: "Menerawang 1 pemain setiap malam untuk mengetahui apakah ia Serigala atau bukan.",
    nightOrder: 1,
    hasNightAction: true,
    defaultIncluded: true,
    minRecommendedPlayers: 5,
  },
  DOCTOR: {
    id: "DOCTOR",
    name: "Dokter",
    faction: "VILLAGE",
    description: "Menyembuhkan 1 pemain tiap malam agar kebal dari serangan Serigala.",
    nightOrder: 3,
    hasNightAction: true,
    defaultIncluded: true,
    minRecommendedPlayers: 5,
  },
  BODYGUARD: {
    id: "BODYGUARD",
    name: "Bodyguard",
    faction: "VILLAGE",
    description: "Melindungi 1 pemain lain tiap malam dari kematian akibat serangan serigala.",
    nightOrder: 4,
    hasNightAction: true,
    defaultIncluded: false,
    minRecommendedPlayers: 7,
  },
  WITCH: {
    id: "WITCH",
    name: "Penyihir",
    faction: "VILLAGE",
    description: "Memiliki 1× Ramuan Penyembuh & 1× Ramuan Racun maut sepanjang permainan.",
    nightOrder: 5,
    hasNightAction: true,
    defaultIncluded: false,
    minRecommendedPlayers: 8,
  },
  HUNTER: {
    id: "HUNTER",
    name: "Pemburu",
    faction: "VILLAGE",
    description: "Jika terbunuh (malam atau digantung), segera menembak mati 1 pemain lain.",
    nightOrder: 0,
    hasNightAction: false,
    defaultIncluded: false,
    minRecommendedPlayers: 6,
  },
  JESTER: {
    id: "JESTER",
    name: "Orang Gila (Jester)",
    faction: "NEUTRAL",
    description: "Ingin digantung! Menang mutlak jika berhasil dieksekusi saat voting siang.",
    nightOrder: 0,
    hasNightAction: false,
    defaultIncluded: false,
    minRecommendedPlayers: 6,
  },
};

/**
 * Merekomendasikan komposisi peran default berdasarkan jumlah pemain
 */
export function getRecommendedRoles(playerCount: number): RoleId[] {
  const count = Math.max(5, Math.min(16, playerCount));
  const werewolfCount = Math.max(1, Math.floor(count / 4));
  const roles: RoleId[] = [];

  // Tambahkan Werewolf
  for (let i = 0; i < werewolfCount; i++) {
    roles.push("WEREWOLF");
  }

  // Peran Khusus Esensial
  roles.push("SEER");
  roles.push("DOCTOR");

  if (count >= 7) roles.push("BODYGUARD");
  if (count >= 8) roles.push("WITCH");
  if (count >= 9) roles.push("HUNTER");
  if (count >= 11) roles.push("JESTER");

  // Sisanya isi dengan Warga Desa
  while (roles.length < count) {
    roles.push("VILLAGER");
  }

  // Jika over (karena kustom), sesuaikan kembali
  return roles.slice(0, count);
}

/**
 * Acak peran ke daftar pemain (Fisher-Yates Shuffle)
 */
export function assignRoles(playerNames: string[], selectedRoles: RoleId[]): Player[] {
  const shuffledRoles = [...selectedRoles];
  for (let i = shuffledRoles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledRoles[i], shuffledRoles[j]] = [shuffledRoles[j], shuffledRoles[i]];
  }

  return playerNames.map((name, idx) => ({
    id: `player-${idx + 1}`,
    name: name.trim() || `Pemain ${idx + 1}`,
    role: shuffledRoles[idx] || "VILLAGER",
    isAlive: true,
    isProtectedByDoctor: false,
    isProtectedByBodyguard: false,
  }));
}

/**
 * Dapatkan urutan peran malam yang aktif & masih hidup dalam permainan
 */
export function getActiveNightSteps(players: Player[]): NightStep[] {
  const steps: NightStep[] = [];
  const aliveRoles = new Set(players.filter(p => p.isAlive).map(p => p.role));

  // Urutan standar: SEER -> WEREWOLF -> DOCTOR -> BODYGUARD -> WITCH
  if (aliveRoles.has("SEER")) steps.push("SEER");
  if (aliveRoles.has("WEREWOLF")) steps.push("WEREWOLF");
  if (aliveRoles.has("DOCTOR")) steps.push("DOCTOR");
  if (aliveRoles.has("BODYGUARD")) steps.push("BODYGUARD");
  if (aliveRoles.has("WITCH")) steps.push("WITCH");

  return steps;
}

export interface NightCalculationResult {
  killedPlayerIds: string[];
  deathsDetail: { playerId: string; reason: 'WEREWOLF' | 'POISON' }[];
  logs: string[];
  witchPotionsUpdated: WitchPotions;
}

/**
 * Mesin Resolusi Logika Malam Sesuai PRD
 */
export function resolveNightCalculations(
  players: Player[],
  actions: NightActionsState,
  currentWitchPotions: WitchPotions
): NightCalculationResult {
  const killedPlayerIds = new Set<string>();
  const deathsDetail: { playerId: string; reason: 'WEREWOLF' | 'POISON' }[] = [];
  const logs: string[] = [];
  const witchPotionsUpdated = { ...currentWitchPotions };

  // 1. Racun Penyihir (Unsaveable kill)
  if (actions.witchPoisonTargetId && !currentWitchPotions.poisonUsed) {
    const target = players.find(p => p.id === actions.witchPoisonTargetId && p.isAlive);
    if (target) {
      killedPlayerIds.add(target.id);
      deathsDetail.push({ playerId: target.id, reason: 'POISON' });
      logs.push(`${target.name} tewas akibat racun mematikan di malam hari.`);
      witchPotionsUpdated.poisonUsed = true;
    }
  }

  // 2. Serangan Serigala vs Proteksi (Dokter, Bodyguard, Ramuan Sembuh Penyihir)
  if (actions.werewolfTargetId) {
    const target = players.find(p => p.id === actions.werewolfTargetId && p.isAlive);
    if (target) {
      const isSavedByDoctor = actions.doctorTargetId === target.id;
      const isProtectedByBodyguard = actions.bodyguardTargetId === target.id;
      const isHealedByWitch = 
        actions.witchHealTargetId === target.id && !currentWitchPotions.healUsed;

      if (isHealedByWitch) {
        witchPotionsUpdated.healUsed = true;
      }

      if (isSavedByDoctor || isProtectedByBodyguard || isHealedByWitch) {
        logs.push(`Serangan serigala terhadap ${target.name} berhasil digagalkan oleh perlindungan!`);
      } else {
        // Jika belum mati karena racun, masukkan ke daftar tewas
        if (!killedPlayerIds.has(target.id)) {
          killedPlayerIds.add(target.id);
          deathsDetail.push({ playerId: target.id, reason: 'WEREWOLF' });
          logs.push(`${target.name} tewas dimangsa kawanan serigala.`);
        }
      }
    }
  }

  if (killedPlayerIds.size === 0) {
    logs.push("Malam berlangsung damai, tidak ada warga yang gugur.");
  }

  return {
    killedPlayerIds: Array.from(killedPlayerIds),
    deathsDetail,
    logs,
    witchPotionsUpdated,
  };
}

/**
 * Pengecekan Kondisi Kemenangan
 */
export function checkWinCondition(
  players: Player[],
  lynchedPlayerId?: string
): 'VILLAGE' | 'WEREWOLF' | 'JESTER' | null {
  // Cek Kemenangan Spesial Jester (jika digantung saat voting siang)
  if (lynchedPlayerId) {
    const lynchedPlayer = players.find(p => p.id === lynchedPlayerId);
    if (lynchedPlayer && lynchedPlayer.role === 'JESTER') {
      return 'JESTER';
    }
  }

  const alivePlayers = players.filter(p => p.isAlive);
  const aliveWerewolves = alivePlayers.filter(p => p.role === 'WEREWOLF').length;
  const aliveNonWerewolves = alivePlayers.filter(p => p.role !== 'WEREWOLF').length;

  // Desa Menang: Semua Serigala mati
  if (aliveWerewolves === 0) {
    return 'VILLAGE';
  }

  // Serigala Menang: Jumlah Serigala >= Jumlah Warga Desa hidup
  if (aliveWerewolves >= aliveNonWerewolves) {
    return 'WEREWOLF';
  }

  return null;
}
