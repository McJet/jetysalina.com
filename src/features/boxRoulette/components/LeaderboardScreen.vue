<template>
  <div class="leaderboard">
    <ul>
      <li v-for="item in store.leaderboard" :key="item.date">
        <div class="score">{{ item.score }} points in {{ item.rounds }} {{ roundString(item.rounds) }}</div>
        <div class="date">{{ convertTimeFromNow(item.date) }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useGameStore } from '../stores/useGameStore'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const store = useGameStore()
let interval = null;
const currentTime = ref(dayjs())

function convertTimeFromNow(isoString) {
  currentTime.value; // forces to rerun this function when value
  const dayjsTime = dayjs(isoString)
  return dayjsTime.fromNow()
}

function roundString(rounds) {
  if (rounds == 1) return "round"
  return "rounds"
}

onMounted(() => {
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
  max-width: 17rem;
  margin: 0 auto;
}

li {
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.5rem;
}

.score {
  font-size: 1rem;
}

.date {
  color: var(--color-text-muted);
  font-size: .75rem;
  font-style: italic;
}
</style>