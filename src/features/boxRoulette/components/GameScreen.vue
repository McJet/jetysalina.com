<template>
  <ScoreDisplay />
  <BoxGrid />
  <button v-if="isPlaying" @click="handleCashOutClick">
    <span>CASH OUT</span>
  </button>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useGameStore } from '../stores/useGameStore'
import ScoreDisplay from './ScoreDisplay.vue';
import BoxGrid from './BoxGrid.vue';

const store = useGameStore()
const { isPlaying } = storeToRefs(store);

function handleCashOutClick() {
  store.cashOut();
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