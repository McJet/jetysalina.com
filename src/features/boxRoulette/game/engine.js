/**
 * @typedef {'idle' | 'playing' | 'lost' | 'cashed_out'} GamePhase
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
 */

// private helpers
/**
 * @param { number } boxAmount
 * @returns { number[] }
 */
function generateBoxValues() {
  return [0, Math.random(1, 100), Math.random(1, 100), Math.random(1, 100)];
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
 * @param { number } roundNumber
 * @returns { Box[] }
 */
function generateRound() {
    const values = generateBoxValues()
    const shuffled = fisherYatesShuffle(values)

    return shuffled.map((points, index) => ({
        id: index,
        points,
        isRevealed: false,
    }))
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
  };
}
/**
 * @param { GameState } state
 * @returns { GameState }
 */
export function startGame(state) {
    return {
        ...state,
        phase: 'playing',
        currentScore: 0,
        boxes: generateRound(),
        roundNumber: 1,
    }
}
/**
 * @param { GameState } state
 * @param { number } boxId
 * @returns { GameState }
 */
export function selectBox(state, boxId) {
    if (state.phase !== 'playing') return state

    const box = state.boxes.find(b => b.id === boxId)
    if (!box || box.isRevealed) return state

    const updatedBoxes = state.boxes.map (b => b.id === boxId ? {...b, isRevealed: true} : b)

    if (box.points === 0) {
        return {
            ...state,
            phase: 'lost',
            boxes: updatedBoxes,
        }
    }

    const newScore = state.currentScore + box.points
    const newRound = state.roundNumber + 1

    return {
        ...state,
        currentScore: newScore,
        boxes: generateRound(),
        roundNumber: newRound,
    }
}
/**
 * @param { GameState } state
 * @returns { GameState }
 */
export function cashOut(state) {
    if (state.phase !== 'playing' || state.currentScore === 0) return state

    return {
        ...state,
        phase: 'cashed_out',
    }
}
/**
 * @returns { GameState }
 */
export function resetGame() {
    return createInitialState()
}
