<template>
  <div id="toast" v-show="toastState.openToast">
    <span id="toast-close" class="close"> &times; </span>
    <div class="toast-header">
      <div
        id="toast-color"
        :style="toastState.color ? { backgroundColor: toastState.color } : {}"
      />
      <p style="margin: 0px" id="toast-header-text">{{ toastState.header }}</p>
    </div>
    <div class="toast-content" id="toast-content">{{ toastState.content }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject } from 'vue'
import { toastPluginSymbol } from '@/plugins/toast'
export default defineComponent({
  setup() {
    const toast = inject(toastPluginSymbol)!
    const toastState = toast.toastState
    return {
      toastState
    }
  }
})
</script>
