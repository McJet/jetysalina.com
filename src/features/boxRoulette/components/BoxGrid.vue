<template>
  <div class="box-grid">
    <BoxItem>100</BoxItem>
    <BoxItem :isRevealed="true">25</BoxItem>
    <BoxItem>37</BoxItem>
    <BoxItem>40</BoxItem>
    <button><span>CASH OUT</span></button>
  </div>
</template>

<script setup>
import BoxItem from './BoxItem.vue'

</script>

<style scoped>
.box-grid {
  max-width: 30rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 2fr 2fr .75fr;
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
  border-radius: .5rem;
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