<template>
  <RouterView />
  <GlobalLoader />
  <ToastNotification />
</template>

<script setup lang="ts">
import GlobalLoader from '@/components/loader/GlobalLoader.vue'
import ToastNotification from '@/components/toast/ToastNotification.vue'
import { RouterView } from 'vue-router'
</script>
