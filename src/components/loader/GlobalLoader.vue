<template>
  <div class="loader" v-if="loadingState"></div>
</template>
<script lang="ts">
import { ref, defineComponent, watch, inject } from 'vue'
import { loaderPluginSymbol } from '@/plugins/loading'
export default defineComponent({
  setup() {
    const loader = inject(loaderPluginSymbol)!
    const loadingState = loader.loadingState
    return {
      loadingState
    }
  }
})
</script>
<style scoped>
.loader {
  margin: auto;
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -100px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
