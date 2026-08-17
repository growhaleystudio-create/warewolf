import { describe, it, expect } from "vitest";
import { 
  gameReducer, 
  INITIAL_GAME_STATE, 
  DEFAULT_SETTINGS 
} from "@/lib/gameReducer";
import { 
  resolveNightCalculations, 
  checkWinCondition, 
  getRecommendedRoles, 
  assignRoles 
} from "@/lib/roles";
import { Player, NightActionsState, WitchPotions } from "@/lib/types";

describe("Werewolf Logic & Rule Engine (PRD Compliance)", () => {
  const samplePlayers: Player[] = [
    { id: "p1", name: "Alpha", role: "WEREWOLF", isAlive: true, isProtectedByDoctor: false, isProtectedByBodyguard: false },
    { id: "p2", name: "Bravo", role: "SEER", isAlive: true, isProtectedByDoctor: false, isProtectedByBodyguard: false },
    { id: "p3", name: "Charlie", role: "DOCTOR", isAlive: true, isProtectedByDoctor: false, isProtectedByBodyguard: false },
    { id: "p4", name: "Delta", role: "BODYGUARD", isAlive: true, isProtectedByDoctor: false, isProtectedByBodyguard: false },
    { id: "p5", name: "Echo", role: "WITCH", isAlive: true, isProtectedByDoctor: false, isProtectedByBodyguard: false },
    { id: "p6", name: "Foxtrot", role: "HUNTER", isAlive: true, isProtectedByDoctor: false, isProtectedByBodyguard: false },
    { id: "p7", name: "Golf", role: "JESTER", isAlive: true, isProtectedByDoctor: false, isProtectedByBodyguard: false },
    { id: "p8", name: "Hotel", role: "VILLAGER", isAlive: true, isProtectedByDoctor: false, isProtectedByBodyguard: false },
  ];

  it("UT-01: Village Wins when all Werewolves are eliminated", () => {
    const playersWithoutWerewolves = samplePlayers.map(p => 
      p.role === "WEREWOLF" ? { ...p, isAlive: false } : p
    );
    const winner = checkWinCondition(playersWithoutWerewolves);
    expect(winner).toBe("VILLAGE");
  });

  it("UT-02: Werewolves Win when Werewolves count >= Villagers alive", () => {
    // 2 werewolves vs 2 villagers
    const players: Player[] = [
      { id: "w1", name: "Wolf 1", role: "WEREWOLF", isAlive: true, isProtectedByDoctor: false, isProtectedByBodyguard: false },
      { id: "w2", name: "Wolf 2", role: "WEREWOLF", isAlive: true, isProtectedByDoctor: false, isProtectedByBodyguard: false },
      { id: "v1", name: "Villager 1", role: "VILLAGER", isAlive: true, isProtectedByDoctor: false, isProtectedByBodyguard: false },
      { id: "v2", name: "Villager 2", role: "VILLAGER", isAlive: true, isProtectedByDoctor: false, isProtectedByBodyguard: false },
    ];
    const winner = checkWinCondition(players);
    expect(winner).toBe("WEREWOLF");
  });

  it("UT-03: Jester wins when lynched during Day voting", () => {
    const winner = checkWinCondition(samplePlayers, "p7"); // p7 is Jester
    expect(winner).toBe("JESTER");
  });

  it("UT-04: Doctor successfully heals and saves Werewolf target", () => {
    const actions: NightActionsState = {
      werewolfTargetId: "p2", // Target Seer
      doctorTargetId: "p2",   // Doctor saves Seer
      bodyguardTargetId: null,
      seerInspectedId: "p1",
      witchHealTargetId: null,
      witchPoisonTargetId: null,
    };
    const potions: WitchPotions = { healUsed: false, poisonUsed: false };

    const result = resolveNightCalculations(samplePlayers, actions, potions);
    expect(result.killedPlayerIds).toEqual([]);
    expect(result.logs[0]).toContain("berhasil digagalkan oleh perlindungan");
  });

  it("UT-05: Witch poison bypasses Doctor protection and kills target", () => {
    const actions: NightActionsState = {
      werewolfTargetId: "p8", // Wolf attacks p8
      doctorTargetId: "p6",   // Doctor saves p6
      bodyguardTargetId: null,
      seerInspectedId: null,
      witchHealTargetId: null,
      witchPoisonTargetId: "p6", // Witch poisons p6
    };
    const potions: WitchPotions = { healUsed: false, poisonUsed: false };

    const result = resolveNightCalculations(samplePlayers, actions, potions);
    // Both p6 (poison) and p8 (werewolf) should be killed
    expect(result.killedPlayerIds).toContain("p6");
    expect(result.killedPlayerIds).toContain("p8");
    expect(result.witchPotionsUpdated.poisonUsed).toBe(true);
  });

  it("UT-06: Hunter Revenge is triggered upon death", () => {
    const state = {
      ...INITIAL_GAME_STATE,
      phase: "NIGHT" as const,
      players: samplePlayers,
      roundNumber: 1,
      currentNightSteps: ["WEREWOLF" as const],
      activeNightStepIndex: 0,
      nightActions: {
        werewolfTargetId: "p6", // Target Hunter
        doctorTargetId: null,
        bodyguardTargetId: null,
        seerInspectedId: null,
        witchHealTargetId: null,
        witchPoisonTargetId: null,
      },
    };

    const nextState = gameReducer(state, { type: "ADVANCE_NIGHT_STEP" });
    expect(nextState.phase).toBe("HUNTER_REVENGE");
    expect(nextState.hunterPlayerId).toBe("p6");

    // Execute revenge shot
    const revengeState = gameReducer(nextState, {
      type: "EXECUTE_HUNTER_REVENGE",
      payload: { targetId: "p1" }, // Shoot werewolf
    });

    const shotPlayer = revengeState.players.find(p => p.id === "p1");
    expect(shotPlayer?.isAlive).toBe(false);
  });

  it("UT-07: Tie votes result in peaceful day (no lynching)", () => {
    const state = {
      ...INITIAL_GAME_STATE,
      phase: "VOTING" as const,
      players: samplePlayers,
      roundNumber: 1,
      votingTally: {
        p1: 3,
        p2: 3, // Tie 3 - 3
        p3: 1,
      },
    };

    const nextState = gameReducer(state, { type: "RESOLVE_VOTING" });
    // After tie, moves to next night without killing anyone
    expect(nextState.phase).toBe("NIGHT");
    expect(nextState.roundNumber).toBe(2);
    expect(nextState.players.every(p => p.isAlive)).toBe(true);
  });

  it("UT-08: Role Auto-Balancer recommends balanced setups", () => {
    const roles7 = getRecommendedRoles(7);
    expect(roles7.length).toBe(7);
    expect(roles7.filter(r => r === "WEREWOLF").length).toBe(1);
    expect(roles7).toContain("SEER");
    expect(roles7).toContain("DOCTOR");
    expect(roles7).toContain("BODYGUARD");

    const roles12 = getRecommendedRoles(12);
    expect(roles12.length).toBe(12);
    expect(roles12.filter(r => r === "WEREWOLF").length).toBe(3);
    expect(roles12).toContain("JESTER");
    expect(roles12).toContain("HUNTER");
    expect(roles12).toContain("WITCH");
  });
});
