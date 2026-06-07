<template>
  <div>

  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useGameStore } from '../stores/useGameStore'

const store = useGameStore()
const {  } = storeToRefs(store)
</script>

<style scoped>

</style>