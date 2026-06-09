<template>
  <ScoreDisplay />
  <BoxGrid />
  <button @click="handleStartClick">
    <span>PLAY AGAIN</span>
  </button>
</template>

<script setup>
import { useGameStore } from '../stores/useGameStore.js'
import ScoreDisplay from './ScoreDisplay.vue';
import BoxGrid from './BoxGrid.vue';

const store = useGameStore()

function handleStartClick() {
  store.startGame();
}
</script>

<style scoped>
button {
  container: btn / inline-size;
  display: block;
  margin: var(--space-md) auto 0;
  background-color: var(--color-button);
  height: 4rem;
  width: 100%;
  max-width: 30rem;
  grid-column: span 2;
  border: none;
  border-radius: 0.5rem;
  color: var(--color-text);
  font-size: 1.25rem;
}

@container btn (min-width: 376px) {
  span {
    font-size: 2rem;
  }
}

button:hover {
  background-color: var(--color-button-hover);
  filter: drop-shadow(0 0 1rem var(--color-button));
  cursor: pointer;
}
</style>