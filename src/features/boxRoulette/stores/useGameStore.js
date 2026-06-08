import { defineStore } from "pinia";
import {
  createInitialState,
  startGame,
  selectBox,
  cashOut,
  resetGame,
} from "../game/engine";

const STORAGE_KEY = "boxRoulette_leaderboard";
const MAX_ENTRIES = 10;

function saveLeaderboard(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
function loadLeaderboard() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export const useGameStore = defineStore("game", {
  state: () => {
    return {
      game: createInitialState(),
      leaderboard: loadLeaderboard(),
    };
  },
  getters: {
    phase: (state) => state.game.phase,
    currentScore: (state) => state.game.currentScore,
    boxes: (state) => state.game.boxes,
    roundNumber: (state) => state.game.roundNumber,
    canCashOut: (state) =>
      state.game.currentScore > 0 && state.game.phase === "playing",
    isIdle: (state) => state.game.phase === "idle",
    isPlaying: (state) => state.game.phase === "playing",
    isLost: (state) => state.game.phase === "lost",
    isCashOut: (state) => state.game.phase === "cashed_out",
  },
  actions: {
    startGame() {
      this.game = startGame(this.game);
    },
    selectBox(boxId) {
      this.game = selectBox(this.game, boxId);
    },
    cashOut() {
      this.game = cashOut(this.game);

      const scoreEntry = {
        score: this.game.currentScore,
        date: new Date().toISOString(),
      };
      const allScores = [...this.leaderboard, scoreEntry];
      allScores.sort((a, b) => b.score - a.score);
      this.leaderboard = allScores.slice(0, MAX_ENTRIES);
      saveLeaderboard(this.leaderboard);
    },
    resetGame() {
      this.game = resetGame();
    },
  },
});
