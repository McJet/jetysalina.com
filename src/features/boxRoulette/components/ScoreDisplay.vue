<template>
  <div class="score-display">
    <p class="start">{{ scoreString }}</p>
    <div class="divider">
      <span>score</span>
      <div class="line"></div>
      <span>round</span>
    </div>
    <p class="end">{{ roundString }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "../stores/useGameStore";

const store = useGameStore();
const { currentScore, roundNumber } = storeToRefs(store);

const scoreString = computed(() => currentScore.value.toLocaleString("en-US"));
const roundString = computed(() => roundNumber.value.toLocaleString("en-US"));
</script>

<style scoped>
.score-display {
  container: container / inline-size;
  max-width: 30rem;
  margin: 0 auto 0.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--space-sm);
}

.divider {
  width: fit-content;
  justify-self: center;
  align-self: center;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

span {
  color: var(--color-text-muted);
  font-size: 1rem;
}

.line {
  height: 2rem;
  width: 1px;
  background-color: var(--color-text);
}

p {
  align-self: center;
  font-size: 1.5rem;
}

@container container (min-width: 450px) {
  p {
    font-size: 2rem;
  }
}

.start {
  justify-self: start;
}

.end {
  justify-self: end;
}
</style>
