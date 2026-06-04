<script setup>
import '@/features/landing/styles/main.css'
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="not-found container">
    <h1>404</h1>
    <p>Page not found.</p>
    <RouterLink to="/" class="button inverted">Go home</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh);
  gap: 1rem;
  text-align: center;
}
</style>
