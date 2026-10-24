import { defineStore } from "pinia";

/**
 * The game is played on the server (see docs/adr/0001-server-runs-the-game.md).
 * This store only sends actions and shows what the server answers.
 *
 * @typedef {'idle' | 'playing' | 'revealing' | 'lost' | 'cashed_out'} GamePhase
 *
 * @typedef {Object} Box
 * @property {number} id
 * @property {number | null} points  null until the server reveals the round
 * @property {boolean} isRevealed
 *
 * @typedef {Object} RunView  What the server says about a run
 * @property {string} id
 * @property {'open' | 'cashed_out' | 'busted' | 'abandoned'} status
 * @property {number} score
 * @property {number} roundsSurvived
 * @property {boolean} owned
 */

// Two keys, one meaning each. For a guest, a run's ID is the only proof the
// run is theirs, so losing either key loses the run.
// The open run this browser is playing, so a reload can resume it.
const RUN_ID_KEY = "boxRoulette_runId";
// Finished guest runs this browser can still claim after logging in, as a
// JSON array of IDs, newest last. Kept apart from RUN_ID_KEY: claiming must
// never be able to touch (or forget) the open run, whatever order page-load
// requests finish in.
const CLAIMABLE_RUNS_KEY = "boxRoulette_claimableRunIds";
// The server deletes unclaimed guest runs after a day, so this only needs to
// cover a day of play. Matches MAX_CLAIM in functions/api/runs/claim.js.
const MAX_CLAIMABLE = 50;

function loadClaimable() {
  try {
    const ids = JSON.parse(localStorage.getItem(CLAIMABLE_RUNS_KEY));
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}
function addClaimable(id) {
  const ids = loadClaimable().filter((existing) => existing !== id);
  ids.push(id);
  localStorage.setItem(
    CLAIMABLE_RUNS_KEY,
    JSON.stringify(ids.slice(-MAX_CLAIMABLE)),
  );
}
const BOX_COUNT = 4;

// The old device-only leaderboard, replaced by the Personal leaderboard. Its
// entries never had an owner, so they're dropped rather than imported.
try {
  localStorage.removeItem("boxRoulette_leaderboard");
} catch {
  // Storage blocked (private mode): nothing to clean up.
}

function hiddenBoxes() {
  return Array.from({ length: BOX_COUNT }, (_, id) => ({
    id,
    points: null,
    isRevealed: false,
  }));
}
function revealedBoxes(values) {
  return values.map((points, id) => ({ id, points, isRevealed: true }));
}

function initialGame() {
  return {
    phase: "idle",
    currentScore: 0,
    boxes: [],
    // The round on screen: rounds survived + 1 while playing. After a cash
    // out it shows rounds survived, after a bust the round they busted in.
    roundNumber: 0,
    selectedBoxId: null,
  };
}

// Every API call goes through here. Throws on network failure; returns the
// status and parsed body otherwise, so callers decide what each status means.
async function api(method, path, body) {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

export const useGameStore = defineStore("game", {
  state: () => {
    return {
      game: initialGame(),
      runId: null,
      // A request is in flight: ignore clicks so one click is one request.
      busy: false,
      // The API couldn't be reached; the game can't be played without it.
      unavailable: false,
      // Something the player should know when they land back on Start.
      notice: null,
      // Goes up each time a run ends, so leaderboards know to refresh.
      runsFinished: 0,
    };
  },
  getters: {
    phase: (state) => state.game.phase,
    currentScore: (state) => state.game.currentScore,
    boxes: (state) => state.game.boxes,
    roundNumber: (state) => state.game.roundNumber,
    selectedBoxId: (state) => state.game.selectedBoxId,
    canCashOut: (state) =>
      state.game.currentScore > 0 && state.game.phase === "playing",
    isIdle: (state) => state.game.phase === "idle",
    isPlaying: (state) => state.game.phase === "playing",
    isRevealing: (state) => state.game.phase === "revealing",
    isLost: (state) => state.game.phase === "lost",
    isCashOut: (state) => state.game.phase === "cashed_out",
    inRun: (state) =>
      state.game.phase === "playing" || state.game.phase === "revealing",
  },
  actions: {
    // On page load: pick up an open run where it left off.
    async resume() {
      const id = localStorage.getItem(RUN_ID_KEY);
      if (!id) return;
      try {
        const { status, data } = await api("GET", `/api/runs/${id}`);
        if (status === 404) {
          localStorage.removeItem(RUN_ID_KEY);
          return;
        }
        if (status !== 200) return;
        // Ended while the page was closed (in another tab, say)
        if (data.status !== "open") return this.finishRun(data);
        this.showOpenRun(data);
      } catch {
        this.unavailable = true;
      }
    },

    async startGame() {
      if (this.busy) return;
      this.busy = true;
      try {
        const { status, data } = await api("POST", "/api/runs");
        // Too many requests. Nothing sends this yet; it is here for when starting
        // runs gets rate-limited (see docs/adr/0001-server-runs-the-game.md).
        if (status === 429) {
          this.notice = "Slow down a moment, then try again.";
          return;
        }
        if (status !== 201) throw new Error(`POST /api/runs returned ${status}`);
        this.unavailable = false;
        this.notice = null;
        this.runId = data.id;
        localStorage.setItem(RUN_ID_KEY, data.id);
        this.showOpenRun(data);
      } catch (error) {
        console.error(error);
        this.unavailable = true;
      } finally {
        this.busy = false;
      }
    },

    // Returns true when the pick was applied and the boxes are now revealed.
    async selectBox(boxId) {
      if (this.game.phase !== "playing" || this.busy) return false;
      this.busy = true;
      try {
        const { status, data } = await api("POST", `/api/runs/${this.runId}/picks`, {
          round: this.game.roundNumber,
          box: boxId,
        });
        if (status === 409) {
          this.showOpenRun(data.run);
          return false;
        }
        if (status === 404) {
          this.runGone();
          return false;
        }
        if (status !== 200) throw new Error(`pick returned ${status}`);

        this.unavailable = false;
        const run = data.run;
        this.game = {
          ...this.game,
          boxes: revealedBoxes(data.boxes),
          selectedBoxId: boxId,
          currentScore: run.score,
          phase: run.status === "busted" ? "lost" : "revealing",
        };
        if (run.status === "busted") this.finishRun(run);
        return true;
      } catch (error) {
        console.error(error);
        this.unavailable = true;
        return false;
      } finally {
        this.busy = false;
      }
    },

    // After the reveal pause: the next round's boxes, still hidden.
    advanceRound() {
      if (this.game.phase !== "revealing") return;
      this.game = {
        ...this.game,
        phase: "playing",
        boxes: hiddenBoxes(),
        roundNumber: this.game.roundNumber + 1,
        selectedBoxId: null,
      };
    },

    async cashOut() {
      if (!this.canCashOut || this.busy) return;
      this.busy = true;
      try {
        const { status, data } = await api("POST", `/api/runs/${this.runId}/cash-out`, {
          round: this.game.roundNumber,
        });
        if (status === 409) return this.showOpenRun(data.run);
        if (status === 404) return this.runGone();
        if (status !== 200) throw new Error(`cash out returned ${status}`);

        const run = data.run;
        this.game = {
          ...this.game,
          phase: "cashed_out",
          boxes: revealedBoxes(data.boxes),
          currentScore: run.score,
          roundNumber: run.roundsSurvived,
        };
        this.finishRun(run);
      } catch (error) {
        console.error(error);
        this.unavailable = true;
      } finally {
        this.busy = false;
      }
    },

    resetGame() {
      return this.startGame();
    },

    // The server no longer lets this browser act on the run: it belonged to
    // an account that was logged out or deleted (maybe in another tab). The
    // server is fine, so this is not "unavailable"; the run is just gone.
    runGone() {
      localStorage.removeItem(RUN_ID_KEY);
      this.runId = null;
      this.unavailable = false;
      this.game = initialGame();
      this.notice = "That run is no longer available. Start a new one.";
    },

    // Called once a player has a display name: takes ownership of the guest
    // run this browser just finished, if there is one.
    async claimFinishedRuns() {
      const ids = loadClaimable();
      if (ids.length === 0) return;
      try {
        // The server claims whichever of these still qualify and ignores the
        // rest (already owned, or deleted after a day). Either way this
        // browser has nothing left to do with any of them.
        const { status, data } = await api("POST", "/api/runs/claim", { ids });
        if (status === 200 || status === 400) localStorage.removeItem(CLAIMABLE_RUNS_KEY);
        // Claimed runs just joined the leaderboards
        if (data?.claimed > 0) this.runsFinished++;
      } catch (error) {
        console.error(error);
      }
    },

    /** @param {RunView} run */
    showOpenRun(run) {
      if (run.status !== "open") {
        // Ended elsewhere (another tab): start fresh rather than show a stale run.
        this.finishRun(run);
        this.game = initialGame();
        return;
      }
      this.runId = run.id;
      this.game = {
        phase: "playing",
        currentScore: run.score,
        boxes: hiddenBoxes(),
        roundNumber: run.roundsSurvived + 1,
        selectedBoxId: null,
      };
    },

    /** @param {RunView} run */
    finishRun(run) {
      // Nothing left to resume. An unowned run that ended by cash out or bust
      // moves to the claimable slot; an owned or abandoned one is done.
      localStorage.removeItem(RUN_ID_KEY);
      if (!run.owned && run.status !== "abandoned") addClaimable(run.id);
      this.runsFinished++;
    },
  },
});
