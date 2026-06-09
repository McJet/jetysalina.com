/**
 * @typedef {'idle' | 'playing' | 'revealing' | 'lost' | 'cashed_out'} GamePhase
 *
 * @typedef {Object} Box
 * @property {number} id
 * @property {number} points
 * @property {boolean} isRevealed
 *
 * @typedef {Object} GameState
 * @property {GamePhase} phase
 * @property {number} currentScore
 * @property {Box[]} boxes
 * @property {number} roundNumber
 * @property {number} selectedBoxId
 */

// private helpers
/**
 * @param { number } max
 * @returns { number }
 */
function getRandomInt(max) {
  return Math.ceil(Math.random() * (max - 1));
}
/**
 * @returns { number[] }
 */
function generateBoxValues() {
  return [0, getRandomInt(100), getRandomInt(100), getRandomInt(100)];
}
/**
 * Fisher-Yates shuffle - statistically uniform randomization
 * @param { any[] } array
 * @returns { any[] }
 */
function fisherYatesShuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
/**
 * @returns { Box[] }
 */
function generateRound() {
  const values = generateBoxValues();
  const shuffled = fisherYatesShuffle(values);

  return shuffled.map((points, index) => ({
    id: index,
    points,
    isRevealed: false,
  }));
}
/**
 * @param { Box[] } boxes
 * @returns { Box[] }
 */
function revealBoxes(boxes) {
  return boxes.map((b) => ({ ...b, isRevealed: true }));
}

// public functions
/**
 * @returns { GameState }
 */
export function createInitialState() {
  return {
    phase: "idle",
    currentScore: 0,
    boxes: [],
    roundNumber: 0,
    selectedBoxId: null,
  };
}
/**
 * @param { GameState } state
 * @returns { GameState }
 */
export function startGame(state) {
  return {
    ...state,
    phase: "playing",
    currentScore: 0,
    boxes: generateRound(),
    roundNumber: 1,
  };
}
/**
 * @param { GameState } state
 * @param { number } boxId
 * @returns { GameState }
 */
export function selectBox(state, boxId) {
  if (state.phase !== "playing") return state;

  const box = state.boxes.find((b) => b.id === boxId);
  if (!box || box.isRevealed) return state;

  const revealedBoxes = revealBoxes(state.boxes);

  if (box.points === 0) {
    return {
      ...state,
      phase: "lost",
      boxes: revealedBoxes,
      selectedBoxId: boxId,
    };
  }

  return {
    ...state,
    phase: "revealing",
    currentScore: state.currentScore + box.points,
    boxes: revealedBoxes,
    selectedBoxId: boxId,
  };
}
/**
 * @param { GameState } state
 * @returns { GameState }
 */
export function advanceRound(state) {
  if (state.phase !== "revealing") return state;

  const newRound = state.roundNumber + 1;

  return {
    ...state,
    phase: "playing",
    boxes: generateRound(),
    roundNumber: newRound,
    selectedBoxId: null,
  };
}
/**
 * @param { GameState } state
 * @returns { GameState }
 */
export function cashOut(state) {
  if (state.phase !== "playing" || state.currentScore === 0) return state;

  const revealedBoxes = revealBoxes(state.boxes);

  return {
    ...state,
    phase: "cashed_out",
    boxes: revealedBoxes,
    roundNumber: state.roundNumber - 1,
  };
}
/**
 * @returns { GameState }
 */
export function resetGame() {
  const state = createInitialState();
  return startGame(state);
}
