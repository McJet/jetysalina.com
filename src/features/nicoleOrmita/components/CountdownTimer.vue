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
/* Four equal columns that share whatever width there is, rather than four
   fixed 4rem columns - at 320px the fixed version needed 304px of content
   box and only 288px existed, so the row overflowed the screen.
   The max-width is 4 x 4rem plus 3 x 1rem of gap: the size it settles at
   once there is room, so nothing changes on a roomier screen. */
.countdown {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: clamp(var(--space-sm), 2.5cqi, var(--space-md));
  width: 100%;
  max-width: 22rem;
}

.unit {
  display: grid;
  justify-items: center;
  gap: var(--space-xs);
  flex: 1 1 0;
  min-width: 0;
}

.value {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 5cqi, 2rem);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.label {
  font-size: clamp(0.625rem, 1.6cqi, 0.8125rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

/* "seconds" and "minutes" are the widest labels and cannot wrap, so the
   tracking comes in a little at the sizes where a column is tightest. */
@container view (width < 380px) {
  .label {
    letter-spacing: 0.12em;
  }
}
</style>
