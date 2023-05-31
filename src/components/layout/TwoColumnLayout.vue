<template>
  <slot name="title" />
  <main class="grid-container">
    <slot name="left" />
    <slot name="right" />
  </main>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>
<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 14px;
}
</style>
