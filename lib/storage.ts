import { GameState } from "./types";

const STORAGE_KEY = "WEREWOLF_APP_STATE_V1";

export function saveGameStateToStorage(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Gagal menyimpan state game ke localStorage:", error);
  }
}

export function loadGameStateFromStorage(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch (error) {
    console.error("Gagal memuat state game dari localStorage:", error);
    return null;
  }
}

export function clearGameStateFromStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Gagal menghapus state game dari localStorage:", error);
  }
}
