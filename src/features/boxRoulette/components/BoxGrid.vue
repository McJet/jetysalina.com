<template>
  <div class="box-grid">
    <BoxItem
      v-for="box in store.boxes"
      :key="box.id"
      :box="box"
      @select="store.selectBox(box.id)"
    />
    <button v-if="isPlaying" @click="handleCashOutClick">
      <span>CASH OUT</span>
    </button>
    <button v-if="isIdle" @click="handleStartClick">
      <span>START</span>
    </button>
  </div>
</template>

<script setup>
import BoxItem from "./BoxItem.vue";
import { useGameStore } from "../stores/useGameStore";
import { storeToRefs } from "pinia";

const store = useGameStore();
const { isPlaying, isIdle } = storeToRefs(store);

function handleCashOutClick() {
  store.cashOut();
}
function handleStartClick() {
  store.startGame();
}
</script>

<style scoped>
.box-grid {
  max-width: 30rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 2fr 2fr 0.75fr;
  gap: var(--space-sm);
  margin: 0 auto;
}

button {
  container: btn / inline-size;
  background-color: var(--color-button);
  height: 100%;
  width: 100%;
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
</style>
