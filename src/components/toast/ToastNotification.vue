<template>
  <div class="toast" v-show="toastState.openToast">
    <span class="close toast-close"> &times; </span>
    <div class="toast-header">
      <div
        class="toast-color"
        :style="toastState.color ? { backgroundColor: toastState.color } : {}"
      />
      <p style="margin: 0px">{{ toastState.header }}</p>
    </div>
    <div class="toast-content">{{ toastState.content }}</div>
  </div>
</template>
<script lang="ts" setup>
import { inject } from 'vue'
import { toastPluginSymbol } from '@/plugins/toast'
const toast = inject(toastPluginSymbol)!
const toastState = toast.toastState
</script>
<style scoped>
.toast {
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: white;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border: 1px solid black;
  border-radius: 8px;
  width: 300px;
  height: auto;
  padding: 16px;
}

.toast-content {
  margin-top: 8px;
}

.toast-header {
  font-size: 24px;
  font-weight: bold;
  display: flex;
}

.toast-color {
  width: 5px;
  margin-right: 8px;
  background-color: red;
}
</style>
