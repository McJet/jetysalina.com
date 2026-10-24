<template>
  <div class="leaderboard">
    <div class="tabs" role="tablist">
      <button
        v-for="tab in TABS"
        :key="tab.id"
        role="tab"
        :aria-selected="boards.tab === tab.id"
        :class="{ active: boards.tab === tab.id }"
        @click="boards.selectTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- No second login button: the account panel above is the one place to log in. -->
    <p v-if="board.status === 'guest'" class="message">
      Log in above to keep your runs, from any device.
    </p>
    <p v-else-if="board.status === 'error'" class="message">
      Couldn't load the leaderboard. Try again in a little while.
    </p>
    <p v-else-if="board.status === 'loading'" class="message">Loading…</p>
    <p v-else-if="board.rows.length === 0" class="message">
      {{ boards.tab === "global" ? "No one has cashed out yet. Be the first." : "No cashed-out runs yet." }}
    </p>

    <ul v-else>
      <li v-for="(item, index) in board.rows" :key="`${item.endedAt}-${index}`">
        <div class="score">
          <span v-if="boards.tab === 'global'" class="name">{{ item.displayName }}</span>
          {{ item.score.toLocaleString("en-US") }} in {{ item.roundsSurvived }} {{ roundString(item.roundsSurvived) }}
        </div>
        <div class="date">{{ convertTimeFromNow(item.endedAt) }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useGameStore } from '../stores/useGameStore'
import { useLeaderboardStore } from '../stores/useLeaderboardStore'
import { useAccountStore } from '@/shared/stores/useAccountStore.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const TABS = [
  { id: 'global', label: 'Global' },
  { id: 'personal', label: 'Personal' },
]

const game = useGameStore()
const account = useAccountStore()
const boards = useLeaderboardStore()
const board = computed(() => boards[boards.tab])

let interval = null;
const currentTime = ref(dayjs())

function convertTimeFromNow(timestamp) {
  currentTime.value; // forces to rerun this function when value
  return dayjs(timestamp).fromNow()
}

function roundString(rounds) {
  if (rounds == 1) return "round"
  return "rounds"
}

// A run ended or was claimed: it may have just made the board.
watch(() => game.runsFinished, () => boards.load())
// Logging in or out, or choosing a name, changes what Personal shows.
watch(() => account.status, (status, previous) => {
  if (previous !== 'loading' && boards.tab === 'personal') boards.load()
})

onMounted(() => {
  boards.load()
  interval = setInterval(() => {
    currentTime.value = dayjs()
  }, 5000)
})
onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.leaderboard {
  min-height: 30rem;
  max-width: 20rem;
  margin: 0 auto;
}

.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
  padding: var(--space-xs);
  background-color: var(--color-surface);
  border-radius: 0.5rem;
}

.tabs button {
  padding: var(--space-sm);
  background: none;
  border: none;
  border-radius: 0.375rem;
  color: var(--color-text-muted);
  font: inherit;
  cursor: pointer;
}

.tabs button:hover {
  color: var(--color-text);
}

.tabs button.active {
  background-color: var(--color-box);
  color: var(--color-text);
}

.message {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md) 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  text-align: center;
}


li {
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-sm);
  min-height: 2.5rem;
  padding: var(--space-sm);
  transition: all 1s ease;
}

li:nth-child(even) {
  background-color: var(--color-surface);
}

li:first-child {
  background: linear-gradient(315deg, var(--color-gold-muted), var(--color-gold));
  border-radius: .5rem;
  color: var(--color-background);

  .date {
    color: var(--color-surface)
  }
}

li:nth-child(-n + 3) {
  margin-bottom: var(--space-xs)
}

li:nth-child(2) {
  background: linear-gradient(315deg, var(--color-silver-muted), var(--color-silver));
  border-radius: .5rem;
  color: var(--color-background);

  .date {
    color: var(--color-surface)
  }
}

li:nth-child(3) {
  background: linear-gradient(315deg, var(--color-bronze-muted), var(--color-bronze));
  border-radius: .5rem;
  color: var(--color-background);

  .date {
    color: var(--color-surface)
  }
}

.score {
  font-size: 1rem;
}

.name {
  font-weight: bold;
  margin-right: var(--space-xs);
}

.date {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-size: .75rem;
  font-style: italic;
}
</style>
