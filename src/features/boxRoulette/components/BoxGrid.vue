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

function handleBoxClick(boxId) {
  store.selectBox(boxId);

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
