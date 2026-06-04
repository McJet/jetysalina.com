<script setup>
import { RouterLink } from 'vue-router'

function goTo(id) {
  const el = document.querySelector(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<template>
  <header class="nav-bar">
    <div class="container">
      <h5 class="name">
        <RouterLink to="/" class="name">&lt;Jet Ysalina &#47;&gt;</RouterLink>
      </h5>
      <nav>
        <a @click="goTo('#heroSection')">Home</a>
        <a @click="goTo('#projectSection')">Work</a>
        <!-- <RouterLink to="/projects/box-roulette">Box Roulette</RouterLink> -->
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: rgba(0, 0, 0, 0.1) solid 1px;
  background-color: rgba(var(--color-bg), 0.5);
  backdrop-filter: blur(4px);
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0;
    padding-bottom: 0;
    height: 56px;
  }
  .name {
    margin: 0;
    text-wrap: nowrap;
    a {
      text-decoration: none;
    }
  }
  nav {
    display: none;
    flex-wrap: nowrap;
    gap: 0.5rem;
    a {
      text-decoration: none;
      font-size: 0.95em;
      font-weight: 400;
    }
  }
}
@media (min-width: 401px) {
  .nav-bar {
    .container {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    nav {
      display: flex;
    }
  }
}
</style>
