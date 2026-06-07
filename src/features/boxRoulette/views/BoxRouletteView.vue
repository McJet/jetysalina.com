<template>
  <div class="view">
    <div class="inner-view">
      <div class="main-container">
        <ScoreDisplay />
        <BoxGrid />
      </div>
      <div class="leaderboard-container">
        leaderboard
      </div>
    </div>
  </div>
</template>

<script setup>
// import { storeToRefs } from 'pinia'
// import { useGameStore } from '../stores/useGameStore'
import BoxGrid from '../components/BoxGrid.vue';
import ScoreDisplay from '../components/ScoreDisplay.vue';

// const store = useGameStore()
// const {  } = storeToRefs(store)
</script>

<style scoped>
@import '../styles/variables.css';

.view {
  container: view / inline-size;
  background-color: var(--color-background);
  color: var(--color-text);
  min-height: 100dvh;
}

.inner-view {
  display: grid;
  max-width: 90rem;
  margin: 0 auto;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, 1fr);
  gap: var(--space-md);
  padding: var(--space-sm);
}

@container view (min-width: 376px) {
  .inner-view {
    padding: var(--space-lg);
  }
}

@container view (min-width: 800px) {
  .inner-view {
    grid-template-columns: 1.5fr 1fr;
    grid-template-rows: 1fr;
  }
}

.main-container {}

.leaderboard-container {}
</style>