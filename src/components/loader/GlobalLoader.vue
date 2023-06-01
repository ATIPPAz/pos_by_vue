<template>
  <div class="loader-block" v-if="loadingState">
    <div class="loader"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineComponent, watch, inject } from 'vue'
import { loaderPluginSymbol } from '@/plugins/loading'
const loader = inject(loaderPluginSymbol)!
const loadingState = loader.loadingState
</script>
<style scoped>
.loader-block {
  background-color: rgba(115, 115, 115, 0.1);
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
}
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
