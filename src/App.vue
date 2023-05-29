<template>
  <RouterView />
  <GlobalLoader />
  <ToastNotification />
</template>

<script lang="ts">
import GlobalLoader from '@/components/loader/GlobalLoader.vue'
import { defineComponent } from 'vue'
import ToastNotification from '@/components/toast/ToastNotification.vue'
import { RouterView } from 'vue-router'
export default defineComponent({
  components: {
    RouterView,
    ToastNotification,
    GlobalLoader
  }
})
</script>
