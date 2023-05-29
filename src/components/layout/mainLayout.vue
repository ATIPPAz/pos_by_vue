<template>
  <!-- <HomeView></HomeView> -->
  <RouterView />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
export default defineComponent({
  components: { RouterView }
})
</script>
