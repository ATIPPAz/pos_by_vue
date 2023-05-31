<template>
  <NavigationBar />
  <br />
  <RouterView />
</template>
<script lang="ts" setup>
import { RouterView } from 'vue-router'
import NavigationBar from '@/components/navigation/NavigationBar.vue'
</script>
