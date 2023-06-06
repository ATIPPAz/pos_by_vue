<template>
  <div class="flex-container">
    <div class="flex-item" style="margin-top: 8px; text-align: center" @click="back">
      <slot name="left" :disabled="!canBack" />
    </div>
    <div class="flex-item center">
      <div class="card-slide">
        <slot name="head" />
        <br />
        <slot name="body" />
        <div style="margin-top: 16px; text-align: center" />
        <slot name="footer" />
      </div>
    </div>
    <div class="flex-item" style="margin-top: 8px" @click="next">
      <slot name="right" :disabled="!canNext" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ indexSelect: number; dataLength: number }>()
const emits = defineEmits<{ (e: 'update:indexSelect', value: number): void }>()
const canBack = computed(() => props.indexSelect > 0)
const canNext = computed(() => props.dataLength - 1 > props.indexSelect && props.indexSelect >= 0)
function back() {
  if (canBack.value) {
    emits('update:indexSelect', props.indexSelect - 1)
  }
}
function next() {
  if (canNext.value) {
    // selectUnitIndex < unitData.length - 1 && selectUnitIndex >= 0
    emits('update:indexSelect', props.indexSelect + 1)
  }
}
</script>
<style scoped>
.card-slide {
  border-radius: 8px;
  border: 1px solid rgb(168, 168, 168);
  padding: 16px;
}
.flex-container {
  display: flex;
  width: 100%;
}
.flex-item {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 5%;
}
.center {
  flex-basis: 85%;
  margin: 0px 2%;
}
</style>
