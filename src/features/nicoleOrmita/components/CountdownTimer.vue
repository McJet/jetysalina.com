<template>
  <div class="countdown">
    <div v-for="unit in units" :key="unit.label" class="unit">
      <span class="value">{{ unit.value }}</span>
      <span class="label">{{ unit.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  target: { type: Date, required: true },
});

const now = ref(new Date());
let timer = null;

onMounted(() => {
  timer = setInterval(() => (now.value = new Date()), 1000);
});

onUnmounted(() => clearInterval(timer));

const units = computed(() => {
  const remaining = Math.max(0, props.target - now.value);
  const seconds = Math.floor(remaining / 1000);

  return [
    { label: "days", value: Math.floor(seconds / 86400) },
    { label: "hours", value: Math.floor(seconds / 3600) % 24 },
    { label: "minutes", value: Math.floor(seconds / 60) % 60 },
    { label: "seconds", value: seconds % 60 },
  ];
});
</script>

<style scoped>
.countdown {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-lg) var(--space-xl);
}

.unit {
  display: grid;
  justify-items: center;
  gap: var(--space-xs);
  min-width: 4rem;
}

.value {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 5cqi, 2.75rem);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.label {
  font-size: clamp(0.625rem, 1.6cqi, 0.8125rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
</style>
