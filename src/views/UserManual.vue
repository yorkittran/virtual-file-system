<script setup lang="ts">
import { ROUTES } from '@/router/index'
</script>
<template>
  <div class="root">
    <h1>User Manual Page</h1>
    <router-link :to="ROUTES.HOME.path">Home</router-link>
  </div>
</template>

<style lang="scss">
.root {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}
</style>
