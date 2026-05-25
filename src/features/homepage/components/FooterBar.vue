<script setup>
  const year = new Date().getFullYear();
</script>

<template>
  <footer class="footer-bar">
    <div class="container">
      <p class="caption">&copy; {{ year }} Jet Ysalina. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer-bar {
  width: 100%;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.05);
  font-size: 0.9em;
  p {
    margin: 0 auto;
    text-align: center;
  }
}
</style>
