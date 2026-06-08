<template>
  <div class="container">
    <div
      class="box-item"
      :class="{ revealed: props.box.isRevealed }"
      @click="handleBoxClick"
    >
      {{ props.box.isRevealed ? props.box.points : "?" }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["box"]);
const emit = defineEmits(["select"]);

function handleBoxClick() {
  emit("select");
}
</script>

<style scoped>
.container {
  container: container / inline-size;
}

.box-item {
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  background-color: var(--color-box);
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm);
  font-size: 2rem;
}

@container container (min-width: 184px) {
  .box-item {
    font-size: 3rem;
  }
}

.box-item:hover {
  background-color: var(--color-box-hover);
  filter: drop-shadow(0 0 0.25rem var(--color-box-hover));
  cursor: pointer;
}

.revealed,
.revealed:hover {
  background-color: var(--color-box-revealed);
  cursor: default;
  filter: none;
}
</style>
