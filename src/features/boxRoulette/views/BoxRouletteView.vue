<script setup>
import NavBar from '../components/NavBar.vue'
import Game from '../components/Game.vue'
import gameController from '../gameController.js'

const { isGameOver } = gameController()
</script>

<template>
  <div class="page" :class="{ gameOver: isGameOver }">
    <NavBar v-bind:isLoggedIn="false" />
    <section class="main-view">
      <Game />
    </section>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 100%;
  min-height: 100dvh;
  background-color: #121748;
  transition: background-color 0.5s;
  color: white;
  button {
    color: white;
    background-color: transparent;
    border: none;
  }
  button:hover {
    background-color: transparent;
    border-color: transparent;
  }
}

.main-view {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 100%;
  height: 100%;
}

.gameOver {
  background-color: #481212;
}
</style>
