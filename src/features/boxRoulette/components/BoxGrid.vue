<template>
  <div class="box-grid">
    <BoxItem v-for="box in store.boxes" :key="box.id" :box="box" @select="handleBoxClick(box.id)" />
  </div>
</template>

<script setup>
import BoxItem from "./BoxItem.vue";
import { useGameStore } from "../stores/useGameStore";
// import { storeToRefs } from "pinia";

const store = useGameStore();
// const { } = storeToRefs(store);

async function handleBoxClick(boxId) {
  // Wait for the server's answer before starting the reveal pause, or a slow
  // response would eat into the time the player gets to see the boxes.
  const revealed = await store.selectBox(boxId);
  if (!revealed) return;

  setTimeout(() => {
    store.advanceRound();
  }, 1000);
}
</script>

<style scoped>
.box-grid {
  max-width: 30rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: var(--space-sm);
  margin: 0 auto;
}
</style>
