import { defineStore } from "pinia";

/**
 * @typedef {'global' | 'personal'} LeaderboardTab
 * @typedef {'loading' | 'ready' | 'error' | 'guest'} BoardStatus
 *   'guest': the Personal board, for someone not logged in
 */

const TAB_KEY = "boxRoulette_leaderboardTab";

function savedTab() {
  try {
    return localStorage.getItem(TAB_KEY) === "personal" ? "personal" : "global";
  } catch {
    return "global";
  }
}

function emptyBoard() {
  return { status: "loading", rows: [] };
}

export const useLeaderboardStore = defineStore("leaderboard", {
  state: () => {
    return {
      /** @type {LeaderboardTab} */
      tab: savedTab(),
      global: emptyBoard(),
      personal: emptyBoard(),
    };
  },
  actions: {
    /** @param {LeaderboardTab} tab */
    selectTab(tab) {
      this.tab = tab;
      try {
        localStorage.setItem(TAB_KEY, tab);
      } catch {
        // Not remembered; it still works for this visit.
      }
      this.load();
    },

    // Fetches the open tab. Called when a tab opens and after a run ends;
    // nothing polls, since every request counts against the daily quota.
    async load() {
      const tab = this.tab;
      const board = this[tab];
      // Keep showing the old rows while refreshing, so the list doesn't flash.
      if (board.status !== "ready") board.status = "loading";
      try {
        const res = await fetch(`/api/leaderboards/${tab}`);
        if (tab === "personal" && res.status === 401) {
          this.personal = { status: "guest", rows: [] };
          return;
        }
        if (!res.ok) throw new Error(`/api/leaderboards/${tab} returned ${res.status}`);
        this[tab] = { status: "ready", rows: await res.json() };
      } catch (error) {
        console.error(error);
        this[tab] = { status: "error", rows: [] };
      }
    },
  },
});
