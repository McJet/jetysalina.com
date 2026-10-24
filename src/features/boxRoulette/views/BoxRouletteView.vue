<template>
  <div class="view">
    <div class="inner-view">
      <div class="main-container">
        <StartScreen v-if="store.isIdle" />
        <GameScreen v-else-if="store.isPlaying || store.isRevealing" />
        <LostScreen v-else-if="store.isLost" />
        <CashOutScreen v-else-if="store.isCashOut" />
      </div>
      <div class="leaderboard-container">
        <AccountPanel />
        <LeaderboardScreen />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/useGameStore'
import StartScreen from '../components/StartScreen.vue';
import GameScreen from '../components/GameScreen.vue';
import LostScreen from '../components/LostScreen.vue';
import CashOutScreen from '../components/CashOutScreen.vue';
import LeaderboardScreen from '../components/LeaderboardScreen.vue';
import AccountPanel from '../components/AccountPanel.vue';
import { onMounted, watch } from 'vue';
import { useAccountStore } from '@/shared/stores/useAccountStore.js';

const store = useGameStore()
const account = useAccountStore()

onMounted(() => store.resume())

// 'ready' means logged in with a display name: the moment a guest run this
// browser just finished can become theirs. Covers both coming back from
// login and choosing a name for the first time.
watch(
  () => account.status,
  (status) => {
    if (status === 'ready') store.claimFinishedRuns()
  },
  { immediate: true },
)
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
</style>