import { createInitialState, startGame, selectBox, cashOut, resetGame } from './engine.js'

function assert(description, condition) {
  console.log(condition ? `✅ ${description}` : `❌ ${description}`)
}

// setup
const initial = createInitialState()
const playing = startGame(initial)

// startGame
assert('startGame sets phase to playing', playing.phase === 'playing')
assert('startGame generates 4 boxes', playing.boxes.length === 4)
assert('startGame has exactly one zero box', playing.boxes.filter(b => b.points === 0).length === 1)
assert('startGame resets score to 0', playing.currentScore === 0)

// selectBox - zero selected
const zeroBox = playing.boxes.find(b => b.points === 0)
const afterLoss = selectBox(playing, zeroBox.id)

assert('selecting zero sets phase to lost', afterLoss.phase === 'lost')
assert('selecting zero reveals the box', afterLoss.boxes.find(b => b.id === zeroBox.id).isRevealed === true)

// selectBox - non-zero selected
const nonZeroBox = playing.boxes.find(b => b.points !== 0)
const afterWin = selectBox(playing, nonZeroBox.id)

assert('selecting non-zero keeps phase as playing', afterWin.phase === 'playing')
assert('selecting non-zero adds points', afterWin.currentScore === nonZeroBox.points)
assert('selecting non-zero advances the round', afterWin.roundNumber === 2)

// cashOut
const cashedOut = cashOut(afterWin)
assert('cashOut sets phase to cashed_out', cashedOut.phase === 'cashed_out')
assert('cashOut preserves the score', cashedOut.currentScore === afterWin.currentScore)

// guards
assert('selectBox ignores calls when not playing', selectBox(initial, 0).phase === 'idle')
assert('cashOut ignores calls with zero score', cashOut(playing).phase === 'playing')

// reset
const reset = resetGame()
assert('resetGame returns idle phase', reset.phase === 'idle')
assert('resetGame zeroes the score', reset.currentScore === 0)