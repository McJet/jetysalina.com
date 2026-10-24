<template>
  <p v-if="store.unavailable" class="unavailable">
    Box Roulette is unavailable right now. Try again in a little while.
  </p>
  <p v-else-if="store.notice" class="unavailable">{{ store.notice }}</p>
  <button :disabled="store.busy" @click="handleStartClick">
    <span>{{ store.unavailable ? "TRY AGAIN" : "START" }}</span>
  </button>
</template>

<script setup>
import { useGameStore } from '../stores/useGameStore.js'

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
  height: 10rem;
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

button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.unavailable {
  max-width: 30rem;
  margin: var(--space-md) auto 0;
  color: var(--color-text-muted);
  text-align: center;
}
</style>
