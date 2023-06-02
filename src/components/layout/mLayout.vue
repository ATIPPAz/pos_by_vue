<template>
  <NavigationBar />
  <br />
  <RouterView />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NavigationBar } from '@/components/navigation'
</script>
