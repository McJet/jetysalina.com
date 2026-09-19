<template>
  <nav class="nav" aria-label="Main">
    <ul class="links">
      <li v-for="page in pages" :key="page.id">
        <button
          type="button"
          class="link"
          :class="{ current: page.id === modelValue }"
          :aria-current="page.id === modelValue ? 'page' : undefined"
          @click="emit('update:modelValue', page.id)"
        >
          {{ page.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
defineProps({
  modelValue: { type: String, required: true },
  pages: { type: Array, required: true },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped>
.nav {
  display: flex;
  justify-content: center;
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.links {
  display: flex;
  gap: var(--space-xl);
  margin: 0;
  padding: 0;
  list-style: none;
}

.link {
  padding: var(--space-xs) 0;
  border: none;
  border-bottom: 1px solid transparent;
  background: none;
  color: var(--color-text-muted);
  font: inherit;
  font-size: clamp(0.75rem, 1.8cqi, 0.9375rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
}

.link:hover {
  color: var(--color-text);
}

.link.current {
  border-bottom-color: var(--color-text);
  color: var(--color-text);
}
</style>
