<script setup>
import { socialLinks } from '../data/socialLinks.js'

function goTo(id) {
  const el = document.querySelector(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="hero" id="heroSection">
    <div class="container">
      <h1 class="text-center">Full-Stack Web Developer</h1>
      <p class="text-center">
        Hello! My name is Jet.<br />
        I am a professional software developer, wannabe graphic designer, and
        tech enthusiast.<br />
        Welcome! I hope you enjoy your stay.
      </p>
      <div class="mt-1 btn-container">
        <button class="inverted" @click="goTo('#projectSection')">
          View My Work
        </button>
      </div>
      <div class="mt-1 btn-container">
        <a
          v-for="link in socialLinks"
          :key="link.url"
          :href="link.url"
          :alt="link.alt"
          target="_blank"
        >
          <component :is="link.svg" size="24" stroke-width="2" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  height: calc(100vh - 56px);
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 5rem;
    padding-bottom: 5rem;
  }
  .btn-container {
    display: flex;
    gap: 0.5rem;
    a {
      padding: 0.5rem;
    }
  }
}
</style>
