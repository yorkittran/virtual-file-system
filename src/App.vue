<script setup lang="ts">
import { RouterView } from 'vue-router'
console.log(import.meta.env.VFS_SERVER_ENDPOINT)
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
@import '@/assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}
</style>
