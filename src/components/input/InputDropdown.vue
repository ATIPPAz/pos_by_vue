<template>
  <select v-model="optionSelect">
    <option v-for="option in options" :value="option.id" :key="option.id">
      {{ option.label }}
    </option>
  </select>
</template>
<script setup lang="ts">
import type { Option } from '@/interface/dropdown'
import { computed } from 'vue'

const props = defineProps<{
  options: Option[]
  modelValue: any
}>()
const emit = defineEmits<{ (e: 'update:modelValue', value: any): void }>()

const optionSelect = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>
