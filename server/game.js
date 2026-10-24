// Box Roulette rules. Pure functions: no database, no requests, so they can
// be tested on their own (see game.test.js).

export const BOX_COUNT = 4;
export const MAX_POINTS = 99;

// A uniform random integer from 0 to max - 1, from the platform's secure
// random source (Math.random is predictable enough to matter for a game
// people compete on).
//
// `% max` alone would be slightly biased: 2^32 isn't a multiple of most
// numbers, so the lowest values would come up a tiny bit more often.
// Rejecting the incomplete top slice of the range removes that.
export function randomInt(max) {
  const limit = Math.floor(2 ** 32 / max) * max;
  const buffer = new Uint32Array(1);
  let value;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % max;
}

// One round's boxes: one empty (0) and the rest worth 1-99, in random order.
// `random` is swappable so tests can make rounds predictable.
export function rollRound(random = randomInt) {
  const values = [0];
  for (let i = 1; i < BOX_COUNT; i++) values.push(1 + random(MAX_POINTS));

  // Fisher-Yates shuffle: every order equally likely
  for (let i = values.length - 1; i > 0; i--) {
    const j = random(i + 1);
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

export function isValidBox(box) {
  return Number.isInteger(box) && box >= 0 && box < BOX_COUNT;
}
