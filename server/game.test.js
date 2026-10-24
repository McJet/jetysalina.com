// Run with: node server/game.test.js
/* global process */
import { randomInt, rollRound, isValidBox, BOX_COUNT, MAX_POINTS } from './game.js'

let failed = 0
function assert(description, condition) {
  console.log(condition ? `✅ ${description}` : `❌ ${description}`)
  if (!condition) failed++
}

// rollRound
for (let i = 0; i < 1000; i++) {
  const boxes = rollRound()
  if (boxes.length !== BOX_COUNT) { assert('rollRound makes 4 boxes', false); break }
  if (boxes.filter((v) => v === 0).length !== 1) { assert('rollRound has exactly one empty box', false); break }
  if (!boxes.every((v) => Number.isInteger(v) && v >= 0 && v <= MAX_POINTS)) { assert('rollRound values are 0-99', false); break }
}
assert('1000 rolls: 4 boxes, exactly one empty, all 0-99', true)

// The empty box should land in every position about equally often
const emptyAt = [0, 0, 0, 0]
const ROLLS = 40000
for (let i = 0; i < ROLLS; i++) emptyAt[rollRound().indexOf(0)]++
const expected = ROLLS / BOX_COUNT
assert(
  `empty box position is roughly uniform ${JSON.stringify(emptyAt)}`,
  emptyAt.every((n) => Math.abs(n - expected) < expected * 0.05),
)

// randomInt
const seen = new Set()
for (let i = 0; i < 5000; i++) seen.add(randomInt(MAX_POINTS))
assert('randomInt(99) only returns 0-98', [...seen].every((n) => n >= 0 && n < MAX_POINTS))
assert('randomInt(99) reaches every value in 5000 tries', seen.size === MAX_POINTS)

// isValidBox
assert('boxes 0-3 are valid', [0, 1, 2, 3].every(isValidBox))
assert('4, -1, 1.5, "1" and null are not', ![4, -1, 1.5, '1', null].some(isValidBox))

if (failed) process.exit(1)
