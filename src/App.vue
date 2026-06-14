<template>
  <!-- App-Huelle mit Navigation und wechselnden Routen -->
  <main class="app">
    <AppNavigation />
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavigation from './components/AppNavigation.vue'
</script>

<style scoped>
/* Seitenabstand und Hintergrund fuer die ganze App */
.app {
  min-height: 100vh;
  width: 100%;
  min-width: 0;
  padding: 18px 28px 48px 252px;
}

@media (max-width: 900px) {
  .app {
    padding: 0 16px 36px;
  }
}

@media (max-width: 640px) {
  .app {
    padding: 0 12px 32px;
  }
}

@media (max-width: 380px) {
  .app {
    padding-inline: 12px;
  }
}
</style>
