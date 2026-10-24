<template>
  <ScoreDisplay />
  <BoxGrid />
  <p v-if="store.unavailable" class="unavailable">
    Couldn't reach the server. Pick again to retry.
  </p>
  <button v-if="isPlaying" :disabled="!store.canCashOut || store.busy" @click="handleCashOutClick">
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

button:disabled,
button:disabled:hover {
  opacity: 0.5;
  background-color: var(--color-button);
  filter: none;
  cursor: default;
}

.unavailable {
  max-width: 30rem;
  margin: var(--space-sm) auto 0;
  color: var(--color-text-muted);
  text-align: center;
}
</style>