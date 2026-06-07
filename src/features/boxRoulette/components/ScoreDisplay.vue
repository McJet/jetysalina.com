<template>
  <div class="score-display">
    <p class="start">{{ scoreString }}</p>
    <div class="divider"></div>
    <p class="end">{{ roundString }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const score = 1235356
const round = 123

const scoreString = computed(() => {
  return score.toLocaleString('en-US')
})
const roundString = computed(() => {
  return round.toLocaleString('en-US')
})

</script>

<style scoped>
.score-display {
  container: container / inline-size;
  max-width: 30rem;
  margin: 0 auto .5rem;
  display: grid;
  grid-template-columns: 1fr 2px 1fr;
  gap: var(--space-sm);
}

.divider {
  background-color: var(--color-text);
  height: 1rem;
  align-self: center;
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